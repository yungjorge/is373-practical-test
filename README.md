Production: https://104-248-208-29.nip.io
QA: https://qa.104-248-208-29.nip.io

# IS373 — Your professional home on the web

## HTTPS QA and production deployment

Use [the practical deployment guide](docs/cicd-deployment.md) for exact Ubuntu
24.04 account, Docker, SSH, DNS, GitHub secrets, and promotion commands.
The existing portfolio and local Docker workflows are preserved.

**Promotion rule:** `qa` branch → QA; merge `qa` into `main` → production.

**CI/CD flow:** push → tests/validation → Docker build → GHCR push →
SSH deployment → Traefik → QA or production.

Failed lint, type, formatting, browser tests, or builds stop deployment.
[deploy.yml](.github/workflows/deploy.yml) publishes commit-specific image tags
and updates only the selected service. [docker-compose.deploy.yml](docker-compose.deploy.yml)
routes both domains with HTTPS and separate application networks.
Copy [.env.server.example](.env.server.example) to the server as `.env.server`.
Make the GHCR package public after its first push; repository visibility alone
does not make the image public.

## Test Evidence

Replace these placeholders only after observing real results:

Repository setup evidence: [public repository](docs/evidence/public-repository.png)
and [configured secret names](docs/evidence/github-secrets-configured.png).
The initial [main CI run](https://github.com/yungjorge/is373-practical-test/actions/runs/37819578877)
passed, including Docker production smoke checks; [screenshot](docs/evidence/main-ci-success.png).
The first [deployment workflow](https://github.com/yungjorge/is373-practical-test/actions/runs/37819578811)
passed validation, Docker build, and GHCR push, then stopped because deployment
credentials were not yet configured. This is not a successful deployment.

- Successful QA GitHub Actions run URL: **TODO**
- Successful production GitHub Actions run URL: **TODO**
- GitHub Container Registry package URL: **TODO**
- QA deployed commit/tag (`qa-COMMIT_SHA`): **TODO**
- Production deployed commit/tag (`prod-COMMIT_SHA`): **TODO**
- QA screenshot showing HTTPS URL: **TODO**
- Production screenshot showing HTTPS URL: **TODO**
- SSH-key login screenshot showing non-root username: **TODO**
- sshd effective configuration screenshot: **TODO**
- Root-login rejection screenshot: **TODO**
- QA/production container isolation evidence: **TODO**

```sh
ssh USER@SERVER
whoami
sudo sshd -T | grep -E 'permitrootlogin|passwordauthentication|pubkeyauthentication'
```

Expected values:

```text
permitrootlogin no
passwordauthentication no
pubkeyauthentication yes
```

From your computer, attempt root login with the same administrator key that
previously worked for root:

```sh
ssh -o BatchMode=yes -o PreferredAuthentications=publickey -i ~/.ssh/YOUR_ADMIN_KEY root@SERVER
```

Capture `Permission denied (publickey)` and exit status 255, then show successful
non-root login. A connection timeout does not prove rejection. Follow the
[guide](docs/cicd-deployment.md#evidence) for the remaining verification commands.
These entries are placeholders, not claims of successful deployment.

Your first project in Content Management Systems is to begin building a personal web presence. Use AI to help develop it, Docker to run it consistently, and a discovery process to decide what it should communicate. You should be able to explain both your choices and the work behind them.

**This phase is discovery and the existing portfolio starter.** Content lives in local project files. A CMS, blog, QR-code integration, and additional publishing capabilities come later; they are not prerequisites for getting started.

## Start here

1. Read [The project and its purpose](docs/project-overview.md).
2. Set up Docker: [Mac](docs/setup-mac.md) or [Windows with WSL 2](docs/setup-windows.md).
3. Follow [Run the app](docs/run-the-app.md). Docker supplies Node.js; a separate Node installation is optional.
4. Work through [Discover your direction](docs/discovery.md), recording your own answers.
5. Use [Make this portfolio yours](docs/portfolio-starter.md) for your first small edits.

## Three parts of one project

| Part | Start with | What you should be able to explain |
| --- | --- | --- |
| AI-assisted development | [Working with AI](docs/working-with-ai.md) | What you asked for, what changed, how you checked it, and what you learned. |
| Docker and containerization | [Docker explained through this project](docs/docker-basics.md) | How your code, image, container, ports, and storage work together. |
| Your portfolio and message | [Discovery, design, and persuasion](docs/discovery.md) | Who you want to reach, what you offer, what evidence supports it, and the next action. |

## What is already here?

The application includes a homepage, About page, sample case-study pages, four themes (Brutalist, Base, Swiss, Punk), and a theme studio. Its field guide covers Cialdini, illustrated design history, and brand archetypes. The archetype planner can download a working brief. Sample projects are teaching examples, not finished student work.

After starting the app, explore `/work`, `/about`, `/studio`, and `/learn`. Supplementary course guidance lives in the Markdown documents linked here, so you can read it before the app is running.

## Reference and next steps

- [Student discovery brief template](docs/discovery-brief-template.md) — copy and complete in your own words.
- [Project map and agent handoff](docs/project-map.md) — where to edit and how another agent can understand your work.
- [Development reference](docs/development.md) — checks, local Node workflow, and production Docker commands.
- [Long-term vision](docs/project-vision.md) — how the website, blog, GitHub, LinkedIn, QR code, and a later CMS can fit together.
- [Agent instructions](AGENTS.md) — repository conventions and current scope.

## Legacy public-IP HTTP exercise

For the practical's QA/production HTTPS requirements, use the new guide above.
This older stack uses port 80 and must be stopped before starting the HTTPS stack.

Production path: Internet → Droplet port 80 → Traefik → Next.js port 3000 on a shared Docker network. Only Traefik publishes a host port. The router uses ``PathPrefix(`/`)``, so open `http://SERVER_PUBLIC_IP`; no domain, `Host()` rule, or HTTPS is configured.

The separate [Dockerfile.prod](Dockerfile.prod) uses Node 24, `npm ci`, and the existing Next.js 16.3.4 standalone output. It copies the standalone server, static assets, and public files into a non-root runtime image. `next.config.ts` needs no change. [docker-compose.prod.yml](docker-compose.prod.yml) pins [Traefik v3.7.13](https://github.com/traefik/traefik/releases/tag/v3.7.13), verified as the stable release when this setup was added.

Create an Ubuntu 24.04 Droplet, allow inbound TCP 80 for visitors and TCP 22 from your computer in its DigitalOcean firewall, and copy this project to it. See [the deployment guide](docs/deployment.md) for exact local transfer commands and the assignment handoff.

On the server, from the project directory:

```sh
sudo bash setup-server.sh   # Install official Docker Engine and Compose; safe to rerun
sudo bash deploy.sh         # Validate, build, start, and show status
sudo docker compose -f docker-compose.prod.yml ps
sudo docker compose -f docker-compose.prod.yml logs --tail=100 -f traefik web
```

Verify the HTTP route through Traefik, then check Next.js directly inside its container:

```sh
curl --fail http://127.0.0.1/api/health
sudo docker compose -f docker-compose.prod.yml exec -T web node -e "fetch('http://127.0.0.1:3000/api/health').then(async r=>{console.log(await r.text());process.exit(r.ok?0:1)}).catch(()=>process.exit(1))"
```

Both should return `{"status":"ok"}`. Visit `http://SERVER_PUBLIC_IP` from your computer. Traefik access logs show the routed requests; its dashboard is not exposed. To stop production:

```sh
sudo docker compose -f docker-compose.prod.yml down
```

The original `docker compose up --build` development workflow and `compose.production.yaml` localhost workflow remain available. Always use `-f docker-compose.prod.yml` for this new public stack; `npm run docker:prod` still selects the original localhost configuration.

Begin with a running starter, a discovery brief, and one small change you understand. Expand the project as the course introduces new capabilities.
