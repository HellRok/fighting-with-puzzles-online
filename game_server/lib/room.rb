class Room < RedisModel
  def self.all
    Room.redis.with do |conn|
      room_keys = conn.keys "/room/*/state"

      room_keys.map { |key| Room.new(key.chomp("/state")) }
    end
  end

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

  def all_players_ready?
    players.all? { |player| player.state == 'ready' }
  end

  def players_remaining
    players.select { |player| player.state == 'playing' }
  end
end
