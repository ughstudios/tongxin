#!/bin/bash
set -e

# Install Ruby dependencies and set up the database
echo "Installing gems"
bundle config set --local without 'production'
bundle install --quiet

echo "Setting up the database"
bin/rails db:drop db:create db:schema:load db:seed DISABLE_DATABASE_ENVIRONMENT_CHECK=1

# Basic sanity check: start and stop the server
echo "Starting Rails server to verify setup"
bin/rails server -d -e test
sleep 5
if [ -f tmp/pids/server.pid ]; then
  kill "$(cat tmp/pids/server.pid)"
fi
echo "Setup complete"
