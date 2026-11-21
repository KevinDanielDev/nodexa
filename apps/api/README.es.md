<p align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Logo de NestJS" />
  </a>
</p>

# API de Nodexa

Workspace de la API NestJS del monorepo de Nodexa.

## Comandos

Ejecuta estos comandos desde la raíz del repositorio:

```bash
bun run --cwd apps/api dev
bun run --cwd apps/api build
bun run --cwd apps/api lint
bun run --cwd apps/api check-types
bun run --cwd apps/api test
bun run --cwd apps/api test:e2e
```

La API expone `GET /health` como verificación y actualmente incluye endpoints
internos de cuentas, vinculación de identidades y carga de usuarios. Los flujos
de autenticación y la emisión de JWT están fuera de este milestone.

## Pruebas

La API utiliza Vitest y mantiene las pruebas organizadas de acuerdo con la
estructura de módulos de `src`:

```text
test/
├── unit/
│   └── modules/
│       ├── database/migrations/
│       ├── identities/
│       ├── seed/
│       └── user/
├── integration/
    └── modules/user/
└── e2e/
    └── identity.e2e-spec.ts
```

Las pruebas unitarias verifican el comportamiento de las entidades, las reglas
de los servicios, la idempotencia del seed, los metadatos de TypeORM, la
estructura de las migraciones, sus restricciones, índices y reversibilidad. No
requieren PostgreSQL:

```bash
bun run --cwd apps/api test
```

Las pruebas de integración de persistencia verifican restricciones específicas
de PostgreSQL para correos normalizados, credenciales, identidades externas y
sesiones. Se controlan mediante el entorno local de la API:

Vitest carga `apps/api/.env` antes de la suite mediante
`test/setup/load-env.ts`. Define `RUN_DATABASE_TESTS=true` y proporciona un
`TEST_DATABASE_URL` válido en ese archivo para ejecutar las pruebas de
integración PostgreSQL. Si la bandera no está habilitada, solo se ejecutan las
pruebas unitarias y las de integración se omiten:

```env
RUN_DATABASE_TESTS=true
TEST_DATABASE_URL=postgresql://svc_nodexa:tu_password@localhost:5432/nodexa_test
```

La suite de integración ejecuta todas las migraciones commiteadas, incluyendo
`SeedOperations1794415254760`, limpia sus registros entre casos y debe apuntar
a `nodexa_test`, nunca a la base de desarrollo. Verifica creación de cuentas,
invariantes de métodos de autenticación, unicidad de identidades, unlinking,
idempotencia del seed y cascadas de PostgreSQL. El workflow de integración PostgreSQL crea una configuración
efímera, ejecuta las migraciones y las pruebas, y elimina todos los recursos
incluso cuando falla un paso. CI genera una contraseña temporal en el runner de
GitHub, crea un `apps/api/.env` temporal y descarta ambos junto con los
recursos de PostgreSQL al finalizar el job.

El repositorio separa las responsabilidades de CI:

- `Quality Gates` ejecuta build, lint, type-check y el comando normal de tests.
- `PostgreSQL Infrastructure` verifica el entorno local de PostgreSQL con
  Podman.
- `PostgreSQL Integration` crea una `nodexa_test` efímera, aplica las
  migraciones commiteadas, ejecuta los tests unitarios y de integración con la
  base habilitada, ejecuta la suite HTTP end-to-end y elimina los recursos. El
  workflow debe fallar si no puede conectarse a la base de pruebas; omitir los
  tests de base de datos no se considera cobertura.

## Endpoints HTTP

Los endpoints internos actuales son:

- `GET /health` — verificación de salud.
- `POST /user/create` — crea una cuenta interna con credencial, identidad
  externa o ambas. Requiere al menos un método de autenticación.
- `POST /identities/link` — vincula una identidad de proveedor a una cuenta.
- `DELETE /identities/unlink` — elimina una identidad solo si permanece otro
  método de autenticación.
- `POST /seed/users` — carga el seed determinista y es idempotente mediante un
  hash del contenido.

La validación se aplica globalmente mediante `ValidationPipe` y los conflictos
de base de datos se traducen mediante el filtro global de excepciones.

## Configuración local

Copia la plantilla de variables antes de iniciar la API:

```bash
cp apps/api/.env.example apps/api/.env
```

Configura `POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER`,
`POSTGRES_PASSWORD` y `DB_HOST` de acuerdo con el PostgreSQL local. El archivo
`.env` es local y no debe committearse.

Para las pruebas locales de integración y end-to-end, configura también
`TEST_DATABASE_URL` y `RUN_DATABASE_TESTS` en el mismo archivo `.env`. Las
bases de desarrollo y pruebas pueden utilizar las mismas credenciales de
PostgreSQL, pero `TEST_DATABASE_URL` siempre debe seleccionar `nodexa_test`.

La aplicación valida únicamente los dominios de correo definidos por la
política actual de identidad. Esa lista se mantiene en
`src/modules/user/constants/email-domains.constants.ts`.

## Migraciones de base de datos

La API utiliza TypeORM con migraciones explícitas versionadas. `synchronize`
está deshabilitado. El orden de inicio local es:

1. Inicia PostgreSQL con la [configuración de Podman](../../infra/local/podman/postgres/README.es.md).
2. Ejecuta las migraciones pendientes:

   ```bash
   bun run --cwd apps/api migration:run
   ```

3. Inicia la API:

   ```bash
   bun run --cwd apps/api dev
   ```

Comandos disponibles:

```bash
bun run --cwd apps/api migration:generate
bun run --cwd apps/api migration:run
bun run --cwd apps/api migration:show
bun run --cwd apps/api migration:revert
```

Cuando cambien las entidades, genera una migración, revisa el SQL generado,
ejecútalo contra una base de datos de desarrollo desechable y commitea el
archivo de migración. Nunca reemplaces una migración ya commiteada ni actives
`synchronize` para evitar el historial. `migration:revert` está pensado para
validación local y pruebas de rollback.

El CLI utiliza `src/modules/database/data-source.ts` después de compilar la
API. El `DataSource` registra explícitamente las entidades y migraciones, y
carga las variables de entorno de forma independiente al contenedor de Nest.

La tabla `seed_operations` almacena la clave basada en el contenido, recurso,
estado, metadatos y fecha de finalización de cada seed. Una ejecución repetida
con el mismo contenido completado no inserta usuarios duplicados y las
operaciones fallidas pueden reintentarse.

## Estructura

```text
src/
├── main.ts
├── app.module.ts
└── modules/
    ├── database/
    │   ├── data-source.ts
    │   ├── database.module.ts
    │   └── migrations/
    ├── health/
    ├── common/
    ├── identities/
    ├── seed/
    └── user/
        ├── entities/
        ├── enums/
        ├── user.controller.ts
        ├── user.module.ts
        └── user.service.ts
```

## Herramientas

- NestJS para el runtime de la API.
- TypeORM y PostgreSQL para persistencia.
- Oxlint para linting.
- TypeScript mediante `packages/typescript-config`.
- Vitest para pruebas unitarias y end-to-end.
- Turborepo ejecuta los scripts del workspace desde la raíz.
