class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.integer :points, :default => 1
      t.integer :user_id
      t.string :song_artist
      t.string :song_name
      t.string :song_link

      t.timestamps
    end
  end
end
