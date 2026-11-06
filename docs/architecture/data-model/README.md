# Nodexa Data Model

This directory contains the DBML representation of Nodexa's relational data
model for PostgreSQL.

The DBML is a design reference. It is not a database migration and does not
mean that every modeled table must be implemented in the same milestone.

The current Identity & Authentication persistence is implemented through
TypeORM entities and the initial migration in
`apps/api/src/modules/database/migrations/`. The DBML describes the complete
domain model, including areas that are intentionally deferred.

## Files

- [`nodexa.dbml`](./nodexa.dbml): the current data model.

## Model areas

The model is organized into the following areas:

1. **Identity & Authentication**
   - `users`
   - `user_credentials`
   - `user_identities`
   - `user_sessions`
   - password reset and email verification tokens
2. **Authorization**
   - roles, permissions, and platform role assignments
3. **Organizations & Memberships**
   - organizations, organization members, and invitations
4. **Installation Management**
   - installations, modules, phases, and managed resources
5. **Execution & Reliability**
   - installation events, outbox events, and idempotency keys

The model describes the broader Nodexa domain. The implementation scope is
defined by the active milestone and its issues, not by the presence of a table
in this file.

## Identity & Authentication model

The identity area establishes these relationships:

- `users` represents the internal Nodexa identity of a person.
- Each user has one normalized email address.
- `user_credentials` stores local password credentials for a user.
- `user_identities` stores external provider identities linked to a user.
- `user_sessions` stores server-managed sessions belonging to a user.
- Password reset and email verification tokens are modeled separately from
  credentials and sessions.

Authentication methods belong to the same internal user. They do not represent
separate Nodexa accounts.

### Implemented identity persistence

The current migration creates:

- `users`;
- `user_credentials`;
- `user_identities`;
- `user_sessions`;
- the `user_status` and `identity_provider` PostgreSQL enums;
- the `uuid-ossp` extension required by `uuid_generate_v4()`.

The implementation enforces:

- one normalized email per account;
- one local credential set per account;
- one external identity per provider for an account;
- globally unique `(provider, provider_subject)` values;
- multiple sessions per account;
- unique session token hashes;
- cascading deletion from an account to its identity records and sessions.

The allowed local email domains are intentionally defined by the application
policy in `apps/api/src/modules/user/constants/email-domains.constants.ts`.
They are not inferred from the DBML.

## Identity milestone boundary

The current Identity & Authentication milestone covers the model needed for:

- internal user accounts;
- local credentials;
- Google external identities;
- server-managed sessions;
- account status and suspension;
- the persistence layer and authentication contracts.

The following modeled areas are outside this milestone unless a later issue
explicitly includes them:

- invitation workflows;
- password recovery;
- email verification;
- platform and organization authorization;
- organization membership management;
- installation management;
- execution and reliability workflows.

## Schema sources and migration workflow

These artifacts have different responsibilities:

- `nodexa.dbml` is the conceptual reference for the complete domain model.
- TypeORM entities are the implemented persistence model for the current
  milestone.
- TypeORM migration files are the executable, versioned database history.

The operational migration workflow belongs to the
[API workspace guide](../../../apps/api/README.md). This document only
describes how the DBML, entities, and migration history relate to one another.

## Review notes

The DBML is an evolving design reference. The current identity entities and
initial migration establish the following persistence decisions:

- External identities enforce unique `(provider, provider_subject)` and
  unique `(user_id, provider)`.
- User sessions may have multiple rows per user and are indexed by `user_id`
  and `expires_at`.
- Identity foreign keys use `ON DELETE CASCADE`.
- Identity UUID defaults use `uuid_generate_v4()` and require the PostgreSQL
  `uuid-ossp` extension.

The following points remain open for later issues:

- The first implementation scope for `email_verified_at`,
  `password_reset_tokens`, and `email_verification_tokens` remains to be
  decided.
- The semantics of the `active`, `suspended`, and `disabled` user statuses
  must be defined.
- The current unique constraint on `normalized_email` prevents reusing the
  email of a soft-deleted user.
- Email normalization and the relationship between `email` and
  `normalized_email` must be defined.
- Required profile fields for invitation and Google flows must be defined.
- Session retention, cleanup, and the representation of `token_hash` must be
  defined.

Intentional model changes should be reflected in the DBML and the related
documentation so that the documentation remains aligned with the data model.
