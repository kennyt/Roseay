class SessionsController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.find_by_username(params[:user][:username])

    if @user
      build_cookie(@user)
      redirect_to songs_path
    else
      flash.now[:notice] = "Email/Password incorrect"
      @user ||= User.new
      render 'new'
    end
  end

  def destroy
    @user = current_user

    @user.update_attributes(session_token: nil)
    cookies[:token] = nil
    cookies[:user_id] = nil

    redirect_to root_path
  end
end
