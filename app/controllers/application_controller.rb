class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :current_user, :able_to_vote?, :able_to_uphub?
  include ActionView::Helpers::DateHelper

  def build_cookie(user)
    cookies.permanent[:user_id] = user.id
    cookies.permanent[:token] = SecureRandom.uuid
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

  def custom_song_json(songs)
    songlist = songs.map do |song|
      {
        id: song.id,
        created_at: song.created_at,
        points: song.points,
        song_artist: song.song_artist,
        song_link: song.song_link,
        song_name: song.song_name,
        # user_id: song.user_id,
        voted: current_user ? (current_user.liked_songs.include?(song) || current_user == song.author) ? 0 : 2 : 1,
        author: song.author.username,
        authored: current_user ? current_user == song.author || current_user.id == 8 || current_user.id == 11 : false,
        # author_id: song.author.id,
        time: distance_of_time_in_words(song.created_at - Time.now),
        listen_count: song.song_listens.length
        # uphubbed: current_user ? current_user.songhubs.include?(song) ? 1 : 0 : 0,
        # author_avg: song.author.avg,
        # author_total: song.author.total,
        # author_submissions: song.author.submissions.length
      }
    end

    songlist
  end

  def custom_remark_json(remarks)
    remarks.map do |remark|
      {
        id: remark.id,
        user_id: remark.user_id,
        created_at: remark.created_at,
        body: convert_with_links(remark.body),
        author: remark.user.username,
        authored: remark.user == current_user || current_user.id == 8 || current_user.id == 11,
        author_id: remark.user.id,
        time: distance_of_time_in_words(remark.created_at - Time.now),
        author_total: remark.user.total
      }
    end
  end

  def convert_with_links(body)
    converted = body
    words = body.split(' ').select {|word| word.include?('&')}
    words.select! do |word|
      if word.count('&') == 2
        word.sub('&', '')[1..-1].to_i < Song.last.id + 1 && word.sub('&','')[1..-1].to_i > 0
      else
        word[1..-1].to_i < Song.last.id + 1 && word[1..-1].to_i > 0
      end
    end
    words.each do |word|
      original_word = word.dup
      word.sub!('&', '') if word.count('&') == 2
      if Song.find_by_id(word[1..-1]).nil? 
        return converted
      else
        song = Song.find(word[1..-1])
        song_name = song.song_artist + ' - ' + song.song_name
        if song.song_link.include?('youtube.com')
          link = song.song_link.split('watch?v=')[1]
        else
          link = song.song_link
        end
        converted.sub!(original_word, '<span class="add-to-queue remark-queue" data-songid="'+song.id.to_s+'" data-link="/songs?d='+link+'" data-name="'+song_name+'">'+original_word+'</span>')
      end
    end
    converted
  end
end
