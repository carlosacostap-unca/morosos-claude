## Why

Hermes necesita una forma de consultar el resumen de cobranzas de Matriculados mediante herramientas MCP. Signal permitirá conversar con el bot desde el teléfono.

## What Changes

- Exponer una herramienta MCP de solo lectura para consultar los totales de un mes desde marzo de 2026.
- Autenticar a Hermes con un token específico y limitar la conexión a una función de base de datos que devuelve agregados.
- Documentar la configuración del servidor, del perfil de Hermes y del canal Signal.

## Capabilities

### New Capabilities

- `mcp-cobranzas` permite consultar los totales mensuales de cobranzas desde Hermes.

### Modified Capabilities

## Impact

La aplicación ofrece una ruta MCP en Next.js. Supabase incorpora una función de lectura y un rol dedicado para la integración.
