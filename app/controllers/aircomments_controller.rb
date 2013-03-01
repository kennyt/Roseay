class AircommentsController < ApplicationController
	def index
		@aircomments = Aircomment.all

		respond_to do |format|
			format.json { render :json => @aircomments }
		end
	end
	def create
		@aircomment = current_user.aircomments.new(params[:aircomment])
		@aircomment.save!
		@aircomments = Aircomment.order('created at DESC').all[0..8]

		respond_to do |format|
			format.json { render :json => custom_comment_json(@aircomments) }
		end
	end
end