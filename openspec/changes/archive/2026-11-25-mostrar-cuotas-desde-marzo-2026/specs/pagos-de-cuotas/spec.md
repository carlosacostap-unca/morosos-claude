## MODIFIED Requirements

### Requirement: Consulta mensual de cuotas

El panel SHALL abrir en el mes en curso por defecto y permitir consultar otros meses desde marzo de 2026, inclusive. Para el período elegido, deberá mostrar a los matriculados activos o suspendidos, con la cuota pagada si existe un pago y pendiente si falta registrarlo.

#### Scenario: Selección de un mes

- **WHEN** una persona elige un período mensual desde marzo de 2026
- **THEN** la aplicación muestra el estado de las cuotas para ese período
- **AND** muestra el importe, la fecha y el medio de cada pago registrado

#### Scenario: Filtro de pendientes

- **WHEN** una persona activa `Solo pendientes`
- **THEN** el listado muestra únicamente las cuotas pendientes del período

#### Scenario: Primer mes del panel

- **WHEN** una persona llega a marzo de 2026 o abre un enlace a un período anterior
- **THEN** el panel muestra marzo de 2026 y deshabilita el botón para retroceder
- **AND** el selector de mes admite períodos desde marzo de 2026

### Requirement: Acceso al historial anual desde el padrón

La aplicación SHALL ofrecer desde cada fila del padrón un historial de cuotas de solo lectura, accesible con una sesión válida. El historial SHALL identificar al profesional por nombre y matrícula y permitir cambiar el año consultado a partir de 2026. El año en curso SHALL usarse cuando falte el año o el valor sea inválido.

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

#### Scenario: Enlace a un año anterior a 2026

- **WHEN** una persona abre el historial de un año anterior a 2026
- **THEN** la aplicación muestra el historial de 2026 para el mismo matriculado

### Requirement: Estado mensual de las cuotas del matriculado

El historial SHALL mostrar los períodos del año seleccionado desde marzo de 2026, inclusive, del más reciente al más antiguo. Todo pago para un período visible SHALL aparecer como `Pagada`, con monto en pesos argentinos, fecha y medio. Los meses visibles sin pago SHALL aparecer como `Pendiente` para matriculados activos o suspendidos desde el mes de matriculación hasta el mes en curso, ambos inclusive. Para matriculados de baja, el historial SHALL mostrar únicamente los pagos registrados para períodos visibles.

#### Scenario: Cuota pagada fuera del período de cuotas pendientes

- **WHEN** existe un pago para un período visible del año seleccionado anterior a la matriculación o posterior al mes en curso
- **THEN** el historial muestra ese mes como `Pagada` con el monto, la fecha y el medio registrados

#### Scenario: Matriculación después de comenzar el año

- **WHEN** un matriculado activo o suspendido se matriculó durante el año consultado y no tiene pagos registrados ese año
- **THEN** el historial muestra como `Pendiente` los períodos visibles desde el mes de matriculación hasta el último mes transcurrido o en curso de ese año, según corresponda
- **AND** omite los meses anteriores a la matriculación y los meses futuros

#### Scenario: Matriculado de baja con pagos previos

- **WHEN** se consulta a un matriculado de baja con pagos en períodos visibles del año seleccionado
- **THEN** el historial muestra como `Pagada` cada cuota registrada de esos períodos y omite los meses sin pago

#### Scenario: Año sin cuotas para mostrar

- **WHEN** el año elegido no contiene pagos ni meses que correspondan como pendientes dentro de los períodos visibles para ese matriculado
- **THEN** la aplicación muestra un mensaje indicando que el historial está vacío para ese año

#### Scenario: Error al consultar pagos

- **WHEN** falla la consulta de los pagos del matriculado
- **THEN** la aplicación informa que el historial no pudo cargarse y no muestra cuotas pendientes deducidas del error

#### Scenario: Primer período del historial

- **WHEN** se consulta el historial de 2026
- **THEN** el historial muestra únicamente cuotas de marzo o meses posteriores, incluidas las de marzo abonadas antes de ese mes
