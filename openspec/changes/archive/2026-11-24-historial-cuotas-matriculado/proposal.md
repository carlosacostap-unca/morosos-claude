## Why

El panel de pagos está organizado por mes. Para revisar las cuotas de un profesional, hoy hay que cambiar de período y volver a buscarlo cada vez.

## What Changes

- Agregar la opción `Historial de cuotas` a cada fila del padrón y abrir la consulta en el año en curso.
- Permitir elegir el año y consultar, por mes, las cuotas pagadas y pendientes. Mostrar el monto, la fecha y el medio de los pagos registrados.
- Marcar como pendientes los meses sin pago desde la matriculación hasta el mes en curso para profesionales activos o suspendidos. Para quienes figuran de baja, mostrar los pagos registrados, ya que el padrón solo conserva el estado actual.

## Capabilities

### New Capabilities

### Modified Capabilities

- `pagos-de-cuotas` amplía la consulta de cuotas con un historial anual por matriculado.

## Impact

La consulta se incorpora al padrón y usa la sesión existente y los datos de `matriculados` y `pagos` en Supabase. Es una pantalla de solo lectura.
