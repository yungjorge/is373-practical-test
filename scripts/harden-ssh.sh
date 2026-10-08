#!/usr/bin/env bash
set -Eeuo pipefail
[[ $EUID -eq 0 ]] || { echo "Run with sudo/root." >&2; exit 1; }
echo "WARNING: Test key login AND sudo for your NEW non-root account in a second terminal first."
[[ ${1:-} == --account-tested ]] || { echo "After testing, rerun with --account-tested." >&2; exit 1; }
install -d -m 755 /etc/ssh/sshd_config.d
target=/etc/ssh/sshd_config.d/00-is373-hardening.conf
backup=$(mktemp)
existed=false
if [[ -f $target ]]; then cp "$target" "$backup"; existed=true; fi
restore() {
  if $existed; then cp "$backup" "$target"; else rm -f "$target"; fi
  rm -f "$backup"
}
cat > "$target" <<'EOF'
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
EOF
chmod 644 "$target"
if ! /usr/sbin/sshd -t; then restore; exit 1; fi
effective=$(/usr/sbin/sshd -T)
for setting in 'permitrootlogin no' 'passwordauthentication no' 'pubkeyauthentication yes' 'kbdinteractiveauthentication no'; do
  if ! grep -qx "$setting" <<< "$effective"; then
    echo "Conflicting SSH configuration: expected $setting. Restoring previous file." >&2
    restore
    exit 1
  fi
done
if ! systemctl restart ssh; then restore; exit 1; fi
rm -f "$backup"
echo "SSH hardened. Keep this session open and retest the non-root account."

