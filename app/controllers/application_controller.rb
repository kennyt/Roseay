class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :current_user

  def build_cookie(user)
    cookies[:user_id] = user.id
    cookies[:token] = SecureRandom.uuid
    user.session_token = cookies[:token]
    user.save
  end

  def current_user
    return nil if cookies[:user_id] == ''
    return nil if cookies[:token] == ''
    User.find(cookies[:user_id]) if cookies[:user_id]
  end
end
