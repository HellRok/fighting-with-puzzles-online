json.success @user.present?

if @user.blank?
  json.errors do |error|
    error.session 'Could not find a matching login'
  end
else
  json.partial! '/api/v1/sessions/session', user: @user
end
