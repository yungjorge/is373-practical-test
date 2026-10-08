# HTTPS deployment: QA and production

[Back to README](../README.md)

This stack replaces the public-IP HTTP approach for this practical. The older
`docker-compose.prod.yml` remains available as a legacy exercise; stop it before
starting this stack because both need port 80. The portfolio is unchanged.

## Promotion and validation

`qa` branch → QA; merge `qa` into `main` → production.
Push → lint/types/format/browser tests/Next.js build → Docker build → GHCR push
→ SSH → selected container → Traefik HTTPS.

The workflow uses Node 24, Chromium, and serial browser tests. Any failed check
or build prevents SSH deployment. Each push publishes `qa-SHA`/`qa` or
`prod-SHA`/`prod`. The server uses the commit-specific tag.
Only the selected service is pulled and restarted with `--no-deps`.
Separate application networks and containers isolate QA and production.
Traefik alone publishes 80/443. Certificates persist in a named volume; do not
use `down -v`. Deployment waits for the image health check; a failed restart
fails the workflow, but does not automatically roll back the container.

## Local preparation and GitHub

Use YOUR public repository (fork this starter if necessary). Current origin is
the course repository; replace it only with your own repository URL.
Review existing uncommitted portfolio work before staging it.
Make the repository public in Settings → General → Danger Zone.

Create a dedicated Actions key on your computer (Ubuntu/WSL):
```sh
ssh-keygen -t ed25519 -f ~/.ssh/is373-actions -C is373-actions -N ''
cat ~/.ssh/is373-actions.pub
```
Keep the private key out of Git. Use your personal public key for administrator
login, and install the Actions public key for the deployment account as well.

Repository Settings → Secrets and variables → Actions → New repository secret:

| Secret | Value |
| --- | --- |
| SERVER_HOST | Droplet public IPv4 |
| SERVER_USER | New non-root account, e.g. jorge |
| SERVER_SSH_KEY | Complete dedicated Actions private key |
| SERVER_SSH_KNOWN_HOSTS | Verified SSH known_hosts entry for the Droplet |
| DOMAIN | Apex domain only, e.g. example.com |
| ACME_EMAIL | Your certificate contact email |

`GITHUB_TOKEN` is automatic. The workflow has contents:read and packages:write.
The first GHCR package defaults to private even for a public repository:
after the first image push, open your GitHub profile/organization → Packages
→ package → Package settings → Change visibility → Public. Then rerun the
failed deployment job. Public images can be pulled anonymously; no server PAT
is needed. Ensure the package is linked to your repository and Actions has access.

## Clean Ubuntu 24.04 server

Create an **Ubuntu 24.04 x86-64** DigitalOcean Droplet with your administrator SSH
key. In its DigitalOcean firewall allow TCP 80/443 from all IPv4/IPv6 visitors.
Allow TCP 22 from your administrator IP and the Actions runner; for this simple
practical, TCP 22 from all sources supports hosted runners with changing IPs.
Keep port 3000 closed. Configure DNS as described below.

On your computer:
```sh
ssh root@104.248.208.29
```
In that root session (keep it open until the non-root account is tested):
```sh
adduser jorge
usermod -aG sudo jorge
install -d -m 700 -o jorge -g jorge /home/jorge/.ssh
cat > /home/jorge/.ssh/authorized_keys <<'EOF'
YOUR_ADMINISTRATOR_SSH_PUBLIC_KEY
YOUR_ACTIONS_SSH_PUBLIC_KEY
EOF
chown jorge:jorge /home/jorge/.ssh/authorized_keys
chmod 600 /home/jorge/.ssh/authorized_keys
apt-get update
apt-get install -y git
```
From a second local terminal:
```sh
ssh jorge@104.248.208.29
whoami
sudo -v
git clone https://github.com/yungjorge/is373-practical-test.git ~/is373-source
cd ~/is373-source
sudo bash scripts/bootstrap-server.sh jorge
sudo bash scripts/harden-ssh.sh --account-tested
```
The bootstrap installs Docker from its official Ubuntu repository and Compose,
creates /opt/is373 with deployment-account ownership, and leaves SSH unchanged.
Docker group membership grants root-equivalent access; use a dedicated account.
Hardening checks syntax and effective settings before restarting SSH. If a
cloud-image setting conflicts, it restores the previous file and exits; review
the conflicting sshd configuration before rerunning. Also inspect any Match
blocks with `sudo sshd -T -C user=jorge,host=104.248.208.29,addr=YOUR_CLIENT_IP`.

