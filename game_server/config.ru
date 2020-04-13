require 'json'
require 'securerandom'

require 'rack'
require 'iodine'
require 'connection_pool'
require 'redis'

require './lib/room'


class WebsocketChat
  def initialize(request)
    @request = request
    @path = @request.path
    @uuid = SecureRandom.uuid
    @room = Room.new(@path)
  end

  def on_open client
    log "#{@uuid}: connected #{@path} - players #{@room.players.size}"

    client.subscribe @path

    client.write(
      {
        action: 'connected',
        data: {
          uuid: @uuid,
          state: @room.current_state
        }
      }.to_json
    )
  end

  def on_message client, data
    parsed = JSON.parse(data)
    log parsed
    case parsed['data']['action']
    when 'join'
      log 'JOIN'
      @room.add_player @uuid, parsed['data']['id'], parsed['data']['username']
      client.publish @path, { action: 'join', data: parsed['data'] }.to_json;
    end
  end

  def on_close client
    @room.remove_player(@uuid)
    client.publish @path, { action: 'leave', data: {} }.to_json;
  end

  private
  def log(message)
    puts "#{Time.now}: #{message}"
  end
end

APP = Proc.new do |env|
  request = Rack::Request.new(env)
  env['rack.upgrade'.freeze] = WebsocketChat.new(request)
  [0,{}, []] # It's possible to set cookies for the response.
end

# Pus/Sub can be server oriented as well as connection bound
Iodine.subscribe(:chat) {|ch, msg| puts msg if Iodine.master? }

# By default, Pub/Sub performs in process cluster mode.
Iodine.workers = 1

# # or in config.ru
run APP
