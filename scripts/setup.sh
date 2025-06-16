#!/bin/bash
set -e
# Install Ruby dependencies and set up the database
echo "Installing gems"
# Skip production gems like `pg` so PostgreSQL is not required
BUNDLE_WITHOUT=production bundle install

echo "Setting up the database"
bin/rails db:setup
