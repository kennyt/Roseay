class CreateRemarks < ActiveRecord::Migration
  def change
    create_table :remarks do |t|
    	t.integer :user_id
    	t.text :body

      t.timestamps
    end
  end
end
