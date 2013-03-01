class Songcommentlike < ActiveRecord::Base
	attr_accessible :songcomment_id, :user_id

	belongs_to :songcomment
	belongs_to :user
end