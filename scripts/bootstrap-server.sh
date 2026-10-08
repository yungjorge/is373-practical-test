#!/usr/bin/env bash
set -Eeuo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "Run this script with sudo: sudo bash scripts/bootstrap-server.sh" >&2
  exit 1
fi

source /etc/os-release
if [[ ${ID:-} != ubuntu || ${VERSION_ID:-} != 24.04 ]]; then
  echo "This setup script requires Ubuntu 24.04." >&2
  exit 1
fi

# Avoid silently removing an existing container installation and its workloads.
conflicts=()
for package in docker.io docker-compose docker-compose-v2 docker-doc podman-docker containerd runc; do
  if dpkg-query -W -f='${Status}' "$package" 2>/dev/null | grep -qx 'install ok installed'; then
    conflicts+=("$package")
  fi
done
if ((${#conflicts[@]})); then
  printf 'Conflicting packages installed: %s\n' "${conflicts[*]}" >&2
  echo "Review/remove those packages using Docker's Ubuntu installation guide, then rerun." >&2
  exit 1
fi

apt-get update
apt-get install -y ca-certificates curl git
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Reuse the same source file on every run; do not append duplicate entries.
cat > /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: noble
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker
docker version
docker compose version
deploy_user=${1:?Supply the tested non-root deployment username}
[[ $deploy_user =~ ^[a-z_][a-z0-9_-]*$ && $deploy_user != root ]] || { echo "Choose a non-root username" >&2; exit 1; }
id "$deploy_user" >/dev/null
usermod -aG docker "$deploy_user"
install -d -m 750 -o "$deploy_user" -g "$deploy_user" /opt/is373
# Compose creates persistent certificate storage when Traefik starts.
# Docker group membership grants root-equivalent control.
docker run --rm hello-world
echo "Docker ready. Reconnect the deployment account for Docker access. SSH is unchanged."
