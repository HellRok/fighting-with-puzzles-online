require 'rack'
require 'iodine'
class WebsocketChat
  def initialize(request)
    @request = request
    @path = @request.path
  end

  def on_open client
    p client
    #binding.irb
    # Pub/Sub directly to the client (or use a block to process the messages)
    client.subscribe :chat
    # Writing directly to the socket
    client.write "You're now in the chatroom."
  end

  def on_message client, data
    # Strings and symbol channel names are equivalent.
    client.publish "chat", data
  end
  #extend self
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
