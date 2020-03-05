json.success true
json.data do
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
