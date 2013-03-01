class CreateAirCommentsTable < ActiveRecord::Migration
  def change
  	create_table :aircomments do |t|
  		t.text :body
  		t.integer :user_id
  		t.integer :points, :default => 1

  		t.timestamps
  	end
  end
end
