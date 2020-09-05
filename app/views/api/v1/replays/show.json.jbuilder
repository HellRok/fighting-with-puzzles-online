json.success true
json.data do
  json.partial! 'api/v1/replays/replay', replay: @replay
  json.data @replay.data
  json.link "/#{@replay.mode}/replay/#{@replay.id}"
end
