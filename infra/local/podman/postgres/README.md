# Local PostgreSQL with Podman

This directory defines the local PostgreSQL environment used by Nodexa.
Podman runs a `nodexa-dev` Pod connected to the `nodexa-net` network.

## Prerequisites

- Podman installed.

Create the local Secret before the first startup:

```bash
cp infra/local/podman/postgres/secret.example.yml \
  infra/local/podman/postgres/secret.yml
```

Change the example password in `secret.yml` if needed. The file is ignored by
Git and must never be committed.

Check whether the `nodexa-net` network already exists:

```bash
podman network ls
```

If it is not listed, create it once:

```bash
podman network create nodexa-net
```

## Lifecycle

Run these commands from the repository root:

```bash
bun run podman-kube:up
bun run podman-kube:down
bun run podman-kube:down-force
```

`podman-kube:down` stops and removes the Pod while preserving the named
PostgreSQL volume. Use `podman-kube:down-force` only when the local database
must be reset; it also removes the persistent volume.

Verify the running Pod and its containers:

```bash
podman pod ps
podman ps --pod --filter pod=nodexa-dev
```

The Pod should report `Running`, and the PostgreSQL container should report
`(healthy)`. Filter by the Pod name instead of its ID because the ID changes
when the environment is recreated.

The Pod definition uses a ConfigMap for non-sensitive PostgreSQL settings and
a local Secret for the password. The startup and liveness probes run
`pg_isready` with the `POSTGRES_USER` and `POSTGRES_DB` values injected by
`envFrom`. The probes verify PostgreSQL readiness, while an authenticated
client connection is a separate validation.

## Podman 5.8.9 cleanup note

With Podman 5.8.9, `podman kube down --force` may print
`Error: no such volume` and exit with code `125` after reporting that the
volume was removed. This behavior has been observed as a teardown anomaly, not
as a remaining Nodexa resource.

After this message, verify the cleanup explicitly:

```bash
podman pod ps
podman ps -a --pod
podman secret ls
podman volume ls
```

The Pod, containers, Secret, and volume should no longer have Nodexa resources.
This behavior has only been confirmed with Podman 5.8.9 and may differ in
other versions.
