class CreateSongCommentsTable < ActiveRecord::Migration
  def change
  	create_table :songcomments do |t|
  		t.text :body
  		t.integer :song_id
  		t.integer :user_id
  		t.integer :points, :default => 1

  		t.timestamps
  	end
  end
end
