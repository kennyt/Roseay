class Song < ActiveRecord::Base
  attr_accessible :song_artist, :song_name , :song_link, :user_id

  belongs_to :author, class_name: 'User', :foreign_key => :user_id
  has_many :likes
  has_many :likers, through: :likes, source: :user
  has_many :hubsongs
  has_many :mentions, :as => :mentionable
  has_many :remarks, :through => :mentions
  has_many :song_listens

  validates_presence_of :song_link
  validates_presence_of :song_artist
  validates_presence_of :song_name
  validates_presence_of :user_id

  def true_value
    if points > 13
      (points.to_f * 0.7) / ((Time.now - created_at) + 12000)
    elsif user_id == 8 && points < 4
      (points * 2) / ((Time.now - created_at) + 12000)
    else
      (points) / ((Time.now - created_at) + 12000)
    end
  end

  def related_songs
    related_songs = Hash.new(0)
    User.all.each do |user| 
      if user.top_listened.include?(self)
        user.top_listened.each do |song|
          related_songs[song] += 1 unless song.nil?
        end
      end
    end
    related_songs.delete(self)
    related_songs.sort_by {|key, value| value}.map{|key, value| key.song_artist + ' - ' + key.song_name}
  end

  def trailing_two_day_listens
    song_listens.select{|listen| Time.now - listen.created_at < 172800 }
  end

  def self.all_recent_listens
    all_songs = Hash.new(0)
    listens = SongListen.where(:created_at => ((Time.now - 172800).to_date)..(Time.now).to_date)
    listens.each{|listen| all_songs[listen.song_id.to_s] += 1}
    all_songs
  end

  def old_useless_songs
    Song.all.select{|x| x.points == 1 && Time.now - x.created_at >  259200}
  end
end