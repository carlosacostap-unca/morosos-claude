## Context

El panel mensual calcula el total cobrado y el estado de las cuotas de matriculados activos y suspendidos. Hermes puede conectarse a un servidor MCP por Streamable HTTP y recibir mensajes por Signal mediante `signal-cli`.

## Decisions

- Usar una ruta MCP sin estado con un token de servidor a servidor. Una ejecución devuelve únicamente el período, cantidades e importe total en pesos argentinos.
- Calcular los agregados en PostgreSQL mediante una función en un esquema privado. El rol de integración tiene permiso de ejecución sobre esa función y las credenciales de base se guardan en el servidor de Matriculados.
- Mantener la credencial del cliente MCP en Hermes. Usar un canal Signal con remitentes permitidos y un puente `signal-cli` en una red privada.

## Risks / Trade-offs

- La ruta debe quedar deshabilitada hasta que las credenciales estén configuradas. El despliegue se verifica con una solicitud sin credenciales, el descubrimiento de herramientas y una consulta autorizada.
