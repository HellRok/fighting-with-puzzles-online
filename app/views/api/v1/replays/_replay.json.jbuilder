json.id replay.id
json.time replay.time
json.score replay.score
json.mode replay.mode
json.version replay.version
json.createdAt replay.created_at
json.link "/#{replay.mode}/replay/#{replay.id}"

if replay.user
  json.user do
    json.partial! '/api/v1/users/user', user: replay.user
  end
end