Reconnect to activate Docker group membership and test hardened SSH:
```sh
exit
ssh jorge@104.248.208.29
docker version
docker compose version
cp ~/is373-source/docker-compose.deploy.yml /opt/is373/
cp ~/is373-source/.env.server.example /opt/is373/.env.server
chmod 600 /opt/is373/.env.server
nano /opt/is373/.env.server
```
Replace domain, email, and both lowercase GHCR owner/repository paths. Leave
the initial `:prod`/`:qa` tags until their first deployment; Compose can start
Traefik without pulling these app images.

```sh
cd /opt/is373
docker compose --env-file .env.server -f docker-compose.deploy.yml config --quiet
docker compose --env-file .env.server -f docker-compose.deploy.yml up -d traefik
```
No application runs until Actions publishes and deploys it. Traefik requires
reachable port 80 for Let's Encrypt HTTP challenges.
Capture the SSH host key fingerprint via the trusted DigitalOcean console:
```sh
sudo ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
```
On your computer, collect and compare its fingerprint before using the entry:
```sh
ssh-keyscan -t ed25519 104.248.208.29 > /tmp/is373-known-hosts
ssh-keygen -lf /tmp/is373-known-hosts
cat /tmp/is373-known-hosts
```
Save the verified final line as SERVER_SSH_KNOWN_HOSTS. Do not trust an
unverified ssh-keyscan result.

If the old public HTTP stack is running, stop it from its original directory:
`sudo docker compose -f docker-compose.prod.yml down`, then start Traefik.

## QA push

From this existing repository on your computer, after reviewing the diff:
```sh
git remote -v
# If origin is still the instructor's repo, use your OWN public fork:
git remote set-url origin https://github.com/yungjorge/is373-practical-test.git
git add Dockerfile .gitignore .env.server.example docker-compose.deploy.yml .github/workflows/deploy.yml scripts/bootstrap-server.sh scripts/harden-ssh.sh scripts/deploy-service.sh README.md docs/cicd-deployment.md docs/development.md docs/project-map.md
git commit -m "Add HTTPS QA and production deployment"
git switch -c qa
git push -u origin qa
```
Only main exists locally at this handoff. If qa already exists when you follow
these commands, use `git switch qa` instead. Review and commit any intended
portfolio edits separately; the commands above do not stage them.
For a later QA trigger:
```sh
git switch qa
git commit --allow-empty -m "Trigger QA deployment"
git push origin qa
```
Wait for Actions. On first publication, make the GHCR package public and rerun
the deployment if its anonymous pull failed.
Open https://qa.104-248-208-29.nip.io and verify /api/health.

## Promote to production

After QA passes:
```sh
git switch main
git pull --ff-only origin main
git merge --no-ff qa -m "Promote tested QA to production"
git push origin main
```
Main builds a new prod tag for its merge commit and deploys only production.
Wait for Actions, then open https://104-248-208-29.nip.io and /api/health.

## DNS and verification

At your authoritative DNS provider, create A records:
`@` → Droplet IPv4, `qa` → the same IPv4. Remove conflicting A/AAAA records.
Only publish AAAA if the Droplet's IPv6 is configured and reachable on 80/443.
Use DNS-only mode initially if your provider offers proxying. Wait for propagation.

