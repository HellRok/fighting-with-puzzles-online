json.success true
json.data do
  json.partial! 'api/v1/replays/replay', replay: @replay
  json.data @replay.data
end
