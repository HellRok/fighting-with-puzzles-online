class AddResultToReplays < ActiveRecord::Migration[6.0]
  def change
    add_column :replays, :result, :integer, default: 0
    add_index :replays, :result
  end
end
