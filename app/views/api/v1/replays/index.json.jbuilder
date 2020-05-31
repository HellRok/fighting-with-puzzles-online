json.success true
json.data @replays do |replay|
  json.partial! 'api/v1/replays/replay', replay: replay
  json.data replay.data
end
