class User < ApplicationRecord
  has_secure_password
  has_secure_token

  validates_uniqueness_of :username

  has_many :replays

  def best_sprint
    replays.where(mode: Replay.modes[:sprint]).order(time: :asc).first
  end

  def best_ultra
    replays.where(mode: Replay.modes[:ultra]).order(score: :desc).first
  end
end
