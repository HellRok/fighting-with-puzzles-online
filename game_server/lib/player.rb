class Player < RedisModel
  def self.all(room)
    Player.redis.with do |conn|
      player_keys = conn.keys "#{room.id}/players/*"

      return [] if player_keys.empty?

      player_values = (conn.mget *player_keys).map { |value| JSON.parse(value) }

      player_keys.zip(player_values).map { |key, value|
        Player.new(room, key.split('/').last, value['id'], value['username'], value['state'])
      }
    end
  end

  def self.create(room, uuid, id, username)
    player = self.new(room, uuid, id, username, 'not_ready').save
    player.ping
    player
  end

  attr_reader :room, :uuid, :id, :username
  attr_accessor :state

  def initialize(room, uuid, id, username, state)
    @room = room
    @uuid = uuid
    @id = id
    @username = username
    @state = state
  end

  def save
    Player.set_json(
      "#{@room.id}/players/#{@uuid}",
      {
        id: @id,
        username: @username,
        state: @state,
      }
    )

    self
  end

  def destroy
    Player.del "#{@room.id}/players/#{@uuid}"
    Player.del "#{@uuid}/ping"
  end

  def ready
    @state = 'ready'
    save
  end

  def unready
    @state = 'unready'
    save
  end

  def ping
    Player.set_json "#{@uuid}/ping", Time.now.to_f
  end

  def last_ping
    Player.get_json "#{@uuid}/ping"
  end

  def to_h
    {
      uuid:  @uuid,
      id: @id,
      username: @username,
      state: @state
    }
  end
end
