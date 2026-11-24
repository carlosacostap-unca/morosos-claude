"use client";

import { useActionState, useEffect, useState } from "react";
import {
  createMatriculado,
  updateMatriculado,
  type FormState,
} from "./actions";

export type Matriculado = {
  id: string;
  numero_matricula: string;
  apellido: string;
  nombre: string;
  dni: string;
  cuit: string | null;
  email: string | null;
  telefono: string | null;
  domicilio: string | null;
  localidad: string | null;
  fecha_matriculacion: string;
  estado: string;
};

const estadoStyles: Record<string, string> = {
  activo:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  suspendido:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  baja: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";

export function MatriculadosTable({
  matriculados,
}: {
  matriculados: Matriculado[];
}) {
  // undefined = cerrado, null = nuevo, objeto = edición
  const [editing, setEditing] = useState<Matriculado | null | undefined>(
    undefined,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setEditing(null)}
          className="h-10 rounded-full bg-emerald-600 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          + Nuevo matriculado
        </button>
      </div>

      {matriculados.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          Todavía no hay matriculados registrados.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Matrícula</th>
                <th className="px-4 py-3 font-medium">Apellido y nombre</th>
                <th className="px-4 py-3 font-medium">DNI</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Localidad</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800 dark:divide-zinc-800 dark:text-zinc-200">
              {matriculados.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-3 font-mono">{m.numero_matricula}</td>
                  <td className="px-4 py-3">
                    {m.apellido}, {m.nombre}
                  </td>
                  <td className="px-4 py-3">{m.dni}</td>
                  <td className="px-4 py-3">{m.email}</td>
                  <td className="px-4 py-3">{m.localidad}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${estadoStyles[m.estado] ?? ""}`}
                    >
                      {m.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setEditing(m)}
                      className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing !== undefined && (
        <MatriculadoDialog
          key={editing?.id ?? "nuevo"}
          matriculado={editing}
          onClose={() => setEditing(undefined)}
        />
      )}
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
      {label}
      {required && " *"}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        className={inputClass}
      />
    </label>
  );
}

function MatriculadoDialog({
  matriculado,
  onClose,
}: {
  matriculado: Matriculado | null;
  onClose: () => void;
}) {
  const action = matriculado
    ? updateMatriculado.bind(null, matriculado.id)
    : createMatriculado;
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    { ok: false },
  );

  useEffect(() => {
    if (state.ok) onClose();
  }, [state, onClose]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <form
        action={formAction}
        className="my-8 flex w-full max-w-2xl flex-col gap-4 rounded-2xl bg-white p-6 dark:bg-zinc-900"
      >
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {matriculado ? "Editar matriculado" : "Nuevo matriculado"}
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="N.º de matrícula"
            name="numero_matricula"
            defaultValue={matriculado?.numero_matricula}
            required
          />
          <Field
            label="DNI"
            name="dni"
            defaultValue={matriculado?.dni}
            required
          />
          <Field
            label="Apellido"
            name="apellido"
            defaultValue={matriculado?.apellido}
            required
          />
          <Field
            label="Nombre"
            name="nombre"
            defaultValue={matriculado?.nombre}
            required
          />
          <Field label="CUIT" name="cuit" defaultValue={matriculado?.cuit} />
          <Field
            label="Email"
            name="email"
            type="email"
            defaultValue={matriculado?.email}
          />
          <Field
            label="Teléfono"
            name="telefono"
            defaultValue={matriculado?.telefono}
          />
          <Field
            label="Domicilio"
            name="domicilio"
            defaultValue={matriculado?.domicilio}
          />
          <Field
            label="Localidad"
            name="localidad"
            defaultValue={matriculado?.localidad}
          />
          <Field
            label="Fecha de matriculación"
            name="fecha_matriculacion"
            type="date"
            defaultValue={matriculado?.fecha_matriculacion ?? today}
            required
          />
          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Estado *
            <select
              name="estado"
              defaultValue={matriculado?.estado ?? "activo"}
              className={inputClass}
            >
              <option value="activo">Activo</option>
              <option value="suspendido">Suspendido</option>
              <option value="baja">Baja</option>
            </select>
          </label>
        </div>

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
            {pending ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
