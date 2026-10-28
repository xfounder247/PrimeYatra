#!/usr/bin/env bash
# Run on the VPS from the project folder (/var/www/primeyatra):  ./deploy.sh
# Pulls the latest code from GitHub, rebuilds the site into dist/ and tests the Nginx config.
set -euo pipefail
cd "$(dirname "$0")"
git pull --ff-only
npm install --omit=dev
npm run build
nginx -t
systemctl reload nginx
echo "Done. https://primeyatra.co.in is updated."
