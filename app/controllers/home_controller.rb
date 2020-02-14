class HomeController < ActionController::Base
  include HttpsOnly
  before_action :send_to_https

  def index
    render
  end
end
