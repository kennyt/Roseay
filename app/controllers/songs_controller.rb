class SongsController < ApplicationController
  def index
    @songs = Song.all.sort {|x, y| y.true_value <=> x.true_value }
  end

  def new
  	if current_user
  		@song = Song.new
  	else
  		redirect_to new_session_path
  	end
  end

  def create
  	@song = current_user.submissions.new(params[:song])

  	if @song.save
  		redirect_to songs_path
  	else
  		flash.now[:notice] = song.errors.full_messages.first
  		render 'songs/new'
  	end
  end

  def upvote
	@song = Song.find(params[:id])
  	if @song.author == current_user
  		redirect_to songs_path
  	else
	  	if current_user
		  	current_user.liked_songs << @song
		  	@song.points += 1
		  	@song.save
		  	redirect_to songs_path
		else
			redirect_to new_session_path
		end
	end
  end
end
