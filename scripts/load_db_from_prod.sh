#!/bin/bash
set -exuo pipefail

bundle exec rails db:drop db:create db:schema:load
pg_dump --column-inserts --data-only --table users --table replays "`heroku config:get DATABASE_URL`" | grep INSERT | sed 's/public.//g' | sqlite3 fwpo-dev.sqlite
