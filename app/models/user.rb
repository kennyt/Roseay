class User < ActiveRecord::Base
  has_secure_password

  attr_accessible :username, :password, :password_confirmation,
                  :session_token

  has_many :submissions, class_name: 'Song'
  has_many :likes
  has_many :liked_songs, through: :likes, source: :song
  has_many :hubsongs
  has_many :songhubs, through: :hubsongs, source: :song
  has_many :aircomments
  has_many :aircommentlikes
  has_many :liked_aircomments, through: :aircommentlikes, source: :aircomment
  has_many :songcomments
  has_many :songcommentlikes
  has_many :liked_songcomments, through: :songcommentlikes, source: :songcomment

  validates_length_of :username, minimum: 4, message: "too short"
  validates_length_of :password, minimum: 4, message: "too short"

  validates_uniqueness_of :username, case_sensitive: false,
                           message: "already taken"

  validates_presence_of :password_confirmation, if: :made_password?,
                         message: "can't be blank"

  def made_password?
    password
  end

  def vote_up(song)
    self.liked_songs << song
    song.points += 1
  end

  def avg
    return 0 if submissions.length == 0
    (submissions.inject(0.0){|x, y| x + y.points} / submissions.length).round(1)
  end

  def total
    submissions.inject(0) {|x, y| x + y.points }
  end
end
