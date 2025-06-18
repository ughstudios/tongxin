#!/bin/bash
set -e

# Run setup and verify the homepage in test mode
RAILS_ENV=test

scripts/setup.sh

bin/rails db:drop db:create db:schema:load db:seed RAILS_ENV=$RAILS_ENV DISABLE_DATABASE_ENVIRONMENT_CHECK=1

bin/rails s -e $RAILS_ENV -d
sleep 5
curl -I http://localhost:3000
pkill -f puma
