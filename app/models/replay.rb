class Replay < ApplicationRecord
  belongs_to :user, optional: true
  enum mode: %w(sprint ultra survival online)

  def parsed_data
    LZString::UTF16.decompress(data)
  end
end
