class SongCommentsController < ApplicationController
	def create
		songcomment = Songcomment.new(params[:songcomment])
		songcomment.save!
		
		respond_to do |format|
			format.json { render :json => songcomment }
		end
	end
end