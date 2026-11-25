# Pagos de cuotas

## Purpose

Registrar pagos de cuotas mensuales y consultar el importe cobrado y las cuotas pendientes por período.

## Requirements

### Requirement: Consulta mensual de cuotas

El panel SHALL abrir en el mes en curso por defecto y permitir consultar otros meses. Para el período elegido, deberá mostrar a los matriculados activos o suspendidos, con la cuota pagada si existe un pago y pendiente si falta registrarlo.

#### Scenario: Selección de un mes

- **WHEN** una persona elige un período mensual
- **THEN** la aplicación muestra el estado de las cuotas para ese período
- **AND** muestra el importe, la fecha y el medio de cada pago registrado

#### Scenario: Filtro de pendientes

- **WHEN** una persona activa `Solo pendientes`
- **THEN** el listado muestra únicamente las cuotas pendientes del período

### Requirement: Resumen del mes

El panel SHALL mostrar el total cobrado en pesos argentinos y las cantidades de cuotas pagadas y pendientes para los matriculados incluidos en el período.

#### Scenario: Resumen con cuotas pagadas y pendientes

- **WHEN** el período contiene cuotas pagadas y pendientes
- **THEN** la aplicación suma los importes registrados y muestra el recuento de cada estado

### Requirement: Registro individual y por lote

El panel SHALL permitir registrar un pago para uno o varios matriculados con cuotas pendientes. El registro requiere un importe mayor a cero, fecha de pago y medio de pago. Las observaciones son opcionales.

#### Scenario: Registro para varios matriculados

- **WHEN** una persona selecciona varias cuotas pendientes y confirma el formulario con datos válidos
- **THEN** el sistema guarda un pago por matriculado en el período elegido con el mismo importe, fecha y medio

### Requirement: Un pago por matriculado y período

El sistema SHALL guardar como máximo un pago por matriculado en cada período mensual y conservar el pago original ante un intento duplicado.

#### Scenario: Pago ya registrado

- **WHEN** se vuelve a solicitar el registro de una cuota que ya tiene un pago para el mismo mes
- **THEN** el pago existente se conserva
- **AND** se guardan las demás cuotas pendientes incluidas en la misma solicitud, si las hay

### Requirement: Acceso al historial anual desde el padrón

La aplicación SHALL ofrecer desde cada fila del padrón un historial de cuotas de solo lectura, accesible con una sesión válida. El historial SHALL identificar al profesional por nombre y matrícula y permitir cambiar el año consultado. El año en curso SHALL usarse cuando falte el año o el valor sea inválido.

#### Scenario: Abrir el historial desde el padrón

- **WHEN** una persona con sesión elige `Historial de cuotas` de un matriculado
- **THEN** la aplicación muestra el nombre y la matrícula seleccionados y abre el historial del año en curso

#### Scenario: Elegir otro año

- **WHEN** la persona elige un año válido distinto del que está viendo
- **THEN** el historial muestra el nuevo año para el mismo matriculado

#### Scenario: Acceso directo sin sesión

- **WHEN** una persona sin sesión abre directamente la dirección del historial
- **THEN** la aplicación la redirige a la pantalla de ingreso

#### Scenario: Matrícula inexistente

- **WHEN** una persona con sesión abre el historial de un matriculado inexistente
- **THEN** la aplicación informa que el registro no se encontró

### Requirement: Estado mensual de las cuotas del matriculado

El historial SHALL mostrar los períodos del año seleccionado del más reciente al más antiguo. Todo pago registrado para ese año SHALL aparecer como `Pagada`, con monto en pesos argentinos, fecha y medio. Los meses sin pago SHALL aparecer como `Pendiente` para matriculados activos o suspendidos desde el mes de matriculación hasta el mes en curso, ambos inclusive. Para matriculados de baja, el historial SHALL mostrar únicamente los pagos registrados.

#### Scenario: Cuota pagada fuera del período de cuotas pendientes

- **WHEN** existe un pago del año seleccionado para un mes anterior a la matriculación o posterior al mes en curso
- **THEN** el historial muestra ese mes como `Pagada` con el monto, la fecha y el medio registrados

#### Scenario: Matriculación después de comenzar el año

- **WHEN** un matriculado activo o suspendido se matriculó durante el año consultado y no tiene pagos registrados ese año
- **THEN** el historial muestra como `Pendiente` desde el mes de matriculación hasta el último mes transcurrido o en curso de ese año, según corresponda
- **AND** omite los meses anteriores a la matriculación y los meses futuros

#### Scenario: Matriculado de baja con pagos previos

- **WHEN** se consulta a un matriculado de baja con pagos en el año seleccionado
- **THEN** el historial muestra como `Pagada` cada cuota registrada de ese año y omite los meses sin pago

#### Scenario: Año sin cuotas para mostrar

- **WHEN** el año elegido no contiene pagos ni meses que correspondan como pendientes para ese matriculado
- **THEN** la aplicación muestra un mensaje indicando que el historial está vacío para ese año

#### Scenario: Error al consultar pagos

- **WHEN** falla la consulta de los pagos del matriculado
- **THEN** la aplicación informa que el historial no pudo cargarse y no muestra cuotas pendientes deducidas del error
