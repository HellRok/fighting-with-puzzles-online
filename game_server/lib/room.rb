# Things to store in redis
#   - Room state (waiting for players, playing)
#   - Player state (connecting, not ready, ready, playing, lost)
#   - Player wins (int)
#
# TODO: This stuff is so far from acid compliant it's not funny, fix it I guess?

class Room < RedisModel
  attr_reader :id

  def self.find(id)
    Room.new(id) if Room.get "#{id}/state"
  end

  def initialize(id)
    @id = id
    self.state = 'waiting' unless state
  end

  def current_state
    {
      state: state,
      players: players.map(&:to_h),
    }
  end

  def state
    Room.get "#{@id}/state"
  end

  def state=(value)
    Room.set "#{@id}/state", value
  end

  def players
    Player.all(self)
  end

  def all_players_ready?
    players.all? { |player| player.state == 'ready' }
  end

  def players_remaining
    players.select { |player| player.state == 'playing' }
  end
end
