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
      # We deliberately create the room setup if it doesn't exist yet, just
      # seems nicer than errors every time I reboot the server.
      room = Room.new(request.path)
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

Iodine.run_every(5_000) do
  if Iodine.master?
    Room.all.each do |room|
      room.players.each do |player|
        if Time.now.to_f - player.last_ping > 5
          puts "#{Time.now}: Disconnect #{player.uuid}"
          Iodine.publish room.id, { action: 'disconnect', data: { uuid: player.uuid } }.to_json;
          player.destroy

          remaining_players = room.players_remaining
          room.state = 'waiting' if remaining_players.size <= 1

          if remaining_players.size == 1 && room.state == 'playing'
            Iodine.publish room.id, { action: 'won', data: {
              winner: remaining_players.first.uuid
            } }.to_json;
          end
        end
      end
    end
  end
end

run APP
