export const PERIODO_MINIMO_CUOTAS = "2026-03";

export const MEDIOS: Record<string, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  debito: "Débito",
  otro: "Otro",
};

export const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

export function formatPeriodo(periodo: string) {
  const [y, m] = periodo.split("-").map(Number);
  const name = new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("es-AR", {
    month: "long",
    timeZone: "UTC",
  });
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${y}`;
}

export function formatFecha(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
