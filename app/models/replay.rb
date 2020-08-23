class Replay < ApplicationRecord
  belongs_to :user, optional: true
  enum mode: %w(sprint ultra survival online battle)
  enum result: %w(win lose draw)

  def self.find_battle(gpm:, user:)
    replays = []
    variance = 5

    until replays.size >= 10 || (gpm - variance < -50)
      replays = self.where(
        mode: [Replay.modes[:battle], Replay.modes[:ultra]],
        gpm: (gpm - variance)..(gpm + variance)
      ).limit(50)

      replays = replays.where.not(user: user) if user.present?

      variance += 5
    end

    replays.sample
  end

  def parsed_data
    LZString::UTF16.decompress(data)
  end
end
