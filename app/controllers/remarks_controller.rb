class RemarksController < ApplicationController
	def index
		page = params[:page].to_i

		respond_to do |format|
			format.json { render :json => custom_remark_json(Remark.order('created_at DESC').all[page*11..page*11+10]) }
		end
	end

	def create
		@remark = current_user.remarks.build(params[:remark])
		@remark.save!
		@remarks = Remark.order('created_at DESC').all[0..8]

		respond_to do |format|
			format.json { render :json => @remarks }
		end
	end
end
