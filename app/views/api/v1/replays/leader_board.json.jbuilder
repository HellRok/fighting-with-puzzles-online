json.success true
json.data do
  json.sprints @sprints do |replay|
    json.partial! 'api/v1/replays/replay', replay: replay
    json.data replay.data
  end
  json.ultras @ultras do |replay|
    json.partial! 'api/v1/replays/replay', replay: replay
    json.data replay.data
  end
end
