class Replay < ApplicationRecord
  belongs_to :user, optional: true
  enum mode: %w(sprint ultra survival online battle)

  def self.find_battle(gpm:)
    # TODO: This should actually do something based on GPM instead of returning
    # the last battle mode replay
    self.where(mode: [Replay.modes[:battle], Replay.modes[:ultra]]).last
  end

  def parsed_data
    LZString::UTF16.decompress(data)
  end
end
