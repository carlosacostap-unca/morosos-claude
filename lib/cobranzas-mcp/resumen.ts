import { Pool } from "pg";

type ResumenMensual = {
  matriculados: number;
  pagadas: number;
  pendientes: number;
  cobrado_ars: string;
};

let pool: Pool | undefined;

export async function consultarResumen(periodo: string, databaseUrl: string) {
  if (!pool) {
    const url = new URL(databaseUrl);
    // Las opciones sslmode de la URL pueden reemplazar el objeto ssl de pg.
    url.search = "";
    const ca = process.env.COBRANZAS_MCP_DATABASE_CA?.replaceAll("\\n", "\n");
    pool = new Pool({
      connectionString: url.toString(),
      ssl: { rejectUnauthorized: true, ...(ca ? { ca } : {}) },
      max: 2,
      connectionTimeoutMillis: 5_000,
      statement_timeout: 5_000,
      idleTimeoutMillis: 10_000,
      allowExitOnIdle: true,
    });
    pool.on("error", () => console.error("Se interrumpió una conexión pasiva del MCP de cobranzas."));
  }

  const result = await pool.query<ResumenMensual>(
    "select matriculados, pagadas, pendientes, cobrado_ars from hermes_cobranzas.resumen_mensual($1::date)",
    [`${periodo}-01`],
  );
  const resumen = result.rows[0];
  if (!resumen) throw new Error("Período no disponible.");
  return { periodo, moneda: "ARS" as const, ...resumen };
}
