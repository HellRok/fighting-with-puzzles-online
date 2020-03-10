class User < ApplicationRecord
  has_secure_password
  has_secure_token

  validates_uniqueness_of :username

  has_many :replays

  has_one :best_sprint, -> { where(mode: Replay.modes[:sprint]).order(time: :asc) }, class_name: 'Replay'
  has_one :best_ultra, -> { where(mode: Replay.modes[:ultra]).order(score: :desc) }, class_name: 'Replay'
  has_one :best_survival, -> { where(mode: Replay.modes[:survival]).order(time: :desc) }, class_name: 'Replay'


  # TODO: Come back and fix this properly, it currently will load a _lot_ of stuff
  def self.best_sprints
    User.includes(best_sprint: :user).
      where.not(replays: { id: nil}).
      order('replays.time ASC').
      map(&:best_sprint).compact
  end

  def self.best_ultras
    User.includes(best_ultra: :user).
      where.not(replays: { id: nil}).
      order('replays.score DESC').
      map(&:best_ultra).compact
  end

  def self.best_survivals
    User.includes(best_survival: :user).
      where.not(replays: { id: nil}).
      order('replays.time DESC').
      map(&:best_survival).compact
  end
end
