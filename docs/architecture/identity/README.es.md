# Contrato de identidad de Nodexa

Este documento define los límites de identidad y autenticación de Nodexa.
Complementa la [referencia del modelo de datos](../data-model/README.es.md) y
describe las decisiones que deben mantenerse estables mientras se implementan
la persistencia y la autenticación.

## Identidad

- Una persona tiene una cuenta interna de Nodexa representada por `users`.
- Una cuenta tiene un único correo normalizado.
- Los métodos de autenticación pertenecen a la cuenta interna; no representan
  cuentas diferentes de Nodexa.
- Una cuenta puede tener autenticación local mediante contraseña,
  autenticación con Google o ambos métodos vinculados a la misma cuenta.
- La existencia de una fila en `users` no concede permisos de plataforma ni de
  organización.

## Métodos de autenticación

### Credenciales locales

La autenticación local está representada por `user_credentials` y pertenece a
un usuario. Las contraseñas nunca deben almacenarse en texto plano. El hash y
la verificación de contraseñas utilizarán Argon2id mediante una implementación
mantenida.

La aplicación actual acepta únicamente los dominios de correo listados en
`apps/api/src/modules/user/constants/email-domains.constants.ts`. El correo se
recorta y se convierte a minúsculas antes de persistir su valor normalizado.

El registro público no forma parte del flujo actual del producto. Las cuentas
se crean mediante un proceso de invitación, pero el flujo de invitaciones está
fuera del alcance de esta issue.

### Identidades externas

Las identidades de proveedores externos están representadas por
`user_identities`.

Se aplican las siguientes reglas de unicidad:

- `(provider, provider_subject)` es globalmente único: una identidad externa
  no puede pertenecer a varias cuentas de Nodexa.
- `(user_id, provider)` es único: una cuenta de Nodexa puede tener como máximo
  una identidad de cada proveedor.

Google es el primer proveedor soportado. El modelo debe permitir agregar otros
proveedores en el futuro sin introducir desde ahora una abstracción amplia de
proveedores.

Las identidades de Google deben validarse mediante OAuth 2.0 y OpenID Connect.
Los datos de correo no verificados no deben utilizarse por sí solos para
vincular una identidad externa a una cuenta. Los intentos ambiguos o
conflictivos deben rechazarse y resolverse mediante un flujo seguro explícito.

## Ciclo de vida de la cuenta

El estado de la cuenta es uno de los siguientes:

- `active`: la cuenta puede autenticarse y utilizar las capacidades concedidas
  por sus membresías y permisos.
- `suspended`: la cuenta se conserva, pero se bloquean nuevas autenticaciones y
  se revocan inmediatamente todas sus sesiones activas.
- `disabled`: la cuenta no puede autenticarse. Sus semánticas administrativas
  exactas podrán definirse más adelante, pero es distinto de una suspensión
  temporal.

Suspender o deshabilitar una cuenta no elimina la cuenta, sus métodos de
autenticación, sus membresías ni la información relacionada.

Una cuenta eliminada lógicamente no libera su correo normalizado para
reutilización según la política actual de identidad.

## Sesiones

Las sesiones administradas por el servidor están representadas por
`user_sessions` y pertenecen a un usuario.

- Un usuario puede tener varias sesiones activas.
- Cada sesión tiene un tiempo de expiración.
- Cada sesión puede revocarse individualmente.
- Suspender un usuario revoca inmediatamente todas sus sesiones activas.
- Las sesiones se entregan mediante cookies seguras, incluyendo `HttpOnly` y
  `Secure`, con una política `SameSite` apropiada.
- Los tokens de autenticación de larga duración no se almacenan en
  `localStorage` del navegador.

El almacenamiento exacto de sesiones, la política de limpieza, la
representación del token, la configuración de cookies y la estrategia CSRF
siguen siendo decisiones de implementación para las issues de persistencia y
sesiones.

La capa de persistencia actual almacena un `token_hash` único, una fecha de
expiración, fechas opcionales de último uso y revocación, el agente de usuario
y el usuario propietario. Las claves foráneas de PostgreSQL utilizan
`ON DELETE CASCADE`.

## Límite con la autorización

La identidad y la autenticación están separadas de la autorización:

- las membresías de workspace pertenecen al dominio de organizaciones;
- los permisos de workspace pertenecen a la autorización de organizaciones;
- los permisos de plataforma pertenecen a la autorización de plataforma;
- un usuario no es administrador de plataforma simplemente porque exista.

Esta issue no implementa RBAC, administración de membresías ni administración
de plataforma. El contrato de identidad solo debe proporcionar una identidad
de usuario estable para esas capacidades futuras.

## Límites del milestone

Este contrato de identidad soporta el milestone actual de Identity &
Authentication:

- cuentas internas de usuario;
- credenciales locales;
- identidades de Google;
- sesiones administradas por el servidor;
- estado y suspensión de cuentas;
- contratos de autenticación y sus pruebas.

Lo siguiente permanece fuera de esta issue y no se deriva de este contrato:

- registro público;
- implementación del flujo de invitaciones;
- recuperación de contraseña;
- verificación de correo;
- MFA;
- passkeys;
- RBAC completo;
- administración avanzada de sesiones.

## Invariantes para la implementación posterior

La persistencia y la lógica de aplicación deben conservar estos invariantes:

1. Una persona corresponde a una única cuenta interna de Nodexa.
2. Una cuenta tiene un único correo normalizado.
3. Un conjunto de credenciales locales pertenece como máximo a una cuenta.
4. Un `provider_subject` externo pertenece como máximo a una cuenta.
5. Una cuenta tiene como máximo una identidad externa por proveedor.
6. Las cuentas suspendidas o deshabilitadas no pueden iniciar nuevas sesiones.
7. Suspender una cuenta revoca inmediatamente sus sesiones activas.
8. La autenticación no concede autorización por sí misma.

## Documentación relacionada

- [Referencia del modelo de datos](../data-model/README.es.md)
- [Referencia del contrato de identidad en inglés](./README.md)
- [Flujo de migraciones de la API](../../../apps/api/README.es.md)
