"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type PagosFormState = { ok: boolean; error?: string; count?: number };

const MEDIOS = ["efectivo", "transferencia", "debito", "otro"];

export async function registrarPagos(
  _prev: PagosFormState,
  formData: FormData,
): Promise<PagosFormState> {
  const ids = formData
    .getAll("matriculado_id")
    .filter((v): v is string => typeof v === "string" && v !== "");
  const periodo = String(formData.get("periodo") ?? "");
  const monto = Number(formData.get("monto"));
  const fechaPago = String(formData.get("fecha_pago") ?? "");
  const medio = String(formData.get("medio") ?? "");
  const observaciones = String(formData.get("observaciones") ?? "").trim();

  if (ids.length === 0) return { ok: false, error: "Elegí al menos un matriculado." };
  if (!/^\d{4}-\d{2}$/.test(periodo)) return { ok: false, error: "Período inválido." };
  if (!Number.isFinite(monto) || monto <= 0) {
    return { ok: false, error: "El monto debe ser mayor a cero." };
  }
  if (!fechaPago) return { ok: false, error: "La fecha de pago es obligatoria." };
  if (!MEDIOS.includes(medio)) return { ok: false, error: "Medio de pago inválido." };

  const rows = ids.map((matriculado_id) => ({
    matriculado_id,
    periodo: `${periodo}-01`,
    monto,
    fecha_pago: fechaPago,
    medio,
    observaciones: observaciones || null,
  }));

  const supabase = await createClient();
  // Si alguien ya tenía ese período pagado, se respeta el pago existente.
  const { data, error } = await supabase
    .from("pagos")
    .upsert(rows, { onConflict: "matriculado_id,periodo", ignoreDuplicates: true })
    .select("id");

  if (error) {
    return {
      ok: false,
      error:
        error.code === "42501"
          ? "No tenés permisos para registrar pagos (política de seguridad de la base de datos)."
          : "No se pudieron registrar los pagos.",
    };
  }
  if (!data || data.length === 0) {
    return { ok: false, error: "Esos matriculados ya tenían el período pagado." };
  }

  revalidatePath("/pagos");
  return { ok: true, count: data.length };
}
