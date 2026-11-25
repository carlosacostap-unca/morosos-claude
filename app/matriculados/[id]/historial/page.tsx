import Form from "next/form";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { MEDIOS, formatFecha, formatPeriodo, money } from "@/lib/cuotas";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "../../../site-header";

type HistorialProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ anio?: string | string[] }>;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ANIO = /^(?!0000)[0-9]{4}$/;

async function HistorialContent({ params, searchParams }: HistorialProps) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  await connection();
  const { anio: anioParam } = await searchParams;
  const mesActual = new Date().toISOString().slice(0, 7);
  const anio =
    typeof anioParam === "string" && ANIO.test(anioParam)
      ? anioParam
      : mesActual.slice(0, 4);

  const supabase = await createClient();
  const [matriculado, pagos] = await Promise.all([
    supabase
      .from("matriculados")
      .select("numero_matricula, apellido, nombre, estado, fecha_matriculacion")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("pagos")
      .select("periodo, monto, fecha_pago, medio")
      .eq("matriculado_id", id)
      .gte("periodo", `${anio}-01-01`)
      .lte("periodo", `${anio}-12-01`),
  ]);

  if (matriculado.error || pagos.error) {
    return (
      <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
        No se pudo cargar el historial de cuotas.
      </p>
    );
  }
  if (!matriculado.data) notFound();

  const { apellido, nombre, numero_matricula, estado, fecha_matriculacion } =
    matriculado.data;
  const mesMatriculacion = fecha_matriculacion.slice(0, 7);
  const muestraPendientes = estado === "activo" || estado === "suspendido";
  const pagoPorPeriodo = new Map(pagos.data.map((pago) => [pago.periodo, pago]));
  const cuotas = [];

  for (let mes = 12; mes >= 1; mes--) {
    const periodo = `${anio}-${String(mes).padStart(2, "0")}`;
    const pago = pagoPorPeriodo.get(`${periodo}-01`);
    const pendiente = muestraPendientes && periodo >= mesMatriculacion && periodo <= mesActual;
    if (pago || pendiente) {
      cuotas.push({ periodo, pago });
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {apellido}, {nombre}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Matrícula {numero_matricula}</p>
        </div>
        <Form action={`/matriculados/${id}/historial`} className="flex items-end gap-2">
          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Año
            <input
              key={anio}
              name="anio"
              inputMode="numeric"
              pattern="(?!0000)[0-9]{4}"
              title="Ingresá un año de cuatro dígitos mayor a cero"
              maxLength={4}
              required
              defaultValue={anio}
              className="h-10 w-24 rounded-lg border border-zinc-300 bg-white px-3 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <button type="submit" className="h-10 rounded-full bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700">
            Consultar
          </button>
        </Form>
      </div>

      {cuotas.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">No hay cuotas para mostrar en {anio}.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <table aria-label={`Cuotas de ${anio}`} className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Período</th>
                <th scope="col" className="px-4 py-3 font-medium">Estado de la cuota</th>
                <th scope="col" className="px-4 py-3 font-medium">Detalle del pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800 dark:divide-zinc-800 dark:text-zinc-200">
              {cuotas.map(({ periodo, pago }) => (
                <tr key={periodo}>
                  <th scope="row" className="px-4 py-3 font-medium">{formatPeriodo(periodo)}</th>
                  <td className="px-4 py-3">
                    {pago ? (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                        Pagada
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {pago
                      ? `${money.format(Number(pago.monto))} · ${formatFecha(pago.fecha_pago)} · ${MEDIOS[pago.medio] ?? pago.medio}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default function HistorialPage(props: HistorialProps) {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-zinc-950">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
        <Link href="/matriculados" className="self-start text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400">
          Volver al padrón
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Historial de cuotas</h1>
        <Suspense fallback={<p className="text-zinc-600 dark:text-zinc-400">Cargando historial…</p>}>
          <HistorialContent {...props} />
        </Suspense>
      </main>
    </div>
  );
}
