class Like < ActiveRecord::Base
  attr_accessible :user_id, :song_id

  belongs_to :song
  belongs_to :user
end