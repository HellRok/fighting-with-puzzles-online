json.success @user.errors.none?

if @user.errors.any?
  json.errors @user.errors
else
  json.data do
    json.partial! 'api/v1/sessions/session', user: @user
  end
end
