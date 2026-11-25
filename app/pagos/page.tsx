import { connection } from "next/server";
import { Suspense } from "react";
import { PERIODO_MINIMO_CUOTAS } from "@/lib/cuotas";
import { SiteHeader } from "../site-header";
import { createClient } from "@/lib/supabase/server";
import { PagosPanel, type FilaPago } from "./pagos-panel";

async function PagosContent({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string | string[] }>;
}) {
  // La sesión y el mes actual dependen del momento del request: render dinámico.
  await connection();
  const { periodo: periodoParam } = await searchParams;
  const periodoSolicitado =
    typeof periodoParam === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(periodoParam)
      ? periodoParam
      : new Date().toISOString().slice(0, 7);
  const periodo = periodoSolicitado < PERIODO_MINIMO_CUOTAS ? PERIODO_MINIMO_CUOTAS : periodoSolicitado;

  const supabase = await createClient();
  const [matriculados, pagos] = await Promise.all([
    supabase
      .from("matriculados")
      .select("id, numero_matricula, apellido, nombre, estado")
      .neq("estado", "baja")
      .order("apellido")
      .order("nombre"),
    supabase
      .from("pagos")
      .select("matriculado_id, monto, fecha_pago, medio")
      .eq("periodo", `${periodo}-01`),
  ]);

  if (matriculados.error || pagos.error) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
        No se pudieron cargar los pagos.
      </p>
    );
  }

  const pagoPorMatriculado = new Map(
    (pagos.data ?? []).map((p) => [p.matriculado_id, p]),
  );
  const filas: FilaPago[] = (matriculados.data ?? []).map((m) => {
    const p = pagoPorMatriculado.get(m.id);
    return {
      id: m.id,
      numero_matricula: m.numero_matricula,
      apellido: m.apellido,
      nombre: m.nombre,
      estado: m.estado,
      pago: p
        ? { monto: Number(p.monto), fecha_pago: p.fecha_pago, medio: p.medio }
        : null,
    };
  });

  return <PagosPanel key={periodo} periodo={periodo} filas={filas} />;
}

export default function PagosPage({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string | string[] }>;
}) {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-zinc-950">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Pagos de cuotas
        </h1>
        <Suspense
          fallback={
            <p className="text-zinc-600 dark:text-zinc-400">Cargando pagos…</p>
          }
        >
          <PagosContent searchParams={searchParams} />
        </Suspense>
      </main>

      <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800">
        © CPCEC · Sistema de gestión de cobros y morosos
      </footer>
    </div>
  );
}
