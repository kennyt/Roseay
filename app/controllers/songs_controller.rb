class SongsController < ApplicationController
  def index
    if params[:by_time] == '0' || params[:by_time].nil?
      @songs = Song.all.sort {|x, y| y.true_value <=> x.true_value}
    else
      @songs = Song.order('created_at DESC').all
    end
    @all_songs = @songs

    if params[:page]
      x = (params[:page].to_i * 15)
      @songs = @songs[x.to_i..(x.to_i+14)]
    else
      params[:page] = 0
      @songs = @songs[0..14]
    end
    @next_page = params[:page].to_i + 1
    @start_num = ((params[:page].to_i * 15) + 1)
    if @songs.last == @all_songs.last
      @more = false
    else
      @more = true
    end
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
  		flash.now[:notice] = @song.errors.full_messages.first
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
