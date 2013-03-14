class SongsController < ApplicationController
  def index

    if params[:random] == '1'
      all_songs = Song.all
      @songs = []
      while @songs.length < 31 do
        x = all_songs.sample
        unless @songs.include?(x)
          @songs << x
        end
      end
      
    else
      if params[:by_time] == '0' || params[:by_time].nil? || params[:by_time] == ''
        @songs = Song.includes(:author).all
        @songs.sort! {|x,y| y.true_value <=> x.true_value }
      else
        @songs = Song.includes(:author).order('created_at DESC').all
        @by_time = true
      end
    end
    @song_with_users = @songs

    if params[:page].to_i >= -1
      params[:page] = 0 if params[:page].to_i == -1
      x = (params[:page].to_i * 30)
      @songs = @songs[x..(x+29)]
    else
      params[:page] = 0
      @songs = @songs[0..5]
    end

    @next_page = params[:page].to_i + 1
    @start_num = ((params[:page].to_i * 30) + 1)

    if @songs.last == @song_with_users.last
      @more = false
    else
      @more = true
    end

    if params[:d]
      @embed = params[:d]
    end

    @client = Soundcloud.new(:client_id => '8f1e619588b836d8f108bfe30977d6db')
    @song = Song.new
    @user = User.new

    respond_to do |format|
      format.html
      format.json { render :json => custom_song_json(@songs) }
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

    respond_to do |format|
    	if @song.save
    		# redirect_to songs_path
        format.json { render :json => @song}
    	else
    		flash.now[:notice] = @song.errors.full_messages.first
    		render 'songs/new'
    	end
    end
  end

  def upvote
	 @song = Song.find(params[:id])
  	if @song.author == current_user
  	else
	    if current_user && !current_user.liked_songs.include?(@song)
		  	current_user.liked_songs << @song
		  	@song.points += 1
		  	@song.save
  		end
  	end

    respond_to do |format|
      format.json { render :json => current_user }
    end
  end

  def uphub
    @song = Song.find(params[:id])
    if current_user && !(current_user.songhubs.include?(@song))
      current_user.songhubs << @song
    else
      redirect_to new_session_path
    end

    respond_to do |format|
      format.json { render :json => current_user }
    end
  end

  def show
    @songcomments = Song.find(params[:id]).songcomments
  end

  def songcomment
    @song = Song.find(params[:id])
    songcomment = @song.songcomments.new(params[:songcomment])
    if songcomment.save
      current_user.songcomments << songcomment
    end

    respond_to do |format|
      format.json { render :json => custom_comment_json(@song.songcomments)}
    end
  end
end
