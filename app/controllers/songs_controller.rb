class SongsController < ApplicationController
  def index
    @songs = Song.includes(:author).all
    @songs.sort! {|x,y| y.true_value <=> x.true_value }
    @song_with_users = @songs

    if params[:d]
      @embed = params[:d]
      @id = Song.all.select{|song| song.song_link.include?(params[:d])}[0].id
    elsif params[:s]
      @soundcloud_embed = Song.find(params[:s].scan(/[0-9]/).join('').to_i).song_link
      @id = params[:s].scan(/[0-9]/).join('').to_i
    end

    @client = Soundcloud.new(:client_id => '8f1e619588b836d8f108bfe30977d6db')
    @song = Song.new
    @user = User.new

    respond_to do |format|
      format.html
      format.json { render :json => custom_song_json(@song_with_users) }
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
    @song = false;
  	@song = current_user.submissions.new(params[:song]) if current_user
    unless params[:song][:song_link].include?('youtube.com') || params[:song][:song_link].include?('soundcloud.com')
      @song = false
    end

    respond_to do |format|
    	if current_user.songs_made_twelve_hours.length < 10 && @song && @song.save 
        format.json { render :json => @song}
    	else
    		format.json { render :json => {'error' => 'yes'}.to_json }
    	end
    end
  end

  def destroy
    @song = Song.find(params[:id])

    respond_to do |format|
      @song.destroy
      format.json { render :json => {'success' => 'yes'}.to_json }
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
