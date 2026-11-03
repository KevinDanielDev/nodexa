# Modelo de datos de Nodexa

Este directorio contiene la representación DBML del modelo de datos
relacional de Nodexa para PostgreSQL.

El DBML es una referencia de diseño. No es una migración de base de datos ni
significa que todas las tablas modeladas deban implementarse en el mismo
milestone.

## Archivos

- [`nodexa.dbml`](./nodexa.dbml): modelo de datos actual.

## Áreas del modelo

El modelo está organizado en las siguientes áreas:

1. **Identity & Authentication**
   - `users`
   - `user_credentials`
   - `user_identities`
   - `user_sessions`
   - tokens de recuperación de contraseña y verificación de correo
2. **Authorization**
   - roles, permisos y asignaciones de roles de plataforma
3. **Organizations & Memberships**
   - organizaciones, miembros de organizaciones e invitaciones
4. **Installation Management**
   - instalaciones, módulos, fases y recursos administrados
5. **Execution & Reliability**
   - eventos de instalación, eventos outbox y claves de idempotencia

El modelo describe el dominio general de Nodexa. El alcance de implementación
lo define el milestone activo y sus issues, no la presencia de una tabla en
este archivo.

## Modelo de identidad y autenticación

El área de identidad establece las siguientes relaciones:

- `users` representa la identidad interna de una persona en Nodexa.
- Cada usuario tiene un único correo normalizado.
- `user_credentials` almacena las credenciales locales de contraseña de un
  usuario.
- `user_identities` almacena identidades de proveedores externos vinculadas a
  un usuario.
- `user_sessions` almacena sesiones administradas por el servidor que
  pertenecen a un usuario.
- Los tokens de recuperación de contraseña y verificación de correo se modelan
  separadamente de las credenciales y las sesiones.

Los métodos de autenticación pertenecen al mismo usuario interno. No
representan cuentas diferentes de Nodexa.

## Límite del milestone de identidad

El milestone actual de Identity & Authentication cubre el modelo necesario
para:

- cuentas internas de usuario;
- credenciales locales;
- identidades externas de Google;
- sesiones administradas por el servidor;
- estado y suspensión de cuentas;
- capa de persistencia y contratos de autenticación.

Las siguientes áreas modeladas están fuera de este milestone salvo que una
issue posterior las incluya explícitamente:

- flujos de invitación;
- recuperación de contraseña;
- verificación de correo;
- autorización de plataforma y organizaciones;
- administración de membresías;
- administración de instalaciones;
- flujos de ejecución y confiabilidad.

## Observaciones de revisión

El DBML es una referencia de diseño que evoluciona. Los siguientes puntos
requieren resolución antes de derivar entidades TypeORM y migraciones:

- El modelo garantiza unicidad de `(provider, provider_subject)` para
  identidades externas, pero no de `(user_id, provider)`.
- Aún debe decidirse el alcance inicial de `email_verified_at`,
  `password_reset_tokens` y `email_verification_tokens`.
- Debe definirse el significado de los estados `active`, `suspended` y
  `disabled`.
- La restricción actual sobre `normalized_email` impide reutilizar el correo
  de un usuario eliminado lógicamente.
- Deben definirse la normalización del correo y la relación entre `email` y
  `normalized_email`.
- Deben definirse los campos de perfil requeridos para los flujos de
  invitación y Google.
- Deben definirse la retención y limpieza de sesiones, además de la
  representación de `token_hash`.
- Deben revisarse el comportamiento de borrado de claves foráneas y las
  restricciones o índices adicionales.

Los cambios intencionales del modelo deben reflejarse en el DBML y en la
documentación relacionada para mantener alineada la documentación con el
modelo de datos.
