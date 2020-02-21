class User < ApplicationRecord
  has_secure_password
  has_secure_token

  validates_uniqueness_of :username

  has_many :replays

  has_one :best_sprint, -> { where(mode: Replay.modes[:sprint]).order(time: :asc) }, class_name: 'Replay'
  has_one :best_ultra, -> { where(mode: Replay.modes[:ultra]).order(score: :desc) }, class_name: 'Replay'


  def self.best_sprints
    User.includes(best_sprint: :user).
      where.not(replays: { id: nil}).
      order('replays.time ASC').
      limit(25).
      map(&:best_sprint).compact
  end

  def self.best_ultras
    User.includes(best_ultra: :user).
      where.not(replays: { id: nil}).
      order('replays.score DESC').
      limit(25).
      map(&:best_ultra).compact
  end
end
