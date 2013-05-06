class SongListensController < ApplicationController
	def create
		@song_listen = SongListen.new(params[:song_listen])

		respond_to do |format|
			if @song_listen.save
				Mention.find(1).update_attribute(:remark_id, (Mention.find(1).remark_id + 1)) if params[:q].length == 1
				Mention.find(1).update_attribute(:mentionable_id, (Mention.find(1).mentionable_id + 1)) if params[:b].length == 1
				Mention.find(2).update_attribute(:remark_id, (Mention.find(2).remark_id + 1)) if params[:s].length == 1
				Mention.find(2).update_attribute(:mentionable_id, (Mention.find(2).mentionable_id + 1)) if params[:sh].length == 1
				Mention.find(5).update_attribute(:remark_id, (Mention.find(5).remark_id + 1)) if params[:l].length == 1

				if current_user && current_user.song_listens.where(:song_id => params[:song_listen][:song_id]).length >= 3
					format.json { render :json => {'like_it' => params[:song_listen][:song_id]}.to_json }
				else
					format.json { render :json => {'success' => 'yes' }.to_json }
				end
			else
				format.json { render :json => {'error' => 'yes' }.to_json }
			end
		end
	end
end
