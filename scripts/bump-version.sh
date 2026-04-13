#!/usr/bin/env bash
# Bump the version number in version.txt, build, and deploy to the server.
# Configure the variables below before running.

set -euo pipefail

### Configuration — edit these values ###
REMOTE_USER="su633000"
REMOTE_HOST="access-5019622091.webspace-host.com"
REMOTE_PORT=22
REMOTE_PATH="/PRJ1"

### End config ###

VERSION_FILE="version.txt"

if [ ! -f "$VERSION_FILE" ]; then
  echo "0" > "$VERSION_FILE"
fi

CURRENT=$(cat "$VERSION_FILE" | tr -d '[:space:]')
if ! [[ "$CURRENT" =~ ^[0-9]+$ ]]; then
  echo "version.txt does not contain a numeric value. Aborting." >&2
  exit 1
fi
NEXT=$((CURRENT + 1))
echo "$NEXT" > "$VERSION_FILE"
echo "Bumped version: $CURRENT -> $NEXT"

echo "Building production bundle..."
npm run build

echo "Deploying to ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH} (port ${REMOTE_PORT})"
rsync -avz -e "ssh -p ${REMOTE_PORT}" --delete dist/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/

echo "Uploading version and server files..."
rsync -avz -e "ssh -p ${REMOTE_PORT}" version.txt form-handler.php .htaccess ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/

echo "Deployment complete. New version: $NEXT"

exit 0
