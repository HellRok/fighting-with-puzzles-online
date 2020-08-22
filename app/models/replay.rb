class Replay < ApplicationRecord
  belongs_to :user, optional: true
  enum mode: %w(sprint ultra survival online battle)
  enum result: %w(win lose draw)

  def self.find_battle(gpm:)
    replays = []
    variance = 5

    until replays.size >= 10
      replays = self.where(
        mode: [Replay.modes[:battle], Replay.modes[:ultra]],
        gpm: (gpm - variance)..(gpm + variance)
      ).limit(50)

      variance += 5
    end

    replays.sample
  end

  def parsed_data
    LZString::UTF16.decompress(data)
  end
end
