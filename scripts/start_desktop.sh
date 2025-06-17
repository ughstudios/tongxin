#!/bin/bash
set -e

# Launch the packaged Electron desktop app
APP_ROOT="$(dirname "$0")/../desktop"
APP_NAME="tongxin-desktop"

ARCH="$(uname -m)"
PLATFORM="$(uname | tr '[:upper:]' '[:lower:]')"
DIR="${APP_ROOT}/${APP_NAME}-${PLATFORM}-${ARCH}"

if [ "$PLATFORM" = "darwin" ]; then
  EXEC="${DIR}/${APP_NAME}.app/Contents/MacOS/${APP_NAME}"
else
  EXEC="${DIR}/${APP_NAME}"
fi

if [ ! -f "$EXEC" ]; then
  echo "Compiled app not found: $EXEC"
  echo "Run scripts/package_desktop.sh first"
  exit 1
fi

"$EXEC"
