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
COPY game_server/Gemfile game_server/Gemfile.lock /app/game_server/
RUN gem install bundler && \
  apk update && \
  apk add make libxml2 libxslt-dev g++ gcc libc-dev postgresql-dev redis && \
  rm -f /var/cache/apk/*
RUN bundle config set without 'development test' && \
  bundle install && \
  cd game_server && \
  bundle install && \
  cd ..
COPY . /app
COPY --from=node_build /app/public/assets /app/public/assets
RUN make digest-assets
ENV HOST 0.0.0.0
ENV RAILS_ENV production
ENV MALLOC_ARENA_MAX 2
ENV RAILS_SERVE_STATIC_FILES true
ENV SECRET_KEY_BASE NOT-A-REAL-KEY
ENV GAME_SERVER_URL ws://localhost:3002

RUN adduser -D -s /bin/sh puma
RUN mkdir -p tmp/pids log && \
  chown -R puma tmp/ log/
USER puma

CMD ["bin/start_server"]
