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

  def custom_song_json(songs)
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
        # uphubbed: current_user ? current_user.songhubs.include?(song) ? 1 : 0 : 0,
        author_avg: song.author.avg,
        author_total: song.author.total,
        author_submissions: song.author.submissions.length
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
        authored: remark.user == current_user,
        author_id: remark.user.id,
        time: distance_of_time_in_words(remark.created_at - Time.now),
        author_total: remark.user.total,
        author_avg: remark.user.avg,
        author_submissions: remark.user.submissions.length
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
        if song.song_link.include?('youtube.com')
          link = song.song_link.split('watch?v=')[1]
        else
          link = song.song_link
        end
        if current_user ? current_user.songhubs.include?(song) ? false : true : true
          converted.sub!(original_word, '<span id="song"><a href="/songs?d='+link+'" data-uphubb="true">'+original_word+'</a></span>')
        else 
          converted.sub!(original_word, '<span id="song"><a href="/songs?d='+link+'">'+original_word+'</a></span>')
        end
      end
    end
    converted
  end
end
