class SongListensController < ApplicationController
	def create
		@song_listen = SongListen.new(params[:song_listen])

		respond_to do |format|
			if @song_listen.save
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
