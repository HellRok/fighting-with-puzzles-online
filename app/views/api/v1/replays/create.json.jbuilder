json.success @replay.errors.none?

if @replay.errors.any?
  json.errors @replay.errors
else
  json.data do
    json.partial! 'api/v1/replays/replay', replay: @replay
  end
end
