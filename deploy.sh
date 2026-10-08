#!/usr/bin/env bash
set -Eeuo pipefail

# Resolve the project from this script even when invoked from another directory.
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
if [[ ! -f docker-compose.prod.yml ]]; then
  echo "Missing docker-compose.prod.yml in $PWD" >&2
  exit 1
fi
command -v docker >/dev/null || { echo "Install Docker with setup-server.sh first." >&2; exit 1; }
docker compose version
docker info >/dev/null
docker compose -f docker-compose.prod.yml config --quiet
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps

cat <<'EOF'
Stack started; the application may need a moment to become healthy.
Run from the project directory (prefix Docker commands with sudo if needed):
  docker compose -f docker-compose.prod.yml ps
  docker compose -f docker-compose.prod.yml logs --tail=100 traefik web
  curl --fail http://127.0.0.1/api/health
  docker compose -f docker-compose.prod.yml exec -T web node -e "fetch('http://127.0.0.1:3000/api/health').then(async r=>{console.log(await r.text());process.exit(r.ok?0:1)}).catch(()=>process.exit(1))"
Open http://SERVER_PUBLIC_IP in your browser (replace SERVER_PUBLIC_IP).
EOF
