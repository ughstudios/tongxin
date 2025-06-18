#!/bin/bash
set -e

# Install dependencies and run the dev server
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_DIR/nextjs"

if ! command -v npm > /dev/null; then
  echo "npm not found. Please install Node.js 18 or newer." >&2
  exit 1
fi

npm install
npm run dev

