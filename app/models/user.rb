class User < ActiveRecord::Base
  has_secure_password

  attr_accessible :username, :password, :password_confirmation,
                  :session_token

  has_many :submissions, class_name: 'Song'
  has_many :likes
  has_many :liked_songs, through: :likes, source: :song
  has_many :they_liked, through: :submissions, source: :likes
  has_many :hubsongs
  has_many :songhubs, through: :hubsongs, source: :song
  has_many :remarks
  has_many :song_listens
  has_many :they_listened, through: :submissions, source: :song_listens

  validates_length_of :username, minimum: 4, message: "too short"
  # validates_length_of :password, minimum: 4, message: "too short"

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

  def top_listened
    listen_hash = Hash.new(0)
    song_listens.each do |listen|
      listen_hash[listen.song] += 1
    end
    listen_hash.sort_by{|k,v| v}[0..4].map{|key, value| key}
  end

  def songs_made_twelve_hours
    submissions.select{|song| Time.now - song.created_at < 43200 }
  end

  def self.all_total
    combined_users = Hash.new(0)
    Song.all.each{|song| combined_users[song.user_id.to_s] += song.points}
    combined_users
  end
end
