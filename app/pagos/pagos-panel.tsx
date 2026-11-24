"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { registrarPagos, type PagosFormState } from "./actions";

export type FilaPago = {
  id: string;
  numero_matricula: string;
  apellido: string;
  nombre: string;
  estado: string;
  pago: { monto: number; fecha_pago: string; medio: string } | null;
};

const MEDIOS: Record<string, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  debito: "Débito",
  otro: "Otro",
};

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";

const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

function shiftPeriodo(periodo: string, delta: number) {
  const [y, m] = periodo.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return d.toISOString().slice(0, 7);
}

function formatPeriodo(periodo: string) {
  const [y, m] = periodo.split("-").map(Number);
  const name = new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("es-AR", {
    month: "long",
    timeZone: "UTC",
  });
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${y}`;
}

function formatFecha(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function PagosPanel({
  periodo,
  filas,
}: {
  periodo: string;
  filas: FilaPago[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [onlyPending, setOnlyPending] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const stats = useMemo(() => {
    const pagadas = filas.filter((f) => f.pago);
    return {
      total: filas.length,
      pagadas: pagadas.length,
      pendientes: filas.length - pagadas.length,
      cobrado: pagadas.reduce((acc, f) => acc + (f.pago?.monto ?? 0), 0),
    };
  }, [filas]);

  const visibles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return filas.filter((f) => {
      if (onlyPending && f.pago) return false;
      if (!q) return true;
      return `${f.apellido} ${f.nombre} ${f.numero_matricula}`
        .toLowerCase()
        .includes(q);
    });
  }, [filas, query, onlyPending]);

  const pendientesVisibles = visibles.filter((f) => !f.pago);
  const allSelected =
    pendientesVisibles.length > 0 &&
    pendientesVisibles.every((f) => selected.has(f.id));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const f of pendientesVisibles) {
        if (allSelected) next.delete(f.id);
        else next.add(f.id);
      }
      return next;
    });
  }

  function goTo(p: string) {
    router.push(`/pagos?periodo=${p}`);
  }

  const progreso = stats.total ? (stats.pagadas / stats.total) * 100 : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Selector de período */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          aria-label="Mes anterior"
          onClick={() => goTo(shiftPeriodo(periodo, -1))}
          className="h-10 w-10 rounded-full border border-zinc-300 text-lg hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          ‹
        </button>
        <div className="min-w-44 text-center text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {formatPeriodo(periodo)}
        </div>
        <button
          type="button"
          aria-label="Mes siguiente"
          onClick={() => goTo(shiftPeriodo(periodo, 1))}
          className="h-10 w-10 rounded-full border border-zinc-300 text-lg hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          ›
        </button>
        <input
          type="month"
          aria-label="Elegir período"
          value={periodo}
          onChange={(e) => e.target.value && goTo(e.target.value)}
          className={`${inputClass} !w-auto`}
        />
      </div>

      {/* Resumen */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Cobrado</p>
          <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {money.format(stats.cobrado)}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Pagaron</p>
          <p className="text-2xl font-semibold text-emerald-700 dark:text-emerald-400">
            {stats.pagadas} de {stats.total}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full bg-emerald-600"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Pendientes</p>
          <p className="text-2xl font-semibold text-amber-700 dark:text-amber-400">
            {stats.pendientes}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Buscar por apellido, nombre o matrícula…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${inputClass} sm:!w-80`}
        />
        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={onlyPending}
            onChange={(e) => setOnlyPending(e.target.checked)}
            className="h-4 w-4 accent-emerald-600"
          />
          Solo pendientes
        </label>
      </div>

      {/* Tabla */}
      {visibles.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          No hay matriculados para mostrar.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label="Seleccionar todos los pendientes"
                    checked={allSelected}
                    disabled={pendientesVisibles.length === 0}
                    onChange={toggleAll}
                    className="h-4 w-4 accent-emerald-600"
                  />
                </th>
                <th className="px-4 py-3 font-medium">Matrícula</th>
                <th className="px-4 py-3 font-medium">Apellido y nombre</th>
                <th className="px-4 py-3 font-medium">Estado de la cuota</th>
                <th className="px-4 py-3 font-medium">Detalle del pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800 dark:divide-zinc-800 dark:text-zinc-200">
              {visibles.map((f) => (
                <tr
                  key={f.id}
                  className={selected.has(f.id) ? "bg-emerald-50 dark:bg-emerald-950/30" : ""}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label={`Seleccionar ${f.apellido}, ${f.nombre}`}
                      checked={selected.has(f.id)}
                      disabled={!!f.pago}
                      onChange={() => toggle(f.id)}
                      className="h-4 w-4 accent-emerald-600"
                    />
                  </td>
                  <td className="px-4 py-3 font-mono">{f.numero_matricula}</td>
                  <td className="px-4 py-3">
                    {f.apellido}, {f.nombre}
                  </td>
                  <td className="px-4 py-3">
                    {f.pago ? (
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
                    {f.pago
                      ? `${money.format(f.pago.monto)} · ${formatFecha(f.pago.fecha_pago)} · ${MEDIOS[f.pago.medio] ?? f.pago.medio}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Barra de acción por lotes */}
      {selected.size > 0 && (
        <div className="sticky bottom-4 flex items-center justify-between gap-4 rounded-full bg-zinc-900 px-6 py-3 text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900">
          <span className="text-sm font-medium">
            {selected.size} seleccionado{selected.size === 1 ? "" : "s"}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="h-9 rounded-full px-4 text-sm hover:bg-white/10 dark:hover:bg-black/10"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="h-9 rounded-full bg-emerald-600 px-5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Registrar pago
            </button>
          </div>
        </div>
      )}

      {dialogOpen && (
        <PagoDialog
          periodo={periodo}
          ids={[...selected]}
          montoSugerido={
            filas.find((f) => f.pago)?.pago?.monto.toString() ?? ""
          }
          onClose={() => setDialogOpen(false)}
          onDone={() => {
            setDialogOpen(false);
            setSelected(new Set());
          }}
        />
      )}
    </div>
  );
}

function PagoDialog({
  periodo,
  ids,
  montoSugerido,
  onClose,
  onDone,
}: {
  periodo: string;
  ids: string[];
  montoSugerido: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState<PagosFormState, FormData>(
    registrarPagos,
    { ok: false },
  );

  useEffect(() => {
    if (state.ok) onDone();
  }, [state, onDone]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <form
        action={formAction}
        className="my-8 flex w-full max-w-md flex-col gap-4 rounded-2xl bg-white p-6 dark:bg-zinc-900"
      >
        <div>
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Registrar pago
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Cuota de {formatPeriodo(periodo)} para {ids.length}{" "}
            matriculado{ids.length === 1 ? "" : "s"}.
          </p>
        </div>

        <input type="hidden" name="periodo" value={periodo} />
        {ids.map((id) => (
          <input key={id} type="hidden" name="matriculado_id" value={id} />
        ))}

        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Monto por matriculado *
          <input
            name="monto"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={montoSugerido}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Fecha de pago *
          <input
            name="fecha_pago"
            type="date"
            required
            defaultValue={today}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Medio de pago *
          <select name="medio" defaultValue="efectivo" className={inputClass}>
            {Object.entries(MEDIOS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Observaciones
          <input name="observaciones" type="text" className={inputClass} />
        </label>

        {state.error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
          >
            {state.error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-full border border-zinc-300 px-5 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={pending}
            className="h-10 rounded-full bg-emerald-600 px-5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {pending ? "Guardando…" : "Confirmar"}
          </button>
        </div>
      </form>
    </div>
  );
}
