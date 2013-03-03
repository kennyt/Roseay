class Mention < ActiveRecord::Base
  attr_accessible :remark_id, :mentionable_id, :mentionable_type

  belongs_to :remark
  belongs_to :mentionable, :polymorphic => true
end
