class Song < ActiveRecord::Base
  attr_accessible :song_artist, :song_name , :song_link, :user_id

  belongs_to :author, class_name: 'User', :foreign_key => :user_id
  has_many :likes
  has_many :likers, through: :likes, source: :user
  has_many :hubsongs
  has_many :songcomments
  has_many :songcommenters, through: :songcomments, source: :user

  validates_presence_of :song_link
  validates_presence_of :song_artist
  validates_presence_of :song_name
  validates_presence_of :user_id

  def true_value
    (points) / ((Time.now - created_at) + 50000)
  end
end