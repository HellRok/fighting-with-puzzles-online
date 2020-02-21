class Api::V1::ReplaysController < ApplicationController
  load_and_authorize_resource :user
  load_and_authorize_resource

  def index
    @replays = @user.replays if @user
    @replays = @replays.includes(:user)
  end

  def leader_board
    @sprints = @replays.where(mode: Replay.modes[:sprint]).order(time: :asc).limit(25)
    @ultras = @replays.where(mode: Replay.modes[:ultra]).order(score: :desc).limit(25)
  end

  def show; end

  def create
    @replay.user = @current_user if @current_user
    @replay.save
  end

  private

  def replay_params
    params.require(:replay).permit(:data, :score, :time, :mode)
  end
end
