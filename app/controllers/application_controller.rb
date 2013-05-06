class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :current_user, :able_to_vote?, :able_to_uphub?
  include ActionView::Helpers::DateHelper

  def build_cookie(user)
    cookies.permanent[:user_id] = user.id
    cookies.permanent[:token] = SecureRandom.uuid
    user.update_attribute(:session_token, cookies[:token])
    # user.session_token = cookies[:token]
    # user.save
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

  def custom_single_song_json(song)
    {
      id: song.id,
      points: song.points,
      song_artist: song.song_artist,
      song_link: song.song_link,
      song_name: song.song_name,
      voted: 0,
      author: song.author.username,
      authored: true,
      time: distance_of_time_in_words(song.created_at - Time.now)
    }
  end

  def custom_song_json(songs)
    # all_users_total = User.all_total
    # all_songs_listens = Song.all_recent_listens
    if current_user
      liked_songz = []
      recently_listened = []
      current_user.liked_songs.each{|song| liked_songz << song}
      current_user.song_listens.order('created_at DESC').each do |listen|
        break if recently_listened.length == 10
        recently_listened << listen.song_id unless recently_listened.include?(listen.song_id)
      end
      logged_in = []
      logged_in << current_user
      logged_in = logged_in[0]
      songlist = songs.map do |song|
        author = song.author
        logged_in == author ? authoredz = true : authoredz = false
        {
          id: song.id,
          points: song.points,
          song_artist: song.song_artist,
          song_link: song.song_link,
          song_name: song.song_name,
          voted: authoredz || liked_songz.include?(song) ? 0 : 2,
          author: author.username,
          authored: authoredz,
          time: distance_of_time_in_words(song.created_at - Time.now),
          priority: Time.now - song.created_at < 172800 ? 1 : 0,
          recently_listened: recently_listened.index(song.id) ? recently_listened.index(song.id) + 1 : false
          # listen_count: all_songs_listens[song.id.to_s],
          # author_total: all_users_total[author.id.to_s]
        }
      end
    else
      songlist = songs.map do |song|
        author = song.author
        {
          id: song.id,
          points: song.points,
          song_artist: song.song_artist,
          song_link: song.song_link,
          song_name: song.song_name,
          voted: 2,
          author: author.username,
          authored: false,
          time: distance_of_time_in_words(song.created_at - Time.now),
          priority: Time.now - song.created_at < 172800 ? 1 : 0,
          recently_listened: false
          # listen_count: all_songs_listens[song.id.to_s],
          # author_total: all_users_total[author.id.to_s]
        }
      end
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
        authored: current_user ? remark.user == current_user || current_user.id == 8 || current_user.id == 11 : false,
        author_id: remark.user.id,
        time: distance_of_time_in_words(remark.created_at - Time.now),
        author_total: remark.user.total
      }
    end
  end

  def custom_user_json
    # x = current_user.they_liked.order('created_at DESC').limit(3).map do |like|
    #   {
    #     song: like.song.song_artist + ' - ' + like.song.song_name,
    #     timestamp: distance_of_time_in_words(like.created_at - Time.now),
    #     recent: (Time.now - like.created_at) < 3600 ? 1 : 0
    #   }
    # end
    # y = current_user.they_listened.order('created_at DESC').limit(9).map do |listen|
    #   {
    #     song: listen.song.song_artist + ' - ' + listen.song.song_name,
    #     timestamp: distance_of_time_in_words(listen.created_at - Time.now),
    #     recent: (Time.now - listen.created_at) < 3600 ? 1 : 0
    #   }
    # end
    # [x, y]
    x = User.all.select{|x| x.submissions.length > 0}.sort{|y,w| w.total <=> y.total}
    current_user ? current = ([]<< current_user)[0] : current = false
    x.map do |user|
      {
        username: user.username,
        total: user.total,
        is_current_user: user == current ? 1 : 0
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

  def upcase_input(input)
    input = input.split(' ')
    input.map do |word|
      capped_char = word[0]
      if capped_char == '(' && word.length > 1
        capped_char = word[1]
        '(' + capped_char.upcase + word[2..-1]
      else
        capped_char.upcase + word[1..-1]
      end
    end.join(' ')
  end
end
