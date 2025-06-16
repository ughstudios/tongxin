#!/bin/bash
set -e

# Run setup and verify the homepage in test mode
RAILS_ENV=test

scripts/setup.sh

bin/rails db:migrate RAILS_ENV=$RAILS_ENV
bin/rails db:setup RAILS_ENV=$RAILS_ENV
bin/rails db:seed RAILS_ENV=$RAILS_ENV

bin/rails s -e $RAILS_ENV -d
sleep 5
curl -I http://localhost:3000
pkill -f puma
