class ApplicationController < ActionController::API
  include HttpsOnly
  before_action :send_to_https
end
