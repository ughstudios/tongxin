#!/bin/bash
set -e
# Install Ruby dependencies and set up the database
echo "Installing gems"
# Skip production gems like `pg`. Bundler remembers this via
# the local config rather than the deprecated `--without` flag.
bundle config set --local without 'production'
bundle install

echo "Setting up the database"
bin/rails db:setup
