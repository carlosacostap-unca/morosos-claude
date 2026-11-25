## Why

La migración inicial crea diez matriculados ficticios. Un conjunto de pagos reproducible permitiría probar la búsqueda, el registro en lote, el resumen mensual y el historial anual con distintos estados de cuota.

## What Changes

- Agregar 60 matriculados ficticios. De los 45 activos, 20 estarán al día, 15 tendrán pagos intermitentes, 7 tendrán varios meses pendientes y 3 serán altas recientes. El conjunto también incluirá 10 suspendidos y 5 de baja. De los cinco de baja, tres tendrán pagos históricos y dos tendrán el historial vacío.
- Cargar alrededor de 700 pagos en 24 períodos mensuales, de diciembre de 2024 a noviembre de 2026. Incluir importes y medios variados, pagos anticipados y tardíos, apellidos repetidos y varios pendientes en un mismo mes.
- Documentar la carga en una base local y dejar casos identificables para comprobar el historial y los resultados del panel de pagos.

## Capabilities

El conjunto de prueba ejercita las capacidades existentes de padrón y pagos conforme a sus especificaciones actuales.

### New Capabilities

### Modified Capabilities

## Impact

La carga de desarrollo se agrega en `supabase/seed.sql` y su uso se documenta en el README. En una base local limpia con las migraciones existentes, el padrón resultante tendrá 70 registros.
