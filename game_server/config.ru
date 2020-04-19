# frozen_string_literal: true

require 'json'
require 'securerandom'

require 'rack'
require 'iodine'
require 'connection_pool'
require 'redis'

require './lib/server'
require './lib/redis_model'
require './lib/room'
require './lib/player'

APP = Proc.new do |env|
  request = Rack::Request.new(env)

  if env['rack.upgrade?'] == :websocket
    env['rack.upgrade'] = Server.new(request)
    [0,{}, []] # It's possible to set cookies for the response.
  else
    access_headers = {
      "Access-Control-Allow-Methods" => "GET",
      "Access-Control-Allow-Headers" => "*",
      "Access-Control-Allow-Origin" => "*",
    }

    if request.env['REQUEST_METHOD'] == 'OPTIONS'
      [
        204,
        {
          "Content-Length" => 0,
        }.merge(access_headers),
        []
      ]
    else
      room = Room.find(request.path)
      status = 200
      body = {}

      if room
        body = {
          status: 'success',
          data: room.current_state
        }
      else
        status = 404
        body = { status: 'error', data: 'Not found' }
      end

      [
        status,
        {"Content-Type" => "text/json"}.merge(access_headers),
        [body.to_json]
      ]
    end
  end
end

# By default, Pub/Sub performs in process cluster mode.
Iodine.workers = 1

# # or in config.ru
run APP
