class Api::V1::StatsController < ApplicationController
  skip_before_action :authenticate

  def index
    replays_by_mode = Replay.all.group_by(&:mode)

    render json: {
      user_count: User.all.count,
      replays: {
        online_count: replays_by_mode['online'].count,
        sprint_count: replays_by_mode['sprint'].count,
        ultra_count: replays_by_mode['ultra'].count,
        survival_count: replays_by_mode['survival'].count,
      }
    }
  end
end
