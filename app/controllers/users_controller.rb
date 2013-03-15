class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
    @remarks = []
    @user.submissions.each {|song| @remarks << Remark.mentioned_song(song.id) }
    @remarks = @remarks.flatten.uniq
    @remarks.sort! {|x, y| y.created_at <=> x.created_at }
    page = params[:page].to_i

    respond_to do |format|
      format.html
      if @remarks[page*16..page*16+15].nil?
        format.json { render :json => {} }
      else
        format.json { render :json => custom_remark_json(@remarks[page*16..page*16+15]) }
      end
    end
  end

  def new
    @user = User.new
  end

  def create
    user = User.new(params[:user])
    user.username.downcase!

    if user.save
      build_cookie(user)
      redirect_to songs_path
    else
      flash.now[:notice] = user.errors.full_messages.first
      @user = user
      render 'users/new', notice: 'oops!'
    end
  end
end
