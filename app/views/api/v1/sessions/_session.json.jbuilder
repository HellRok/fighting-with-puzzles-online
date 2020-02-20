json.token user.token
json.partial! 'api/v1/users/user', user: user

json.bests({}) # Make sure this is always returned
json.bests do
  json.sprint do
    if user.best_sprint
      json.partial! 'api/v1/replays/replay', replay: user.best_sprint
      json.data user.best_sprint.data
    end
  end
  json.ultra do
    if user.best_ultra
      json.partial! 'api/v1/replays/replay', replay: user.best_ultra
      json.data user.best_ultra.data
    end
  end
end
