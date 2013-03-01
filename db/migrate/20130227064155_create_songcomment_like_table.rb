class CreateSongcommentLikeTable < ActiveRecord::Migration
  def change
  	create_table :songcommentlikes do |t|
  		t.integer :songcomment_id
  		t.integer :user_id

  		t.timestamps
  	end
  end
end
