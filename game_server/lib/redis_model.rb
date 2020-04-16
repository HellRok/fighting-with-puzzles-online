class RedisModel
  def self.redis
    @pool ||= ConnectionPool.new(size: 5) { Redis.new }
  end

  def self.set(key, data)
    self.redis.with do |conn|
      conn.set key, data
    end
  end

  def self.set_json(key, data)
    self.redis.with do |conn|
      conn.set key, data.to_json
    end
  end

  def self.get(key)
    Room.redis.with do |conn|
      conn.get key
    end
  end

  def self.get_json(key)
    Room.redis.with do |conn|
      JSON.parse(conn.get key)
    end
  end

  def self.del(key)
    Room.redis.with do |conn|
      conn.del key
    end
  end
end
