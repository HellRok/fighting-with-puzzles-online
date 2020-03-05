json.token user.token
json.partial! 'api/v1/users/user', user: user

json.bests({}) # Make sure this is always returned
json.bests do
  json.sprint do
    if user.best_sprint
      json.partial! 'api/v1/replays/replay', replay: user.best_sprint
    end
  end
  json.ultra do
    if user.best_ultra
      json.partial! 'api/v1/replays/replay', replay: user.best_ultra
    end
  end
  json.survival do
    if user.best_survival
      json.partial! 'api/v1/replays/replay', replay: user.best_survival
    end
  end
end
