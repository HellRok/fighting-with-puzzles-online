class User < ApplicationRecord
  has_secure_password
  has_secure_token

  validates_uniqueness_of :username

  has_many :replays

  has_one :best_sprint, -> { where(mode: Replay.modes[:sprint]).order(time: :asc) }, class_name: 'Replay'
  has_one :best_ultra, -> { where(mode: Replay.modes[:ultra]).order(score: :desc) }, class_name: 'Replay'
end
