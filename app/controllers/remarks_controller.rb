class RemarksController < ApplicationController
	def index
		page = params[:page].to_i

		respond_to do |format|
			format.json { render :json => custom_remark_json(Remark.order('created_at DESC').all[page*11..page*11+10]) }
		end
	end

	def create
		@remark = current_user.remarks.build(params[:remark])
		@remark.body = @remark.body[0..124]
		@remark.save!
		@remarks = Remark.order('created_at DESC').all[0..8]

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
