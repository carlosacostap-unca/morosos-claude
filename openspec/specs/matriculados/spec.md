# Matriculados

## Purpose

Mantener el padrón de profesionales matriculados y sus datos de identificación, contacto y estado.

## Requirements

### Requirement: Consulta del padrón

El padrón SHALL listar a los profesionales ordenados por apellido y nombre, con su matrícula, DNI, email, localidad y estado.

#### Scenario: Padrón con profesionales registrados

- **WHEN** una persona con sesión abre el padrón
- **THEN** la aplicación muestra el listado, incluidos los registros activos, suspendidos y de baja

### Requirement: Alta y edición de matriculados

El padrón SHALL permitir crear y editar un registro. El número de matrícula, apellido, nombre, DNI, fecha de matriculación y estado son obligatorios. El CUIT, email, teléfono, domicilio y localidad son opcionales.

#### Scenario: Alta con datos válidos

- **WHEN** una persona guarda un nuevo registro con datos válidos
- **THEN** el profesional aparece en el padrón

#### Scenario: Actualización de estado

- **WHEN** una persona edita un registro y guarda el estado `activo`, `suspendido` o `baja`
- **THEN** el padrón muestra el estado actualizado

### Requirement: Identificadores únicos

El sistema SHALL exigir un número de matrícula y un DNI únicos por registro, y un CUIT único cuando se informe.

#### Scenario: Identificador duplicado

- **WHEN** una persona intenta guardar un registro con matrícula, DNI o CUIT de otro matriculado
- **THEN** la aplicación rechaza el guardado e informa el conflicto
