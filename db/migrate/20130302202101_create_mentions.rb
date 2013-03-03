class CreateMentions < ActiveRecord::Migration
  def change
    create_table :mentions do |t|
    	t.integer :remark_id
    	t.integer :mentionable_id
    	t.string :mentionable_type

      t.timestamps
    end
  end
end
