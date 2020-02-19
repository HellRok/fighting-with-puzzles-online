class ApplicationController < ActionController::API
  include ActionController::Helpers
  include ActionController::HttpAuthentication::Token::ControllerMethods
  include CanCan::ControllerAdditions

  include HttpsOnly

  before_action :send_to_https
  before_action :authenticate

  private

  def authenticate!
    request_http_token_authentication unless @current_user
  end

  def authenticate
    authenticate_with_http_token do |token, options|
      @current_user = User.find_by(token: token)
    end
  end

  def current_user
    @current_user
  end
end
