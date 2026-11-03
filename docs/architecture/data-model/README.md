# Nodexa Data Model

This directory contains the versioned DBML representation of Nodexa's
relational data model.

## Files

- [`nodexa.dbml`](./nodexa.dbml): the current PostgreSQL-oriented data model.

The DBML is a design reference. It is not, by itself, a database migration or
an instruction to implement every table in the same milestone.

## Model areas

The current model is organized into these areas:

1. **Identity & Authentication**
   - `users`
   - `user_credentials`
   - `user_identities`
   - `user_sessions`
   - password recovery and email verification token tables
2. **Authorization**
   - roles, permissions, and platform role assignments
3. **Organizations & Memberships**
   - organizations, organization members, and invitations
4. **Installation Management**
   - installations, modules, phases, and managed resources
5. **Execution & Reliability**
   - installation events, outbox events, and idempotency keys

This organization describes the complete domain model. Implementation work must
follow the scope of the active GitHub issue rather than creating all tables at
once.

## Identity and authentication boundaries

The identity model follows these rules:

- A person has one internal Nodexa account represented by `users`.
- An account has one unique normalized email address.
- Local credentials are stored separately in `user_credentials`.
- External provider identities are stored separately in `user_identities`.
- Sessions are stored separately in `user_sessions` and belong to an account.
- Authentication methods belong to the same internal account; they do not
  create separate users.
- Platform permissions and organization permissions are separate concerns and
  are not implied by the existence of a row in `users`.
- Public registration is not part of the current product flow. Accounts are
  created through an invitation process.

## Current milestone scope

The Identity & Authentication milestone focuses on:

- the internal user account;
- local credentials;
- Google external identities;
- server-managed sessions;
- account status and suspension behavior;
- PostgreSQL persistence and explicit TypeORM migrations;
- HTTP authentication contracts and their tests.

The following model areas are represented for the wider product but are not
implemented as part of this milestone unless a later issue explicitly includes
them:

- invitation workflows;
- password recovery;
- email verification;
- platform and organization RBAC;
- organization membership management;
- installations and provisioning;
- execution, outbox, and reliability workflows.

The presence of a table in the DBML does not make it part of the current
implementation scope.

## Review status

The model is an initial design reference and still requires review before
TypeORM entities and migrations are created.

### Confirmed direction

- PostgreSQL is the primary database.
- TypeORM will manage persistence and explicit versioned migrations.
- Automatic schema synchronization is disabled in normal environments.
- `users` represents the internal identity boundary.
- `user_credentials`, `user_identities`, and `user_sessions` are separate
  authentication concerns.
- Google identities must be validated through OAuth 2.0 and OpenID Connect.
- Unverified external email data must not be used by itself to link accounts.
- Ambiguous linking conflicts must be rejected rather than resolved
  automatically.
- Account suspension must block new sign-ins and revoke active sessions without
  deleting the account or its memberships.

### Open questions to resolve before persistence

- Whether one account may have more than one identity for the same provider.
  The current model enforces unique `(provider, provider_subject)` but does
  not enforce unique `(user_id, provider)`.
- Whether `email_verified_at` belongs in the first implementation or should be
  deferred with the email verification workflow.
- Whether `password_reset_tokens` and `email_verification_tokens` belong in a
  future milestone rather than the first identity migration.
- The exact semantics of `active`, `suspended`, and `disabled`.
- Whether soft-deleted emails may ever be reused. The current unique constraint
  on `normalized_email` prevents reuse unless the model changes.
- The normalization policy for email addresses and the relationship between
  `email` and `normalized_email`.
- Required profile fields for accounts created or completed through Google and
  invitations.
- Session retention, cleanup, and the exact hashing/format requirements for
  `user_sessions.token_hash`.
- Foreign-key deletion behavior and whether additional database checks or
  indexes are required.

These questions should be resolved in the identity contract issue before
generating TypeORM entities or migrations.

## Change guidelines

- Keep the DBML and this README synchronized in the same pull request when a
  model decision changes.
- Use English for model notes and documentation.
- Prefer explicit constraints and indexes for identity invariants.
- Do not add tables solely for future features without an approved issue.
- Record intentional deviations from the DBML in the relevant issue or
  architecture documentation.
- Validate DBML syntax and review relationship changes before merging.

## Contribution workflow

1. Create a branch from `develop`.
2. Make the model or documentation change.
3. Update this README when scope or decisions change.
4. Run the repository quality checks.
5. Open a pull request targeting `develop`.

The `main` branch is reserved for production.