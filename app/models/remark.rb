class Remark < ActiveRecord::Base
  attr_accessible :body, :user_id

  belongs_to :user
  has_many :mentions

  validates :body, :presence => true

  def self.mentioned_song(id)
  	id = '&' + id.to_s
  	Remark.all.select do |x|
  		flag = false

  		x.body.split(' ').each do |word|
  			if word.include?('&')
  				flag = true if word == id
  			end
  		end

  		flag
  	end
  end

  def self.clean_remarks
  	Remark.all.select do |remark|
  		if remark.body.include?('&')
  			words = remark.body.split(' ').select { |word| word.include?('&') }
  			words.select! { |word| word[1..-1].to_i < Song.last.id + 1 && word[1..-1].to_i > 0 }
  			words.empty?
  		else
  			true
  		end
  	end
  end
end
