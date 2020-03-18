json.success true

json.data @rooms do |room|
  json.partial! 'api/v1/rooms/room', room: room
end

