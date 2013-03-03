class Remark < ActiveRecord::Base
  attr_accessible :body, :user_id

  belongs_to :user
  has_many :mentions

  validates :body, :presence => true
end
