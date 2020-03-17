class Api::V1::SessionsController < ApplicationController
  before_action :authenticate!, except: :create
  def show; end

  def create
    user = User.find_by(username: params[:session][:username])

    if user&.authenticate(params[:session][:password])
      @user = user
    end
  end

  def update
    @user = current_user
    @user.update(user_params)
  end

  private

  def user_params
    params.require(:user).permit(settings: {})
  end
end
