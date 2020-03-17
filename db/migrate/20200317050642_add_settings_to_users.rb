class AddSettingsToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :settings, :json, default: { keys: {}, game: {} }
  end
end
