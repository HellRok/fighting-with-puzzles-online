#!/bin/bash
set -exuo pipefail

docker-compose build --pull
docker-compose up -d
docker-compose exec app rails db:create db:schema:load

bundle install
bundle exec rspec test_suite.rb --format doc

docker-compose down
