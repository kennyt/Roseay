class Aircommentlike < ActiveRecord::Base
	attr_accessible :user_id, :aircomment_id

	belongs_to :aircomment
	belongs_to :user
end