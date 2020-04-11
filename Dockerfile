FROM crystallang/crystal:latest-alpine AS server_build
WORKDIR /app
COPY game_server/shard.yml game_server/shard.lock /app/
RUN shards install
COPY game_server/src/ /app/src/
RUN crystal build --release --no-debug --static src/game_server.cr

FROM node:latest AS node_build
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install
COPY app/javascripts app/javascripts/
COPY app/stylesheets app/stylesheets/
RUN yarn run production:build

FROM ruby:alpine
WORKDIR /app
COPY Gemfile Gemfile.lock /app/
RUN gem install bundler && \
  apk update && \
  apk add make libxml2 libxslt-dev g++ gcc libc-dev postgresql-dev && \
  rm -f /var/cache/apk/*
RUN bundle config set without 'development test' && \
  bundle install
COPY . /app
COPY --from=node_build /app/public/assets /app/public/assets
RUN make digest-assets
COPY --from=server_build /app/game_server /app/bin/
ENV HOST 0.0.0.0
ENV RAILS_ENV production
ENV MALLOC_ARENA_MAX 2
ENV RAILS_SERVE_STATIC_FILES true
ENV SECRET_KEY_BASE NOT-A-REAL-KEY

RUN adduser -D -s /bin/sh puma
RUN mkdir -p tmp/pids log && \
  chown -R puma tmp/ log/
USER puma

CMD ["bin/start_server"]
