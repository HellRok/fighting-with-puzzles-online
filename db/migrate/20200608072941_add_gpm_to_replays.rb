class AddGpmToReplays < ActiveRecord::Migration[6.0]
  def change
    add_column :replays, :gpm, :float
    add_index :replays, :gpm
    add_index :replays, :score
    add_index :replays, :time
    add_index :replays, :mode
  end
end
