class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :current_user, :able_to_vote?, :able_to_uphub?
  include ActionView::Helpers::DateHelper

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

  def able_to_vote?(song, user)
    !(user.liked_songs.include?(song) || user.submissions.include?(song))
  end

  def able_to_uphub?(song, user)
    if current_user
      !(user.songhubs.include?(song))
    else
      return true
    end
  end

  def custom_json(songs)
    songlist = songs.map do |song|
      {
        id: song.id,
        created_at: song.created_at,
        points: song.points,
        song_artist: song.song_artist,
        song_link: song.song_link,
        song_name: song.song_name,
        user_id: song.user_id,
        voted: current_user ? (current_user.liked_songs.include?(song) || current_user == song.author) ? 0 : 2 : 1,
        author: song.author.username,
        author_id: song.author.id,
        time: distance_of_time_in_words(song.created_at - Time.now),
        uphubbed: current_user.songhubs.include?(song) ? 1 : 0,
        author_avg: song.author.avg,
        author_total: song.author.total,
        author_submissions: song.author.submissions.length
      }
    end

    songlist.to_json
  end
end
