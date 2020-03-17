json.success true

json.data do
  json.partial! 'api/v1/users/user', user: @user
  json.stats do
    json.total_games_finished @user.replays.count
    json.total_sprints_finished @user.replays.where(mode: Replay.modes[:sprint]).count
    json.total_ultras_finished @user.replays.where(mode: Replay.modes[:ultra]).count
    json.total_survivals_finished @user.replays.where(mode: Replay.modes[:survival]).count
  end
end
