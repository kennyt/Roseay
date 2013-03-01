class Songcomment < ActiveRecord::Base
	attr_accessible :body, :user_id, :song_id

	belongs_to :user
	belongs_to :song
end