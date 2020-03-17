class Api::V1::ReplaysController < ApplicationController
  load_and_authorize_resource :user
  load_and_authorize_resource

  def index
    @replays = @user.replays if @user
    @replays = @replays.includes(:user)
  end

  def leader_board
    @sprints = (@user.presence || User).best_sprints
    @ultras = (@user.presence || User).best_ultras
    @survivals = (@user.presence || User).best_survivals
  end

  def show; end

  def create
    @replay.user = @current_user if @current_user
    @replay.save
  end

  private

  def replay_params
    params.require(:replay).permit(:data, :score, :time, :mode, :version)
  end
end
