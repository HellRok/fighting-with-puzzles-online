json.success @room.errors.none?

if @room.errors.any?
  json.errors @room.errors
else
  json.data do
    json.partial! 'api/v1/rooms/room', room: @room
  end
end
