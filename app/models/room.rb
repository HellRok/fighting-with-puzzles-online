class Room < ApplicationRecord
  serialize :settings

  def game_server_url
    ENV.fetch('GAME_SERVER_URL', 'ws://localhost:3002')
  end
end
