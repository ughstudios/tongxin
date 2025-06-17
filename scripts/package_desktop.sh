#!/bin/bash
set -e

# Package the Electron desktop app
cd "$(dirname "$0")/../desktop"

# Install Node dependencies
npm install

# Build the Electron package
npx electron-packager . tongxin-desktop --overwrite --asar

