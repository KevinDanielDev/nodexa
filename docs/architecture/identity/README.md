# Nodexa Identity Contract

This document defines the identity and authentication boundaries for Nodexa.
It complements the [data model reference](../data-model/README.md) and
describes the decisions that must remain stable while persistence and
authentication are implemented.

## Identity

- A person has one internal Nodexa account represented by `users`.
- An account has one normalized email address.
- Authentication methods belong to the internal account; they do not represent
  separate Nodexa accounts.
- An account may have local password authentication, Google authentication, or
  both linked to the same account.
- The existence of a row in `users` does not grant platform or organization
  permissions.

## Authentication methods

### Local credentials

Local authentication is represented by `user_credentials` and belongs to one
user. Passwords must never be stored in plaintext. Password hashing and
verification use Argon2id through a maintained implementation.

Public registration is not part of the current product flow. Accounts are
created through an invitation process, but the invitation workflow is outside
the scope of this issue.

### External identities

External provider identities are represented by `user_identities`.

The following uniqueness rules apply:

- `(provider, provider_subject)` is globally unique: one external provider
  identity cannot belong to multiple Nodexa accounts.
- `(user_id, provider)` is unique: one Nodexa account can have at most one
  identity for a given provider.

Google is the first supported provider. The model should allow additional
providers later without introducing a broad provider abstraction before it is
needed.

Google identities must be validated through OAuth 2.0 and OpenID Connect.
Unverified email data must not be used by itself to link an external identity
to an account. Ambiguous or conflicting linking attempts must be rejected and
resolved through an explicit secure flow.

## Account lifecycle

The account status is one of:

- `active`: the account may authenticate and use the capabilities granted by
  its memberships and permissions.
- `suspended`: the account is retained, but new authentication is blocked and
  all active sessions are revoked immediately.
- `disabled`: the account cannot authenticate. The exact administrative
  semantics may be refined later, but it is distinct from temporary
  suspension.

Suspending or disabling an account does not delete the account, its
authentication methods, memberships, or related information.

An account that is logically deleted does not release its normalized email for
reuse under the current identity policy.

## Sessions

Server-managed sessions are represented by `user_sessions` and belong to one
user.

- A user may have multiple active sessions.
- Each session has an expiration time.
- Each session can be revoked individually.
- Suspending a user revokes all active sessions immediately.
- Sessions are delivered through secure cookies, including `HttpOnly` and
  `Secure`, with an appropriate `SameSite` policy.
- Long-lived authentication tokens are not stored in browser `localStorage`.

The exact session storage, cleanup policy, token representation, cookie
configuration, and CSRF strategy remain implementation decisions for the
relevant persistence and session issues.

## Authorization boundary

Identity and authentication are separate from authorization:

- workspace memberships belong to the organization domain;
- workspace permissions belong to organization authorization;
- platform permissions belong to platform authorization;
- a user is not a platform administrator merely because the user exists.

This issue does not implement RBAC, membership management, or platform
administration. The identity contract must only provide a stable user identity
for those future capabilities.

## Milestone boundaries

This identity contract supports the current Identity & Authentication
milestone:

- internal user accounts;
- local credentials;
- Google identities;
- server-managed sessions;
- account status and suspension;
- authentication contracts and their tests.

The following remain outside this issue and are not implied by this contract:

- public registration;
- invitation workflow implementation;
- password recovery;
- email verification;
- MFA;
- passkeys;
- complete RBAC;
- advanced session administration.

## Invariants for later implementation

Persistence and application logic must preserve these invariants:

1. One person maps to one internal Nodexa account.
2. One account has one normalized email.
3. One local credential set belongs to at most one account.
4. One external provider subject belongs to at most one account.
5. One account has at most one external identity per provider.
6. Suspended or disabled accounts cannot start new sessions.
7. Suspending an account revokes its active sessions immediately.
8. Authentication does not grant authorization by itself.

## Related documentation

- [Data model reference](../data-model/README.md)
- [Spanish identity contract reference](./README.es.md)
