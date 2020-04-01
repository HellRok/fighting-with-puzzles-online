#!/bin/bash
set -exuo pipefail

docker-compose up -d
docker-compose exec app rails db:create db:schema:load

bundle exec test_suite.rb

docker-compose down
