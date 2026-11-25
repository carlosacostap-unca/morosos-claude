# Acceso

## Purpose

Permitir el ingreso al sistema con una cuenta de usuario y requerir una sesión para acceder al padrón y a los pagos.

## Requirements

### Requirement: Registro con email y contraseña

La aplicación SHALL permitir crear una cuenta con email, contraseña de al menos ocho caracteres y confirmación de contraseña.

#### Scenario: Registro con confirmación por email habilitada

- **WHEN** una persona envía datos válidos y Supabase requiere confirmación por email
- **THEN** la aplicación indica que debe confirmar la cuenta desde su correo
- **AND** abre el padrón cuando el enlace se canjea correctamente por una sesión

#### Scenario: Contraseñas distintas

- **WHEN** la confirmación difiere de la contraseña ingresada
- **THEN** la aplicación muestra un error y rechaza el registro

### Requirement: Inicio y cierre de sesión

La aplicación SHALL autenticar mediante email y contraseña y permitir cerrar la sesión desde las pantallas internas.

#### Scenario: Credenciales válidas

- **WHEN** una persona inicia sesión con credenciales válidas
- **THEN** la aplicación abre el padrón de matriculados

#### Scenario: Credenciales rechazadas

- **WHEN** Supabase rechaza el inicio de sesión
- **THEN** la aplicación informa el error en el formulario de ingreso

#### Scenario: Cierre de sesión

- **WHEN** una persona selecciona `Salir`
- **THEN** la aplicación cierra la sesión y la dirige a la pantalla de ingreso

### Requirement: Acceso a pantallas internas

La aplicación SHALL requerir una sesión válida para acceder al padrón de matriculados y al panel de pagos.

#### Scenario: Acceso directo sin sesión

- **WHEN** una persona sin sesión visita `/matriculados` o `/pagos`
- **THEN** la aplicación la redirige a `/login`
