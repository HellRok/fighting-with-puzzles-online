class Server
  def initialize(request)
    @request = request
    @path = @request.path
    @uuid = SecureRandom.uuid
    @room = Room.new(@path)
  end

  def on_open client
    log "#{@uuid}: connected #{@path} - players #{@room.players.size}"

    client.subscribe @path
    client.subscribe :system

    response = { uuid: @uuid }.merge(@room.current_state)

    client.write(
      {
        action: 'connected',
        data: response,
      }.to_json
    )
  end

  # The basic structure I expect in data is:
  #   {
  #     'uuid' => 'blah-blah-blah',
  #     'action' => 'some-string',
  #     'data' => {
  #       // Relevant data
  #     }
  def on_message client, data
    @parsed = JSON.parse(data)
    @client = client

    log @parsed unless %w(move ping).include? @parsed['action']

    case @parsed['action']
    when 'ping'
      @player.ping

    when 'join'
      @player = Player.create(
        room: @room,
        uuid: @uuid,
        id: @parsed['data']['id'],
        username: @parsed['data']['username'],
        drop_pattern: @parsed['data']['dropPattern']
      )
      client.publish @path, { action: 'join', data: @parsed['data'].merge(uuid: @uuid) }.to_json;

    when 'leave'
      @player.destroy
      client.publish @path, { action: 'leave', data: { uuid: @uuid } }.to_json;

    when 'ready'
      @player.ready
      client.publish @path, { action: 'ready', data: { uuid: @uuid } }.to_json;
      if @room.all_players_ready? && @room.players.size > 1
        @room.players.map { |player|
          player.state = 'playing'
          player.save
        }
        @room.state = 'playing'
        client.publish @path, { action: 'start', data: { seed: Time.now.to_i } }.to_json;
      end

    when 'unready'
      @player.unready
      client.publish @path, { action: 'unready', data: { uuid: @uuid } }.to_json;

    when 'move'
      response = @parsed['data'].merge(uuid: @parsed['uuid'])
      client.publish @path, { action: 'move', data: response }.to_json;

    when 'attack'
      target = @room.players_remaining.select { |player| player.uuid != @uuid }.sample
      log "#{@player.username || 'Anon'}(#{@player.uuid}) attacks #{target.username || 'Anon'}(#{target.uuid}) for #{@parsed['data']['damage']}"
      log({
        action: 'attack',
        data: {
          uuid: target.uuid,
          damage: @parsed['data']['damage'],
          attackerUuid: @uuid
        }
      }.to_json)
      client.publish @path, {
        action: 'attack',
        data: {
          uuid: target.uuid,
          damage: @parsed['data']['damage'],
          attackerUuid: @uuid
        }
      }.to_json

    when 'lose'
      @player.state = 'lost'
      @player.save
      lose @parsed['data']['timestamp']

    else
      log "DUNNO HOW TO HANDLE #{@parsed['action']}"
    end
  end

  def on_close client
    log "Closed: #{@uuid}"
    @player.destroy
    lose
    client.publish @path, { action: 'leave', data: { uuid: @uuid } }.to_json;
  end

  def on_shutdown client
    client.write({ action: 'server_shutdown', data: { } }.to_json);
  end

  private
  def lose(timestamp=nil)
    remaining_players = @room.players_remaining

    if @room.state == 'playing'
      @client.publish @path, { action: 'lost', data: { uuid: @uuid } }.to_json

      if remaining_players.size == 1
        @client.publish @path, { action: 'won', data: {
          winner: remaining_players.first.uuid, timestamp: @parsed['data']['timestamp']
        } }.to_json;
      end
    end

    @room.state = 'waiting' if remaining_players.size <= 1
  end

  def log(message)
    puts "#{Time.now}: #{message}"
  end
end
