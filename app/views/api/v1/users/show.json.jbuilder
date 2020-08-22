json.success true

json.data do
  json.partial! 'api/v1/users/user', user: @user
  json.stats do
    json.games do
      json.count @user.replays.count
      json.time @user.replays.sum(:time)
    end

    json.sprints do
      json.count @user.replays.where(mode: Replay.modes[:sprint]).count
      json.time @user.replays.where(mode: Replay.modes[:sprint]).sum(:time)
    end

    json.ultras do
      json.count @user.replays.where(mode: Replay.modes[:ultra]).count
      json.time @user.replays.where(mode: Replay.modes[:ultra]).sum(:time)
    end

    json.survivals do
      json.count @user.replays.where(mode: Replay.modes[:survival]).count
      json.time @user.replays.where(mode: Replay.modes[:survival]).sum(:time)
    end

    json.online do
      json.count @user.replays.where(mode: Replay.modes[:online]).count
      json.time @user.replays.where(mode: Replay.modes[:online]).sum(:time)
    end

    json.battle do
      json.count @user.replays.where(mode: Replay.modes[:battle]).count
      json.time @user.replays.where(mode: Replay.modes[:battle]).sum(:time)
      json.wins @user.replays.where(mode: Replay.modes[:battle], result: Replay.results[:win]).count
    end
  end
end
