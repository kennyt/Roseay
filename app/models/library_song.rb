class LibrarySong < ActiveRecord::Base
  attr_accessible :song_artist, :song_name , :song_link, :user_id, :created_at

  belongs_to :author, class_name: 'User', :foreign_key => :user_id
end
