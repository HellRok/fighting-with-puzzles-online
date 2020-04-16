# Things to store in redis
#   - Room state (waiting for players, playing)
#   - Player state (connecting, not ready, ready, playing, lost)
#   - Player wins (int)
#
# TODO: This stuff is so far from acid compliant it's not funny, fix it I guess?

class Room < RedisModel
  attr_reader :id

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
end
