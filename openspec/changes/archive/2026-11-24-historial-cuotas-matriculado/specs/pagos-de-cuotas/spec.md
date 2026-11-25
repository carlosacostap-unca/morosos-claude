## ADDED Requirements

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
