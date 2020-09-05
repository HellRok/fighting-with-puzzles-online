class User < ApplicationRecord
  has_secure_password
  has_secure_token
  serialize :settings

  attr_accessor :battle_wins

  validates_uniqueness_of :username

  has_many :replays

  has_one :best_sprint, -> { won.where(mode: Replay.modes[:sprint]).order(time: :asc) }, class_name: 'Replay'
  has_many :best_sprints, -> { won.where(mode: Replay.modes[:sprint]).order(time: :asc).limit(10) }, class_name: 'Replay'
  has_one :best_ultra, -> { won.where(mode: Replay.modes[:ultra]).order(score: :desc) }, class_name: 'Replay'
  has_many :best_ultras, -> { won.where(mode: Replay.modes[:ultra]).order(score: :desc).limit(10) }, class_name: 'Replay'
  has_one :best_survival, -> { won.where(mode: Replay.modes[:survival]).order(time: :desc) }, class_name: 'Replay'
  has_many :best_survivals, -> { won.where(mode: Replay.modes[:survival]).order(time: :desc).limit(10) }, class_name: 'Replay'
  has_many :battles, -> { where(mode: Replay.modes[:battle]) }, class_name: 'Replay'


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

  def self.best_battlers
    # This is particularly horrendous, will really need to optimise if I get
    # many users
    User.includes(:battles).
      each { |user| user.battle_wins = user.battles.count(&:win?) }.
      sort_by { |user| -user.battle_wins }.
      reject { |user| user.battle_wins.zero? }
  end

  def average_gpm
    gpms = replays.won.where.not(gpm: nil).last(10).pluck(:gpm).sort

    return 50 unless gpms.any?

    # Good replays are worth twice the weight of bad replays
    best = gpms[(gpms.size / 2)..gpms.size] * 2
    worst = gpms[0...(gpms.size / 2)]

    (best + worst).sum / (best + worst).size
  end
end
