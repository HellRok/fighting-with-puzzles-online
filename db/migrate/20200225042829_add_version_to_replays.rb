class AddVersionToReplays < ActiveRecord::Migration[6.0]
  def up
    add_column :replays, :version, :string
    execute "UPDATE replays SET version = '0.1';"
  end

  def down
    remove_column :replays, :version
  end
end
