#!/usr/bin/env bash
set -Eeuo pipefail
cd /opt/is373
service=${1:?Supply qa or production}
image=${2:?Supply immutable GHCR image}
case "$service" in
  qa) key=QA_IMAGE ;;
  production) key=PROD_IMAGE ;;
  *) echo "Invalid service" >&2; exit 1 ;;
esac
[[ $image =~ ^ghcr\.io/[a-z0-9._/-]+:(qa|prod)-[a-f0-9]{40}$ ]] || { echo "Invalid image tag" >&2; exit 1; }
exec 9>.deploy.lock
flock 9
[[ -f .env.server ]] || { echo "Create .env.server first" >&2; exit 1; }
temp=$(mktemp .env.server.XXXXXX)
trap 'rm -f "$temp"' EXIT
awk -v key="$key" -v image="$image" 'index($0,key "=")!=1 {print} END {print key "=" image}' .env.server > "$temp"
mapfile -t settings < server-settings.txt
domain=${settings[0]:?Missing domain}
email=${settings[1]:?Missing ACME email}
[[ $domain =~ ^[a-zA-Z0-9.-]+$ && $email =~ ^[a-zA-Z0-9._+%-]+@[a-zA-Z0-9.-]+$ ]] || exit 1
# Routing changes require a manual update of Traefik/both services.
grep -Fxq "DOMAIN=$domain" .env.server || { echo "DOMAIN differs from server configuration" >&2; exit 1; }
grep -Fxq "ACME_EMAIL=$email" .env.server || { echo "ACME_EMAIL differs from server configuration" >&2; exit 1; }
compose=(docker compose --env-file "$temp" -f docker-compose.deploy.yml)
"${compose[@]}" config --quiet
"${compose[@]}" pull "$service"
"${compose[@]}" up -d --no-deps --wait --wait-timeout 120 "$service"
chmod 600 "$temp"
mv "$temp" .env.server
docker compose --env-file .env.server -f docker-compose.deploy.yml ps "$service"

