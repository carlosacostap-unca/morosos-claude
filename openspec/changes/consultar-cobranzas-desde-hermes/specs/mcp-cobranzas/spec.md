## Purpose

Permitir que un cliente MCP autorizado consulte totales mensuales de cobranzas mediante una herramienta de solo lectura que devuelve datos agregados.

## ADDED Requirements

### Requirement: Consulta mensual de solo lectura para Hermes

El servidor MCP SHALL requerir una credencial de integración y ofrecer `resumen_cobranzas` para períodos desde marzo de 2026. La consulta SHALL devolver el período, la cantidad de matriculados activos o suspendidos, las cuotas pagadas y pendientes, el importe total cobrado y la moneda. El acceso a la base SHALL limitarse a la función de consulta.

#### Scenario: Consultar un mes

- **WHEN** Hermes solicita un período válido con la credencial de integración
- **THEN** recibe los totales del período para los matriculados activos y suspendidos
- **AND** el resultado contiene únicamente datos agregados

#### Scenario: Solicitud sin autorización

- **WHEN** el cliente envía una solicitud con credencial ausente o inválida
- **THEN** el servidor devuelve un error de autenticación antes de consultar la base

#### Scenario: Período fuera de rango

- **WHEN** el cliente solicita un período anterior a marzo de 2026 o con formato inválido
- **THEN** la herramienta informa el error sin consultar la base
