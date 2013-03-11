class RemarksController < ApplicationController
	def index
		page = params[:page].to_i
		if params[:filter].blank?
			remarks = Remark.order('created_at DESC').clean_remarks[page*11..page*11+10]
		else
		  remarks = Remark.order('created_at DESC').mentioned_song(params[:filter])[page*11..page*11+10]
		end

		respond_to do |format|
			format.json { render :json => custom_remark_json(remarks) }
		end
	end

	def create
		@remark = current_user.remarks.build(params[:remark])
		@remark.body = @remark.body[0..165]
		@remark.save!
		@remarks = Remark.order('created_at DESC').all[0..10]

		respond_to do |format|
			format.json { render :json => @remarks }
		end
	end

	def destroy
		@remark = Remark.find(params[:id])
		@remark.destroy
		page = params[:page].to_i

		respond_to do |format|
			format.html
			format.json { render :json => current_user }
		end
	end
end
