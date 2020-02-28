require "kemal"

def log_with_time(message)
  puts "#{Time.utc}: #{message}"
end

class Room
  @@players = [] of Int32
  def self.players; @@players; end
end

ws "/game/:id" do |socket, context|
  socket.send "hello"
  Room.players << Room.players.size

  socket.on_message do |message|
    sleep 3
    log_with_time message
    socket.send(Room.players.map{|player| player.to_s}.join(":"))
  end

  socket.on_close do
    log_with_time "CLOSING"
    Room.players.pop
  end
end

Kemal.run
