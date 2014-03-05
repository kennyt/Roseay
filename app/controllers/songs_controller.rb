class SongsController < ApplicationController
  def index
      if params[:lytics]
        @slistens = SongListen.all[-10..-1]
        @slistens = @slistens.select{|x| Song.find_by_id(x.song_id) }
        @likez = Like.order('created_at DESC')[0..5]
        @songz = Song.order('created_at DESC')[0..5]
        @userz = User.last
        @mentionz = Mention.order('created_at DESC').select{|x| x.id > 5 && Song.find_by_id(x.remark_id) && !(x.id == 468)}
        @lib_listens = Mention.find_by_id(468)
        @lib_count = LibrarySong.order('created_at DESC').limit(10)
      else
        if params[:fetch]
          @songs = Song.order('created_at DESC').includes(:author).all
        end

        # if params[:d]
        #   @embed = params[:d]
        #   @id = Song.all.select{|song| song.song_link.include?(params[:d])}[0].id
        # elsif params[:s]
        #   @soundcloud_embed = Song.find(params[:s].scan(/[0-9]/).join('').to_i).song_link
        #   @id = params[:s].scan(/[0-9]/).join('').to_i
        # end

        @client = Soundcloud.new(:client_id => '8f1e619588b836d8f108bfe30977d6db')
        @song = Song.new
        @user = User.new
      end

    respond_to do |format|
      if params[:lytics]
        # if current_user
          format.html { render 'analytics' }
        # end
      else
        format.html
        format.json { render :json => custom_song_json(@songs) }
      end
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
    if params[:song][:song_link].include?('&')
      params[:song][:song_link] = params[:song][:song_link].split('&')[0]
    end
    params[:song][:song_artist] = upcase_input(params[:song][:song_artist])
    params[:song][:song_name] = upcase_input(params[:song][:song_name])
    
    @song = current_user.submissions.new(params[:song]) if current_user
    unless params[:song][:song_link].include?('youtube.com') || params[:song][:song_link].include?('soundcloud.com')
      @song = false
    end
    respond_to do |format|
    	if current_user.songs_made_twelve_hours.length < 10 && @song && @song.save 
        format.json { render :json => custom_single_song_json(@song)}
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
