class RemarksController < ApplicationController
	def index
		page = params[:page].to_i
		if params[:filter].blank?
			remarks = Remark.order('created_at DESC').all[page*16..page*16+15]
		else
		  remarks = Remark.order('created_at DESC').mentioned_song(params[:filter])[page*16..page*16+15]
		end


		respond_to do |format|
			if remarks.nil? 
				format.json { render :json => {} }
			else
				format.json { render :json => custom_remark_json(remarks) }
			end
		end
	end

	def create
		# if current_user
		# 	@remark = current_user.remarks.build(params[:remark])
		# else
		# 	@remark = Remark.new(:user_id => 0, :body => params[:remark][:body])
		# end
		# @remark.body = @remark.body
		# @remark.save!
		# # @remarks = Remark.order('created_at DESC').all[0..15]

		# respond_to do |format|
		# 	# format.json { render :json => @remarks }
		# 	format.json { render :json => {'success' => 'yes'}.to_json }
		# end
		if params[:guest_like]
			Mention.find(3).update_attribute(:remark_id, (Mention.find(3).remark_id + 1))
		elsif params[:convert_guest_like]
			Mention.find(3).update_attribute(:mentionable_id, (Mention.find(3).mentionable_id + 1))
		end

		if current_user
			if params[:skip_song]
				Mention.find(4).update_attribute(:remark_id, (Mention.find(4).remark_id + 1)) unless current_user.id == 1
			elsif params[:completed_song]
				Mention.find(4).update_attribute(:mentionable_id, (Mention.find(4).mentionable_id + 1)) unless current_user.id == 1
			end
		else 
			if params[:skip_song]
				Mention.find(4).update_attribute(:remark_id, (Mention.find(4).remark_id + 1))
			elsif params[:completed_song]
				Mention.find(4).update_attribute(:mentionable_id, (Mention.find(4).mentionable_id + 1))
			end
		end

		if params[:fix_song]
			Mention.create(:remark_id => params[:fix_song].to_i)
		end

		if params[:clicks]
			Mention.find(5).update_attribute(:mentionable_id, (Mention.find(5).mentionable_id + params[:clicks].to_i))
		end

		if params[:new_lib]
			if current_user
				name = params[:name].gsub('zxcvbn','&').gsub('wphshtg','#')
				artist = params[:artist].gsub('zxcvbn','&').gsub('wphshtg','#')
				current_user.library_songs.create(:song_link => params[:link], :song_name => name, :song_artist => artist)
			end
		end

		if params[:delete_lib]
			if current_user
				LibrarySong.find(params[:lib_id].to_i).destroy
			end
		end

		if params[:edit_lib]
			if current_user
				lib_song = LibrarySong.find(params[:lib_id])
				lib_song.update_attribute(:song_name,params[:name])
				lib_song.update_attribute(:song_artist,params[:artist])
				lib_song.update_attribute(:song_link,params[:link])
			end
		end

		respond_to do |format|
			format.json { render :json => {'yes' => '1'}.to_json }
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
