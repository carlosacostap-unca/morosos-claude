## 1. Carga de datos sintéticos

- [x] 1.1 Crear los 60 matriculados de prueba en `supabase/seed.sql`. Verificar los 45 activos, 10 suspendidos y 5 de baja, los identificadores únicos, los tres perfiles de alta reciente y la presencia de apellidos repetidos.
- [x] 1.2 Generar entre 650 y 750 pagos para los perfiles de la propuesta. Verificar que los 24 períodos estén representados, que los cuatro medios aparezcan, que haya pagos anticipados y tardíos identificables, y que cada pago pertenezca a un matriculado de prueba con un único registro por período.
- [x] 1.3 Aplicar la carga dos veces en una base local descartable con las migraciones existentes. Verificar que el padrón quede en 70 registros, que los pagos y sus importes se conserven al repetir la carga y que una colisión con un registro ajeno aborte la operación sin dejar inserciones parciales.

## 2. Documentación y comprobación de casos

- [x] 2.1 Documentar en el README cómo cargar los datos en Supabase local y qué matrículas consultar para ver los casos principales. Verificar que los pasos se puedan seguir desde una copia del repositorio con un entorno local preparado.
- [x] 2.2 Comprobar en el mes de referencia la búsqueda por apellido, la selección de varios pendientes y los recuentos e importes del panel mensual. Verificar en el historial el cambio de año, el límite por fecha de alta, los pagos vinculados a un período distinto al de su fecha efectiva y las bajas con y sin pagos previos. Registrar en el README los resultados esperados del mes de referencia.
