class CreateLibrarySongs < ActiveRecord::Migration
  def change
    create_table :library_songs do |t|
    	t.string :song_artist
      t.string :song_name
      t.string :song_link
      t.integer :user_id
      t.timestamps
    end
  end
end
