class CreateReplays < ActiveRecord::Migration[6.0]
  def change
    create_table :replays do |t|
      t.references :user, null: true, foreign_key: true
      t.text :data
      t.integer :time
      t.integer :score
      t.integer :mode

      t.timestamps
    end
  end
end
