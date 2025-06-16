#!/bin/bash
set -e
# Install Ruby dependencies and set up the database
echo "Installing gems"
bundle install

echo "Setting up the database"
bin/rails db:setup
