class Replay < ApplicationRecord
  belongs_to :user, optional: true
  enum mode: %w(sprint ultra survival online)
end
