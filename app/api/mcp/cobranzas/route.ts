import { createHash, timingSafeEqual } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import { consultarResumen } from "@/lib/cobranzas-mcp/resumen";
import { PERIODO_MINIMO_CUOTAS } from "@/lib/cuotas";

const noStore = { "Cache-Control": "no-store" };

function errorHttp(status: number, error: string, headers: Record<string, string> = {}) {
  return Response.json({ error }, { status, headers: { ...noStore, ...headers } });
}

async function handle(request: Request) {
  const token = process.env.COBRANZAS_MCP_TOKEN;
  const databaseUrl = process.env.COBRANZAS_MCP_DATABASE_URL;
  if (!token || !databaseUrl) return errorHttp(503, "Integración de cobranzas no configurada.");

  // Hermes se conecta de servidor a servidor y no necesita acceso desde un origen web.
  if (request.headers.has("origin")) return errorHttp(403, "Origen no permitido.");

  const supplied = request.headers.get("authorization") ?? "";
  const expectedHash = createHash("sha256").update(`Bearer ${token}`).digest();
  const suppliedHash = createHash("sha256").update(supplied).digest();
  if (!timingSafeEqual(suppliedHash, expectedHash)) {
    return errorHttp(401, "Credencial de integración inválida.", { "WWW-Authenticate": "Bearer" });
  }

  if (request.method !== "POST") return errorHttp(405, "Usá POST para invocar el MCP.", { Allow: "POST" });

  const server = new McpServer({ name: "cobranzas-cpcec", version: "1.0.0" });
  server.registerTool(
    "resumen_cobranzas",
    {
      description: "Devuelve el total cobrado y la cantidad de cuotas pagadas y pendientes de un mes, desde marzo de 2026.",
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      inputSchema: {
        periodo: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Usá el formato AAAA-MM.")
          .refine((periodo) => periodo >= PERIODO_MINIMO_CUOTAS, "El primer período disponible es marzo de 2026."),
      },
      outputSchema: {
        periodo: z.string(),
        moneda: z.literal("ARS"),
        matriculados: z.number().int().nonnegative(),
        pagadas: z.number().int().nonnegative(),
        pendientes: z.number().int().nonnegative(),
        cobrado_ars: z.string(),
      },
    },
    async ({ periodo }) => {
      try {
        const resumen = await consultarResumen(periodo, databaseUrl);
        return { structuredContent: resumen, content: [{ type: "text", text: JSON.stringify(resumen) }] };
      } catch {
        console.error("No se pudo consultar la función de resumen del MCP de cobranzas.");
        return { isError: true, content: [{ type: "text", text: "No se pudo consultar el resumen de cobranzas." }] };
      }
    },
  );

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  try {
    await server.connect(transport);
    const response = await transport.handleRequest(request);
    response.headers.set("Cache-Control", noStore["Cache-Control"]);
    return response;
  } finally {
    await server.close();
  }
}

export { handle as GET, handle as POST, handle as DELETE };
