## 1. Consulta del historial

- [x] 1.1 Crear la ruta de servidor con la sesión existente. Verificar que un ingreso sin sesión redirige a la pantalla de acceso y que un identificador inválido o inexistente muestra un registro no encontrado.
- [x] 1.2 Leer el padrón y los pagos del matriculado para el año solicitado. Verificar que el año inválido o ausente abre el año en curso y que un fallo en la consulta de pagos muestra un error.
- [x] 1.3 Calcular las filas ordenadas por mes aplicando la fecha de matriculación y el estado actual. Verificar los límites del período, la prioridad de pagos registrados fuera de esos límites y la consulta de un matriculado de baja.

## 2. Navegación y presentación

- [x] 2.1 Agregar `Historial de cuotas` al padrón y mostrar nombre, matrícula, selector de año, filas mensuales y estado vacío. Verificar que se puede cambiar de año para el mismo profesional y regresar al padrón.
- [x] 2.2 Ejecutar `npm run lint` y `npm run build`. Validar desde el padrón el flujo de historial con cuotas pagadas y pendientes y comprobar que la navegación habitual al panel mensual de pagos funciona.
