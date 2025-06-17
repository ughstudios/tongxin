#!/bin/bash
set -e

# Run the Rails system test suite
RAILS_ENV=test

scripts/setup.sh

bin/rails db:migrate RAILS_ENV=$RAILS_ENV
bin/rails db:setup RAILS_ENV=$RAILS_ENV

bin/rails test:system
