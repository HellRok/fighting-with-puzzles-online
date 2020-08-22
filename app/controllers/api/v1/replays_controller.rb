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

  def battle
    # Basically: gpm > 0 mode = (ultra || battle) should do the trick
    @replay = Replay.find_battle(gpm: params[:gpm])
  end

  def create
    # Sadly browsers (specifically safari) don't send UTF16 back from the
    # browser properly so I've configured it to send the Base64.
    # SOURCE: https://github.com/pieroxy/lz-string/issues/92
    #
    # Converting from Base64 to UTF16 seems pretty dumb, but the data speaks for itself:
    #   irb(main):011:0> r.parsed_data.size
    #   => 5242
    #   irb(main):012:0> LZString::Base64.compress(r.parsed_data).size
    #   => 1784
    #   irb(main):013:0> r.data.size
    #   => 714
    @replay.user = @current_user if @current_user
    @replay.data = LZString::UTF16.compress(LZString::Base64.decompress(@replay.data))
    @replay.save
  end

  private

  def replay_params
    params.require(:replay).permit(:data, :score, :time, :gpm, :mode, :version, :result)
  end
end
