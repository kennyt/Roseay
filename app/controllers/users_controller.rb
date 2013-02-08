class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
    @liked_songs = @user.liked_songs.reverse
    @submissions = @user.submissions.reverse
  end

  def index
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(params[:user])

    if @user.save
      build_cookie(@user)
      redirect_to songs_path
    else
      flash.now[:notice] = @user.errors.full_messages.first

      render root_path
    end
  end
end
