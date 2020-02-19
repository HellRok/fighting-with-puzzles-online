json.success true
json.data do
  json.partial! 'api/v1/sessions/session', user: @current_user
end
