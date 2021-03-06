class SessionsController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.find_by_username(params[:user][:username])
    @user = @user.try(:authenticate, params[:user][:password])

    respond_to do |format|
      if @user
        build_cookie(@user)
        format.json { render :json => current_user }
      else
        format.json { render :json => {'error' => 'yes'}.to_json }
      end
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
