#!/bin/bash
set -e

# Helper script to setup the local dev environment and SQLite test DB using Sequelize
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_DIR"

# Ensure Node.js 18+ is available
if ! command -v node >/dev/null || ! command -v npm >/dev/null; then
  echo "Node.js 18 or newer is required." >&2
  exit 1
fi
NODE_MAJOR=$(node -v | sed 's/v//' | cut -d'.' -f1)
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "Node.js 18 or newer is required." >&2
  exit 1
fi

DB_FILE="$REPO_DIR/data/test.db"

npm install
# Run Sequelize migrations to initialize the database
npx sequelize-cli db:migrate >/dev/null
npx sequelize-cli db:seed:all >/dev/null

npm run dev
