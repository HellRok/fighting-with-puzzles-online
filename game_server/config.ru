require 'json'
require 'securerandom'

require 'rack'
require 'iodine'
require 'connection_pool'
require 'redis'

require './lib/server'
require './lib/room'

APP = Proc.new do |env|
  request = Rack::Request.new(env)
  env['rack.upgrade'.freeze] = Server.new(request)
  [0,{}, []] # It's possible to set cookies for the response.
end

# Pus/Sub can be server oriented as well as connection bound
Iodine.subscribe(:chat) {|ch, msg| puts msg if Iodine.master? }

# By default, Pub/Sub performs in process cluster mode.
Iodine.workers = 1

# # or in config.ru
run APP
