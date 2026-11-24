import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MatriculadosTable } from "./matriculados-table";

export async function MatriculadosList() {
  // La sesión depende del momento del request: render dinámico.
  await connection();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matriculados")
    .select(
      "id, numero_matricula, apellido, nombre, dni, cuit, email, telefono, domicilio, localidad, fecha_matriculacion, estado",
    )
    .order("apellido")
    .order("nombre");

  if (error) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
        No se pudo cargar el listado de matriculados.
      </p>
    );
  }

  return <MatriculadosTable matriculados={data ?? []} />;
}
