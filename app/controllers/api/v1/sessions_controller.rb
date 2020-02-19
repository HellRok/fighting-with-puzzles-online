class Api::V1::SessionsController < ApplicationController
  before_action :authenticate!, only: :index
  def index; end

  def create
    user = User.find_by(username: params[:session][:username])

    if user.authenticate(params[:session][:password])
      @user = user
    end
  end
end
