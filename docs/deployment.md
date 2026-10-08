# Self Hosting with Digital Ocean and Traefik

[Back to README](../README.md)

## Prepare and transfer from your local computer

Create an Ubuntu 24.04 Droplet and record its public IPv4 address. Configure SSH key access. In a DigitalOcean Cloud Firewall attached to the Droplet, allow inbound TCP 80 from visitors and TCP 22 from your computer; retain outbound access for apt, npm, and container image downloads. Port 80 must be free on the server. Do not open port 3000. This assignment intentionally uses plain HTTP.

Use **Ubuntu/WSL Bash** on your Windows computer. Replace `SERVER_PUBLIC_IP` with the actual IP below. This transfers the current working files, including uncommitted portfolio changes, without requiring a Git push:

```sh
cd /home/sanch/projects/is373_fall2026
export SERVER_PUBLIC_IP=SERVER_PUBLIC_IP
tar --exclude='./node_modules' --exclude='./.next' --exclude='./.git' \
  --exclude='./.env*' --exclude='*.log' --exclude='*.tsbuildinfo' \
  --exclude='./test-results' --exclude='./playwright-report' \
  --exclude='*.pem' --exclude='*.key' \
  -czf /tmp/is373-portfolio.tar.gz .
scp /tmp/is373-portfolio.tar.gz root@"$SERVER_PUBLIC_IP":/root/
ssh root@"$SERVER_PUBLIC_IP"
```

These commands assume the Droplet's initial `root` SSH account. Substitute your configured sudo user and home directory if root login is disabled. No environment variables or secrets are required by the current app. Review the files you intend to publish before transfer.

## Run on the DigitalOcean server

```sh
mkdir -p /opt/is373_fall2026
tar -xzf /root/is373-portfolio.tar.gz -C /opt/is373_fall2026
cd /opt/is373_fall2026
sudo bash setup-server.sh
sudo bash deploy.sh
sudo docker compose -f docker-compose.prod.yml ps
curl --fail http://127.0.0.1/api/health
```

The setup script follows [Docker's official Ubuntu repository installation](https://docs.docker.com/engine/install/ubuntu/). It verifies Ubuntu 24.04, installs Docker Engine, Buildx, and the Compose plugin, enables/starts Docker, and runs `hello-world`. It uses a fixed apt source file so repeat runs do not append entries. If conflicting Ubuntu Docker/containerd packages exist, it stops with their names instead of removing an existing installation automatically. An existing manually configured Docker apt source should be reconciled with `/etc/apt/sources.list.d/docker.sources` before running. No Docker group membership is needed: the commands use sudo.

`deploy.sh` resolves its own project directory, checks the Compose file and Docker daemon, validates Compose, then runs exactly:

```sh
docker compose -f docker-compose.prod.yml up -d --build
```

It shows status and verification commands. Startup is detached: wait for `web` to become healthy before checking HTTP. To update, transfer the revised source and rerun `sudo bash deploy.sh`. This simple single-container replacement can briefly interrupt requests.

## Inspect and stop

Run from `/opt/is373_fall2026`:

```sh
# Resolved labels, ports, and networks
sudo docker compose -f docker-compose.prod.yml config
# Traefik startup/discovery errors and HTTP access log
sudo docker compose -f docker-compose.prod.yml logs --tail=100 traefik
# Next.js startup and request errors
sudo docker compose -f docker-compose.prod.yml logs --tail=100 web
# Next.js without going through Traefik
sudo docker compose -f docker-compose.prod.yml exec -T web node -e "fetch('http://127.0.0.1:3000/api/health').then(async r=>{console.log(await r.text());process.exit(r.ok?0:1)}).catch(()=>process.exit(1))"
# Full proxy path; expect HTTP 200 and {"status":"ok"}
curl --fail --include http://127.0.0.1/api/health
# Stop this production stack only
sudo docker compose -f docker-compose.prod.yml down
```

From your computer, open `http://SERVER_PUBLIC_IP` and visit `/work`, `/about`, and `/learn`. Check that CSS and images load. Also run `curl --fail http://SERVER_PUBLIC_IP/api/health`. If server-local HTTP works but remote HTTP times out, inspect the public IP and firewall rules. A 404 from Traefik points to router discovery; a 502 points to its connection to Next.js. Inspect both services' logs and health status. Docker-published ports have special firewall behavior; use the Cloud Firewall for external ingress control rather than relying only on UFW ([Docker firewall guidance](https://docs.docker.com/engine/install/ubuntu/#firewall-limitations)).

## Configuration and student handoff

- Objective: Run the existing portfolio over HTTP by public IP for the assignment.
- Architecture: Traefik publishes `80:80`, discovers explicitly labeled containers through the read-only Docker socket mount, and routes ``PathPrefix(`/`)`` on entrypoint `web` to service `is373` on port 3000. Both containers have only the shared Compose-managed `proxy` bridge network, so no network-selection label is necessary. No host port is published by Next.js.
- Image: Node 24 Debian slim matches `.nvmrc` and `package.json`. Cached `npm ci` uses `package-lock.json`; `npm run build` creates the standalone output already enabled in `next.config.ts`. The final stage runs `node server.js` as the `node` user, includes static/public assets, and checks `/api/health`.
- Isolation: The project name `is373-fall2026-traefik` separates this stack from development and the older localhost-production stack. Their Dockerfiles, Compose files, package scripts, and app source remain unchanged. The shared `.dockerignore` excludes local caches, environment files, and unnecessary development artifacts while retaining build inputs.
- Manual next steps: Provision the Droplet, configure SSH/firewall access, transfer files, run setup/deployment, and record public-IP browser and health-check evidence for the assignment. No server deployment has been performed by the agent.

## Local verification results

- `docker compose -f docker-compose.prod.yml config --quiet` passed using the Windows Docker Compose CLI. Both original Compose files also passed. The resolved production configuration confirms only port 80 is published, the Docker socket is read-only, both services share one network, and the router explicitly targets port 3000 with no Host or TLS rule.
- `bash -n setup-server.sh deploy.sh` passed. Both scripts use LF line endings and are executable. The server installer was inspected but not executed on this local computer.
- In an isolated temporary copy with Node 24.21.0 and the unchanged lockfile, `npm ci`, `npm run check` (ESLint and TypeScript), `npm run format:check`, and `npm run build` passed. Next.js 16.3.4 generated all 14 static pages. The installed Next.js standalone-output and self-hosting guides were read.
- The generated standalone server, with public/static assets copied as in the Dockerfile, passed local HTTP checks for 12 routes (including the health endpoint) and 21 static/public assets. That temporary server was stopped afterward.
- Local Markdown links resolve. `git diff --check` passed. The original Dockerfile, both original Compose files, package files, and Next.js configuration match HEAD; pre-existing portfolio edits were preserved.
- Docker Desktop's Linux engine was unavailable, so the Docker image build, running Traefik/network checks, and container health checks could not be executed. No browser suite or public-server check was performed. The standalone smoke check does not replace those deployment checks. No Droplet was accessed or deployed to.
