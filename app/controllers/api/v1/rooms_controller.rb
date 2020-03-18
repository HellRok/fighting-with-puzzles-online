class Api::V1::RoomsController < ApplicationController
  load_and_authorize_resource

  def index; end

  def create
    @room.save
  end

  def update
    @room.save
  end

  private

  def room_params
    params.require(:room).permit(:name, :settings)
  end
end