On the server:
```sh
cd /opt/is373
docker compose --env-file .env.server -f docker-compose.deploy.yml ps
docker compose --env-file .env.server -f docker-compose.deploy.yml logs --tail=100 traefik production qa
grep -E '^(PROD_IMAGE|QA_IMAGE)=' .env.server
curl --fail https://104-248-208-29.nip.io/api/health
curl --fail https://qa.104-248-208-29.nip.io/api/health
curl -I http://104-248-208-29.nip.io
curl -I http://qa.104-248-208-29.nip.io
```
Health returns `{"status":"ok"}`; HTTP redirects to HTTPS.
Before/after a QA push, record production's container ID with
`docker compose --env-file .env.server -f docker-compose.deploy.yml ps -q production`.
It should remain unchanged. Repeat for QA during a main push.
Do not alter DOMAIN/ACME_EMAIL through a normal app deployment: update
.env.server and Actions secrets together and manually recreate affected routes
and Traefik during a planned configuration update.

## Evidence

Use the README's Test Evidence checklist. Do not claim success until observed.
```sh
ssh USER@SERVER
whoami
sudo sshd -T | grep -E 'permitrootlogin|passwordauthentication|pubkeyauthentication'
```
Expected: `permitrootlogin no`, `passwordauthentication no`,
`pubkeyauthentication yes`.

From your computer, use a key previously authorized for root to prove its
rejection after hardening:
```sh
ssh -o BatchMode=yes -o PreferredAuthentications=publickey -i ~/.ssh/YOUR_ADMIN_KEY root@104.248.208.29
```
Expect exit status 255 and Permission denied (publickey), while the same key
works for jorge. A timeout does not prove root login is disabled.
Record password rejection too:
```sh
ssh -o PubkeyAuthentication=no -o PreferredAuthentications=password -o BatchMode=yes jorge@104.248.208.29
```

## References

- [Official Docker Ubuntu installation](https://docs.docker.com/engine/install/ubuntu/)
- [Traefik HTTP challenge](https://doc.traefik.io/traefik/v3.3/user-guides/docker-compose/acme-http/)
- [GitHub Container Registry visibility and GITHUB_TOKEN](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

## Local verification handoff — 2026-10-08

Continuation: the public practical repository has been created and main pushed.
The hostname examples now match 104.248.208.29 and account jorge. GitHub CI run
37819578877 passed all its checks, including the production Docker smoke tests.
Local validation of the visible QA label passed lint, types, formatting, build,
and all 11 browser tests after extracting libnspr4, libnss3, and libasound2t64
into a temporary directory and setting LD_LIBRARY_PATH. No WSL system packages
were installed. The earlier browser limitation below is now resolved.
SERVER_HOST, SERVER_USER, DOMAIN, and ACME_EMAIL are configured in repository secrets.
SERVER_SSH_KEY and verified SERVER_SSH_KNOWN_HOSTS remain pending.
HTTPS currently refuses connections on port 443 for both hostnames.

- Direct repository `npm ci` failed with EACCES on its existing node_modules.
  A temporary source copy in /tmp/is373-practical-check used checksum-verified
  Node 24.21.0; `npm ci` succeeded there without changing repository permissions.
- `npm run check` passed ESLint and TypeScript; `npm run format:check` passed.
- `npm run build` passed compilation, TypeScript, and generation of 14 pages.
- The installed Next.js 16.3.4 output/deployment guides were read; standalone
  output, public/static copies, non-root runtime, and port 3000 were reviewed.
- Windows Docker Compose parsed/interpolated the deployment file successfully
  with the example environment. Only Traefik exposes host ports; the Docker
  engine was unavailable, so no image build or runtime Docker test was performed.
- Both YAML files parsed with js-yaml. Workflow review confirmed all checks
  precede image publication/SSH, both branch mappings, GITHUB_TOKEN permissions,
  pinned SSH host checking, and selected-service-only commands.
- All three scripts passed individual `bash -n` checks. No bootstrap or
  hardening script was executed against a server.
- Local Markdown file links and `git diff --check` passed.
- Chromium downloaded, but all 11 browser tests failed to launch because WSL
  lacks libnspr4.so. No browser assertions passed. Actions uses
  `playwright install --with-deps` to supply browser libraries.
- `npm audit` reported 8 high and 1 critical existing dependency findings.
  No dependency or lockfile changes were made; these need a separate review
  before treating the site as hardened production software.

Real HTTPS, SSH, GHCR, and deployment evidence remain manual. Existing portfolio
edits were preserved. No commits, pushes, deployments, or server changes were
performed by the agent.

