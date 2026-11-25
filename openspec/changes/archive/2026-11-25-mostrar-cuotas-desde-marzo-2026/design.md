## Context

El panel mensual lee `periodo` de la URL y consulta un mes. El historial lee `anio` y consulta los pagos de ese año. Los pagos guardan el período de la cuota por separado de la fecha efectiva de pago.

## Decisions

- Compartir una constante para el primer período visible entre el panel mensual y el historial. Resolver solicitudes anteriores al límite antes de consultar Supabase.
- Ajustar el mes mínimo del selector y deshabilitar el botón anterior al llegar a marzo. En el historial limitar el selector de año y usar marzo como primer mes de 2026.

## Risks / Trade-offs

- Algunos enlaces pueden indicar períodos anteriores. La pantalla muestra el primer mes o año disponible y conserva el acceso a períodos posteriores.
