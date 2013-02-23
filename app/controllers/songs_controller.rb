class SongsController < ApplicationController
  def index
    if params[:by_time] == '0' || params[:by_time].nil? || params[:by_time] == ''
      # @songs = Song.all.sort {|x, y| y.true_value <=> x.true_value}
      @songs = Song.includes(:author).sort {|x,y| y.true_value <=> x.true_value }
      # @song_with_users = Song.includes(:author).sort {|x,y| y.true_value <=> x.true_value }
    else
      @songs = Song.includes(:author).order('created_at DESC').all
      # @song_with_users = Song.includes(:author).order('created_at DESC').all
      # @songs = Song.order('created_at DESC').all
      @by_time = true
    end
    # @all_songs = @songs
    # @songs = @song_with_users
    @song_with_users = @songs

    if params[:page].to_i >= -1
      params[:page] = 0 if params[:page].to_i == -1
      x = (params[:page].to_i * 15)
      @songs = @songs[x.to_i..(x.to_i+14)]
    else
      params[:page] = 0
      @songs = @songs[0..5]
    end

    @next_page = params[:page].to_i + 1
    @start_num = ((params[:page].to_i * 15) + 1)

    if @songs.last == @song_with_users.last
      @more = false
    else
      @more = true
    end

    if params[:d]
      @embed = params[:d]
    end

    respond_to do |format|
      format.html
      # format.json { render :json => custom_json(@song_with_users[@next_page*15..(@next_page*15)+14]) }
      format.json { render :json => custom_json(@songs) }
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
  		# redirect_to songs_path
  	else
	  if current_user
		  	current_user.liked_songs << @song
		  	@song.points += 1
		  	@song.save
		  	# redirect_to songs_path
  		else
  			# redirect_to new_session_path
  		end
  	end

    respond_to do |format|
      format.json { render :json => current_user }
    end
  end
end
