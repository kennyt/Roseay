class SongListensController < ApplicationController
	def create
		@song_listen = SongListen.new(params[:song_listen])

		respond_to do |format|
			if @song_listen.save
				format.json { render :json => {'success' => 'yes' }.to_json }
			else
				format.json { render :json => {'error' => 'yes' }.to_json }
			end
		end
	end
end
