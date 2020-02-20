class Api::V1::UsersController < ApplicationController
  load_and_authorize_resource

  def index; end
  def show; end

  def create
    @user.save
  end

  private

  def user_params
    params.require(:user).permit(:username, :password, :password_confirmation)
  end
end
