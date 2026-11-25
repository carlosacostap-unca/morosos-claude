## Context

La migración inicial ya carga diez ejemplos en `matriculados`. La tabla `pagos` exige una matrícula existente, un importe positivo y como máximo un pago por matriculado y período. El repositorio conserva las migraciones de Supabase.

## Goals / Non-Goals

Poder cargar los mismos casos en una base local y comprobar resultados concretos al probar el padrón, el panel mensual y el historial.

## Decisions

- Definir en `supabase/seed.sql` números de matrícula con un prefijo de demostración y usar identificadores sintéticos estables y únicos. Usar correos `example.com` cuando corresponda y dejar sin completar los datos de contacto innecesarios.
- Construir los pagos a partir de perfiles definidos y 24 meses fijos. Guardar `periodo` como el primer día del mes y `fecha_pago` como la fecha efectiva, con ejemplos que caigan en un mes anterior o posterior. Usar los cuatro medios permitidos por el esquema y documentar las matrículas y los períodos de los casos principales.
- Insertar matriculados y pagos en una sola transacción. Una segunda carga debe conservar los registros existentes y sus importes. Si un identificador coincide con un registro ajeno al conjunto, detener la carga antes de asociarle pagos.
- Documentar un mes de referencia con el número esperado de cuotas pagadas y pendientes y el importe cobrado en una base local limpia. Calcular el resultado según el panel mensual, que incluye a los activos y suspendidos. Usar el historial individual para probar los límites de las fechas de matriculación y el comportamiento de las bajas.

## Risks / Trade-offs

- El avance del calendario puede dejar la muestra fuera del mes que abre el panel por defecto. Documentar noviembre de 2026 como mes de referencia para que las verificaciones sigan siendo reproducibles.
- Los diez registros de la migración inicial cuentan para el padrón y, según su estado, para el resumen mensual. Verificar por separado el volumen del conjunto nuevo y el total que muestra la aplicación en una base recién preparada.
