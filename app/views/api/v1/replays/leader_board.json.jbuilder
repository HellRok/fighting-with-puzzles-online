json.success true
json.data do
  json.battlers @battlers do |user|
    json.username user.username
    json.id user.id
    json.wins user.battle_wins
    json.total user.battles.size
  end
  json.sprints @sprints do |replay|
    json.partial! 'api/v1/replays/replay', replay: replay
  end
  json.ultras @ultras do |replay|
    json.partial! 'api/v1/replays/replay', replay: replay
  end
  json.survivals @survivals do |replay|
    json.partial! 'api/v1/replays/replay', replay: replay
  end
end
