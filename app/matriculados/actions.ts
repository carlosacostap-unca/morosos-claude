"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type FormState = { ok: boolean; error?: string };

const ESTADOS = ["activo", "suspendido", "baja"];

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optional(formData: FormData, key: string) {
  return text(formData, key) || null;
}

function parse(formData: FormData) {
  const values = {
    numero_matricula: text(formData, "numero_matricula"),
    apellido: text(formData, "apellido"),
    nombre: text(formData, "nombre"),
    dni: text(formData, "dni"),
    cuit: optional(formData, "cuit"),
    email: optional(formData, "email"),
    telefono: optional(formData, "telefono"),
    domicilio: optional(formData, "domicilio"),
    localidad: optional(formData, "localidad"),
    fecha_matriculacion: text(formData, "fecha_matriculacion"),
    estado: text(formData, "estado"),
  };

  if (
    !values.numero_matricula ||
    !values.apellido ||
    !values.nombre ||
    !values.dni
  ) {
    return { error: "Matrícula, apellido, nombre y DNI son obligatorios." };
  }
  if (!ESTADOS.includes(values.estado)) {
    return { error: "Estado inválido." };
  }
  if (!values.fecha_matriculacion) {
    return { error: "La fecha de matriculación es obligatoria." };
  }
  return { values };
}

function describeError(error: { code?: string; message: string }) {
  if (error.code === "23505") {
    return "Ya existe un matriculado con esa matrícula, DNI o CUIT.";
  }
  if (error.code === "42501") {
    return "No tenés permisos para guardar (política de seguridad de la base de datos).";
  }
  return "No se pudo guardar el matriculado.";
}

export async function createMatriculado(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = parse(formData);
  if (!parsed.values) return { ok: false, error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("matriculados").insert(parsed.values);
  if (error) return { ok: false, error: describeError(error) };

  revalidatePath("/matriculados");
  return { ok: true };
}

export async function updateMatriculado(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = parse(formData);
  if (!parsed.values) return { ok: false, error: parsed.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matriculados")
    .update(parsed.values)
    .eq("id", id)
    .select("id");
  if (error) return { ok: false, error: describeError(error) };
  // Con RLS, un update sin permisos no falla: simplemente no afecta filas.
  if (!data || data.length === 0) {
    return { ok: false, error: "No se pudo guardar el matriculado." };
  }

  revalidatePath("/matriculados");
  return { ok: true };
}
