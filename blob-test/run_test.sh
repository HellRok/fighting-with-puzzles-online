#!/bin/bash
set -exuo pipefail

docker-compose build
docker-compose up -d
docker-compose exec app rails db:create db:schema:load

bundle install
bundle exec rspec test_suite.rb

docker-compose down
