json.success true

json.data do
  json.partial! 'api/v1/users/user', user: @user
end
