class CreateCommentLikeTable < ActiveRecord::Migration
  def change
  	create_table :aircommentlikes do |t|
  		t.integer :user_id
  		t.integer :aircomment_id

  		t.timestamps
  	end
  end
end
