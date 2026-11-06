# PostgreSQL local con Podman

Esta carpeta define el entorno local de PostgreSQL utilizado por Nodexa.
Podman ejecuta un Pod llamado `nodexa-dev`, conectado a la red `nodexa-net`.

## Requisitos

- Podman instalado.

Crea el Secret local antes del primer inicio:

```bash
cp infra/local/podman/postgres/secrets/secret.example.yml \
  infra/local/podman/postgres/secrets/secret.yml
```

Cambia la contraseña de ejemplo en `secret.yml` si es necesario. El archivo
está ignorado por Git y nunca debe ser committeado.

Comprueba si la red `nodexa-net` ya existe:

```bash
podman network ls
```

Si no aparece en la lista, créala una sola vez:

```bash
podman network create nodexa-net
```

## Ciclo de vida

Ejecuta estos comandos desde la raíz del repositorio:

```bash
bun run podman-kube:up
bun run podman-kube:down
bun run podman-kube:down-force
```

`podman-kube:down` detiene y elimina el Pod, pero conserva el volumen
persistente de PostgreSQL. Usa `podman-kube:down-force` únicamente cuando
necesites reiniciar la base de datos local; también elimina el volumen.

Verifica el Pod en ejecución y sus contenedores:

```bash
podman pod ps
podman ps --pod --filter pod=nodexa-dev
```

El Pod debe mostrar el estado `Running` y el contenedor de PostgreSQL debe
mostrar `(healthy)`. Filtra por el nombre del Pod en lugar de su ID porque el
ID cambia cuando se recrea el entorno.

La definición del Pod usa un ConfigMap para la configuración no sensible de
PostgreSQL y un segundo ConfigMap para proporcionar el SQL de inicialización
sin montar un directorio del host. Esto evita problemas de permisos del
sistema de archivos y etiquetas SELinux dentro del contenedor. Un Secret local
proporciona la contraseña. Los probes de inicio y actividad ejecutan
`pg_isready` con los valores `POSTGRES_USER` y `POSTGRES_DB` inyectados mediante
`envFrom`. Los probes verifican que PostgreSQL esté listo; una conexión
autenticada del cliente es una validación separada.

El SQL de inicialización solo se ejecuta cuando PostgreSQL crea un directorio
de datos nuevo. Crea la base separada `nodexa_test` dentro del mismo servidor
PostgreSQL; la base utiliza las credenciales del Secret local.
Después de cambiar la definición del Pod, recréalo con
`bun run podman-kube:down && bun run podman-kube:up`; un volumen persistente
existente no volverá a ejecutar los scripts de inicialización.

## Nota sobre la limpieza en Podman 5.8.9

Con Podman 5.8.9, `podman kube down --force` puede mostrar
`Error: no such volume` y terminar con código `125` después de indicar que el
volumen fue eliminado. Este comportamiento se observó como una anomalía del
proceso de limpieza, no como un recurso de Nodexa que permaneciera activo.

Después de ese mensaje, verifica la limpieza explícitamente:

```bash
podman pod ps
podman ps -a --pod
podman secret ls
podman volume ls
```

El Pod, los contenedores, el Secret y el volumen no deben mostrar recursos de
Nodexa. Este comportamiento solo se ha confirmado con Podman 5.8.9 y puede
variar en otras versiones.
