json.success true

json.data do
  json.partial! 'api/v1/rooms/room', room: @room
end
