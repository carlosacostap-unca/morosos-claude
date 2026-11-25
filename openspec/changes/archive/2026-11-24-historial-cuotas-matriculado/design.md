## Context

`/matriculados` ya lista los tres estados de matrícula y dispone del identificador de cada registro. El panel `/pagos` trabaja con períodos almacenados como el primer día de cada mes. La restricción única sobre `matriculado_id` y `periodo` garantiza que cada consulta mensual devuelve como máximo un pago por profesional.

## Goals / Non-Goals

Agregar una consulta anual de solo lectura que se pueda abrir desde el padrón y que use los registros y la sesión existentes.

## Decisions

1. Crear una página de servidor en `/matriculados/[id]/historial` y enlazarla desde la tabla con `Link`. La ruta queda cubierta por el patrón `/matriculados/:path*` del proxy y ofrece un enlace de regreso al padrón. Usar `?anio=AAAA` para que se pueda volver al año elegido desde el historial del navegador.
2. Obtener con el cliente de Supabase de la sesión los datos necesarios del matriculado y sus pagos del año. Validar el identificador antes de consultar y usar los límites inclusivos del 1 de enero y el 1 de diciembre para la columna `periodo`. El filtro por matriculado y período aprovecha la restricción única existente y acota el resultado a doce registros.
3. Indexar los pagos por su período y recorrer los doce meses del año de más reciente a más antiguo. Mostrar la fila pagada cuando exista un registro. Para los meses restantes, aplicar la fecha de matriculación y el estado actual. Derivar el mes en curso con la misma referencia UTC que usa el panel mensual y dar formato a los montos y fechas con las convenciones de la app.
4. Usar una tabla con período, estado y detalle del pago. Resolver y validar el año en el servidor para que la navegación desde el padrón y la apertura directa de la URL tengan las mismas reglas.

## Risks / Trade-offs

- El padrón registra el estado actual de la matrícula, mientras que `updated_at` cambia con cualquier edición. La vista usa ese estado para decidir si corresponde mostrar meses pendientes y conserva los pagos históricos de todos los estados.
- Un fallo al leer los pagos podría parecer un año sin cobros. Resolver el error antes de calcular las filas permite mostrar un mensaje distinto del estado vacío. Tratar un identificador inválido o inexistente como registro no encontrado.

## Migration Plan

Desplegar la vista con la versión de la aplicación. La consulta usa el esquema actual de Supabase y el despliegue se puede revertir junto con la versión de la app.
