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
    parsed = JSON.parse(data)
    log parsed
    case parsed['action']
    when 'join'
      @player = Player.create @room, @uuid, parsed['data']['id'], parsed['data']['username']
      client.publish @path, { action: 'join', data: parsed['data'].merge(uuid: @uuid) }.to_json;

    when 'leave'
      @player.destroy
      client.publish @path, { action: 'join', data: { uuid: @uuid } }.to_json;

    when 'ready'
      @player.ready
      client.publish @path, { action: 'ready', data: { uuid: @uuid } }.to_json;

    when 'unready'
      @player.unready
      client.publish @path, { action: 'unready', data: { uuid: @uuid } }.to_json;

    else
      log "DUNNO HOW TO HANDLE #{parsed['action']}"
    end
  end

  def on_close client
    log "Closed: #{@uuid}"
    @player.destroy
    client.publish @path, { action: 'leave', data: { uuid: @uuid } }.to_json;
  end

  private
  def log(message)
    puts "#{Time.now}: #{message}"
  end
end
