// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require bootstrap
//= require_tree .

$(function(){
  idleSeconds = 0;
  songIdle = 0;
  blurSeconds = 0;
  onTab = true;
  playerNumber = 0;
  songs = [];
  names = [];
  listenedAlready = [];
  page = 0;

  var signInRemarks = function(){
    $('.about').hide();
    $('.submit-button').hide();
    $('.small_header_index').hide();
  }

  var fetchSongs = function(callback){
    songIdle = 0;
    $('.top-banner').prepend('<div class="loading-gif"></div>')
    $('h1 a').html('-loading-')

    $.getJSON(
      '/songs.json?fetch=1',
      function(response){
        var beingPlayed = false;
        $.each(songs, function(i, song){
          if (song['being-played']){
            beingPlayed = song;
          }
        })

        names = [];
        songs = null;
        oldPage = page;
        page = 0;
        $('.loading-gif').remove();
        $('#songwrap').empty();
        $('#songwrap').attr('start', 1)
        $('h1 a').html('Refresh Song Feed');
        $('.backbtn').attr('class', 'backbtn inactive');
        $('.nextbtn').attr('class', 'nextbtn');
        $('.nextbtn a').html('more');

        $.each(response, function(i, datum){
          if (datum['id'] == beingPlayed['id']){
            datum['being-played'] = true;
          }
          names.push(datum['song_artist'].toLowerCase() + ' - ' +  datum['song_name'].toLowerCase())
        })
        songs = response;
        firstpage = songs.slice(0, 30)
        // $.each(firstpage, function(i, song){
        //   setupSong(song);
        // })

        if (callback){
          callback();
        }
        // var counter = 0;
        // while (counter < 30){
        //  if ($($('#songwrap .song')[counter]).attr('class') == 'song'){
        //   $($('#songwrap .song')[counter]).attr('style', 'background:#F4F5E0;');
        //  }
        //  counter += 2;
        // }
      }
    )
  }

  var setupSong = function(datum){
    var songID = datum['id']
    var link = datum['song_link'].split('watch?v=')[1]
    var points = datum['points']
    var time = datum['time'].replace('about ', '');
    if (datum['being-played']){
      var beingPlayed = ' being-played';
    } else {
      var beingPlayed = '';
    }

    if (link == undefined){
      var link = datum['song_link'];
    }

    $('#songwrap').append('<li class="song'+beingPlayed+'" id="'+songID+'"></li>')
    if ((datum['voted'] == 0)||(datum['voted'] == 1)){
      $('#'+songID).append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
    // } else if (datum['voted'] == 1){
    //   $('#'+songID).append('<a href="/sessions/new" class="upvote">^</a>&nbsp;&nbsp;&nbsp;')
    } else {
      $('#'+songID).append('<a data_song_index="'+songs.indexOf(datum)+'" href="/songs/'+songID+'/upvote" class="upvote">^</a>&nbsp;&nbsp;&nbsp;')
    }
    //  &nbsp;<span data-songid="'+songID+'" class="add-to-queue">+Q </span>
    $('#'+songID).append('<span id="song"><a href="/songs?d='+link+'"><span class="song-artist">'+datum['song_artist']+'</span><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="song-name">'+datum["song_name"]+'</span></a></span>')
                 .append('<div class="info_bar">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>')
    $('#'+songID+' .info_bar').append('<span class="12345">'+points+' points ~ </span>')
                              .append('<span class="user">'+datum["author"]+'('+datum["author_total"]+' points)</span>')
                              // .append('&nbsp;|&nbsp;<span class="song-id-filter" data-id='+songID+'>&'+datum['id']+
                              //         '</span>')
    $('#'+songID+' .info_bar').append('<span class="song-timestamp">'+time +'</span>')
    // $('#'+songID).append('<a data-song="'+songID+'" href="#newBumpModal" class="bump-button" data-toggle="modal">bump song</a>');
    if (datum['authored']){
      $('#'+songID+' .info_bar').append(' | <span class="delete-song" data-delete-id="'+songID+'">delete</span>')
    }
  }

  var setupHiddenSong = function(datum){
    var songID = datum['id']
    var link = datum['song_link'].split('watch?v=')[1]
    if (link == undefined){
      var link = datum['song_link'];
    }
    $('.hidden-song').append('<li class="song" id="'+songID+'"></li>')
    $('.hidden-song .song').append('<span id="song"><a href="/songs?d='+link+'"><span class="song-artist">'+datum['song_artist']+'</span><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="song-name">'+datum["song_name"]+'</span></a></span>')
  }

  var setupNextSong = function(datum){
    $('.up-next-song').empty();
    var songID = datum['id']
    var link = datum['song_link'].split('watch?v=')[1]
    if (link == undefined){
      var link = datum['song_link'];
    }
    $('.up-next-song').append('<div class="song" id="'+songID+'"></div>')
    $('.up-next-song .song').append('<span id="song"><a href="/songs?d='+link+'" data-upnext=1><span class="song-artist">'+datum['song_artist']+'</span><br><span class="song-name">'+datum["song_name"]+'</span></a></span>')
    if (datum['points'] > 7){
      $('.up-next-song').append('<div class="hot-tag">hot</div>')
    } else if (datum['priority'] == 1){
      $('.up-next-song').append('<div class="new-tag">new</div>')
    }
  }

  var setupSongBelowPlayer = function(i, song){
    var songID = song['id']
    var link = song['song_link'].split('watch?v=')[1]
    var points = song['points']

    if (link == undefined){
      var link = song['song_link'];
    }

    $('.other-songs-right-side').append('<span class="song"></span>')
    $($('.other-songs-right-side .song')[i]).append('<span id="song"><a is-blue="1" data-songid="'+songID+'" href="/songs?d='+link+'">'+song["song_artist"]+" - "+song["song_name"]+'</a></span>&nbsp;<span data-song-name="'+song['song_artist']+ ' - ' + song['song_name']+'" data-songid="'+songID+'" class="add-to-queue">+Q </span><br>')
  }

  var setupTopSong = function(i, song){
    var songID = song['id']
    var points = song['points']
    var link = song['song_link'].split('watch?v=')[1]

    if (link == undefined){
      var link = song['song_link'];
    }

    $('.topsongs').append('<span class="song"></span>')
    //&nbsp;<span data-song-name="'+song['song_artist']+ ' - ' + song['song_name']+'" data-songid="'+songID+'" class="add-to-queue">+Q </span>
    $($('.topsongs .song')[i]).append('<li id="song"><a data-songid="'+songID+'" href="/songs?d='+link+'">'+song["song_artist"]+" - "+song["song_name"]+'</a></li>')
  }

  var setupCurrentSong = function(songId){
    var song = false;
    $.each(songs, function(i, checkSong){
      if (checkSong['id'] == songId){
        song = checkSong;
      }
    })
    $('.current-song').empty();
    if (song){
      if (song['voted'] == 2){
        $('.current-song').append('<a data_song_index="'+songs.indexOf(song)+'" href="/songs/'+songId+'/upvote" class="upvote">^</a>&nbsp;&nbsp;&nbsp;')
      }
      $('.current-song').append(song['song_artist'] + ' - ' + song['song_name'])
    }
  }

  var changeIntoVoted = function(songId){
    var chosenSong = false;
    $.each(songs, function(i, song){
      if (song['id'] == songId){
        chosenSong = song
      }
    })
    $('.below-main').empty();
    $('.below-main').append('<br><div class="show-song-author">'+ (parseInt(chosenSong['points']) + 1) +' people like this song<br>contributed by '+chosenSong['author']+'</div>')
    $('.below-main').append('<div class="vote-box"><br><br>liked</div>')
    if (chosenSong['priority']){
      $('.below-main').append('<div class="recently-added-tag">Recently Added</div>')
    }
  }

  var fillOtherSongs = function(songId){
    var song;
    var similarAuthorSongs = [];
    var chosenAuthored = [];
    var oldSongs = songs.slice(31, songs.length)
    var oldSongsShow = [];
    $('.other-songs-right-side').empty();
    $('.upvote-player').empty();
    $('.player-info').empty();

    $.each(songs, function(i, checkSong){
      if (checkSong['id'] == songId){
        song = checkSong;
      }
    })

    if (song['song_link'].indexOf('soundcloud') != -1){
      var nameShortened = [];
      $.each((song['song_artist'] + ' ' + song['song_name']).split(' '), function(i, word){
        if ((word.slice(0,1) == '(') || (word.slice(0,1) == '&') || (word.slice(0,1) == parseInt(word.slice(0,1))) ){
          nameShortened.push('a')
        } else {
          nameShortened.push(word.slice(0,1))
        }
      })
      var nameShortened = nameShortened.join('')
      var IdString = song['id'] + ''
      var embedSongLink = 's='+IdString.slice(0, IdString.length/2+1) + nameShortened + IdString.slice(IdString.length/2+1, IdString.length)
    } else {
      var embedSongLink = 'd='+song['song_link'].split('?v=')[1]
    }
    $('.other-songs-right-side').append('<span class="song_link">share this song! ~ roseay.com/songs?'+embedSongLink+'</span><br>');

    $.each(songs, function(i, checkSong){
      if (checkSong['author'] == song['author']){
        similarAuthorSongs.push(checkSong);
      }
    })
    var index = similarAuthorSongs.indexOf(song)

    if (index){
      similarAuthorSongs.splice(index, index);
    } else {
      similarAuthorSongs.splice(index, index + 1);
    }

    if (similarAuthorSongs.length >= 3){
      while(!(chosenAuthored.length == 3)){
        var uniqueSong = similarAuthorSongs[Math.floor(Math.random()*(similarAuthorSongs.length))]
        if (chosenAuthored.indexOf(uniqueSong) == -1){
          chosenAuthored.push(uniqueSong)
        }
      }
    } else {
      chosenAuthored = similarAuthorSongs;
    }
    
    while(oldSongsShow.length != (6 - chosenAuthored.length) ){
      var oldSong = oldSongs[Math.floor(Math.random()*(oldSongs.length))]
      if ((oldSongsShow.indexOf(oldSong) == -1) && (chosenAuthored.indexOf(oldSong) == -1)){
        oldSongsShow.push(oldSong);
      }
    }
    if (chosenAuthored.length){
      $('.other-songs-right-side').append('<div class="other-songs-title">more songs posted by '+song['author']+'</div>');
      $.each(chosenAuthored, function(i, song){
        setupSongBelowPlayer(i, song);
      })
    }
    $('.other-songs-right-side').append('<div class="other-songs-title">other songs</div>')
    $.each(oldSongsShow, function(i, song){
      setupSongBelowPlayer(i+chosenAuthored.length,song);
    })
    if (song['voted'] == 0){
      // $('.upvote-player').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
      $('.upvote-player').append('<div class="checkmark"></div>');
      $('.upvote-player').append('<div class="upvote-text">voted already</div>')
    } else if (song['voted'] == 1){
      $('.upvote-player').append('<a href="/sessions/new" class="upvote">^</a>&nbsp;&nbsp;&nbsp;')
      $('.upvote-player').append('<div class="upvote-text">need to login to vote</div>')
    } else {
      $('.upvote-player').append('<a data_song_index="'+songs.indexOf(song)+'" href="/songs/'+song['id']+'/upvote" class="upvote">^</a>&nbsp;&nbsp;&nbsp;')
      $('.upvote-player').append('<div class="upvote-text">vote \''+song['song_name']+'\'</div>')
    }

    $('.player-info').append('<br><br>'+song['points'] + ' points<br>' + 'posted ~ '+ song['author'] + '<br>' + song['time'] + ' ago');
    $('.other-songs-holder').show();
  }

  var setupTopSongs = function(){
    var dupSongs = songs.slice();
    var topSongs = dupSongs.sort(function(a,b){return b['listen_count']-a['listen_count']}).slice(0, 10);
    $('.topsongs-holder').empty();
    $('.topsongs-holder').append('<h5 style="margin-left:60px; margin-bottom:-50px;">Trending Songs</h5><br><br>')
    $('.topsongs-holder').append('<ol class="topsongs"></ol>')
    $.each(topSongs, function(i, song){
      setupTopSong(i, song);
    })
  }

  var setUpRecentlyListened = function(){
    var recentlyListened = [];
    $.each(songs, function(i, song){
      if (song['recently_listened']){
        recentlyListened.push(song)
      }
    })
    if (recentlyListened.length){
      recentlyListened = recentlyListened.sort(function(a,b){return a['recently_listened']-b['recently_listened']}).slice(0,5);
      $('.recently-listened-list').empty();
      $.each(recentlyListened, function(i, song){
        setUpSingleRecent(i,song);
      })
      $($('.recently-listened-list .song')[0]).append('<div class="recently-listened-timestamp">most recent</div>')
      if ($('.recently-listened-list .song').length > 2){
        $($('.recently-listened-list .song')[$('.recently-listened-list .song').length -1]).append('<div class="recently-listened-timestamp">least recent</div>')
      }
    }
  }

  var setUpSingleRecent = function(i,song){
    var songID = song['id'];
    var link = song['song_link'].split('watch?v=')[1]
    if (link == undefined){
      var link = song['song_link'];
    }

    $('.recently-listened-list').append('<div class="song"></div>');
    $($('.recently-listened-list .song')[i]).append('<div id="song"><a data-recent="1" data-songid="'+songID+'" href="/songs?d='+link+'">'+song["song_artist"]+" - "+song["song_name"]+'</a></div>')
  }

  var fetchRemarks = function(page, filter, callback) {
    idleSeconds = 0
    if (!(page)) {
      page = 0
    }
    $('.remark-header').attr('data-remark-user-page', '')

    $.getJSON(
      '/remarks.json?page='+page+'&filter='+filter,
      function(response){
        // $('.remark-header').html('remarks');
        $('.remarks').empty();
        if (response.length){
          $.each(response, function(i, datum){
            setupRemark(i, datum);
          })
          $('.next-remark-btn').attr('data-remark-page', page+1)
        } else {
          $('.remarks').append('<div class="remark"><br><span class="remark-body remark-text"> no more remarks </span></div>')
        }
        if (callback){
          callback();
        }
      }
    )
  }

  var setupRemark = function(i, datum){
    $('.remarks').append('<div class="remark" id="'+i+'"><span class="remark-text"><b><span class="user" href="/users/'+datum["author_id"]+
                         '" data_author_total="'+datum["author_total"]+'" data_author_avg="'+datum["author_avg"]+
                         '" data_author_submissions="'+datum["author_submissions"]+'">'+datum["author"]+
                         ' ('+datum['author_total']+')</span></b><span class="remark-info"></span> <br><span class="remark-body">'+
                         datum['body']+'</span><span></div>')
    if (datum['authored']){
      $('.remarks #'+i+' .remark-info').append('&nbsp;| <span class="delete-remark" data-remark-id="'+datum['id']+'">delete</span>')
    }
  }

  var appendUphub = function(that ,songId){
    if (($(that).parent().parent().attr('data-uphub') == 'true') || ($(that).attr('data-uphubb') == 'true')){
      $('.testing1').prepend('<a href="/songs/'+ songId +'/uphub" class="add-to-hubsongs">+.hub</a>')
    }
  }

  var bindScPlayerFinish = function(){
    var widgetIframe = $('iframe')[0],
        widget       = SC.Widget(widgetIframe);
    widget.bind(SC.Widget.Events.FINISH, function(player, data) {
      playNextSong($('.testing1').attr('data-song-played'));
    });
  }

  var playNextSong = function(songzid){
    if ($('.up-next-song .song a').length){
      $($('.up-next-song .song a')[0]).trigger('click');
      var chosenID = $($('.up-next-song .song')[0]).attr('id');
      var chosenSong = false;

      $.each(songs,function(i, song){
        if (song['id'] == chosenID){
          chosenSong = song;
        }
      });
      listenedAlready.push(chosenSong);
      setupNextSong(chooseNextSong());
    } else {
      $('.hidden-song').empty();
      var chosenSong = chooseNextSong();
      if (listenedAlready.indexOf(chosenSong) == -1){
        setupHiddenSong(chosenSong)
        $('.hidden-song .song a').trigger('click');
        // setupBelowMain(chosenSong);
        listenedAlready.push(chosenSong);
      } else {
        playNextSong(songzid);
      }
      var chosenSong = chooseNextSong();
      setupNextSong(chosenSong);
    }
  }

  var chooseNextSong = function(){
    var chosenSong = false;
    var priorityChance = Math.floor(Math.random()*8) == 0
    if (priorityChance){
      var prioritySongs = []
      $.each(songs, function(i, song){
        if (song['priority'] == 1){
          prioritySongs.push(song)
        }
      })
      if (prioritySongs.length){
        chosenSong = prioritySongs[Math.floor(Math.random()*prioritySongs.length)]
      } else {
        chosenSong = songs[Math.floor(Math.random()*songs.length)]
      }
    } else {
      chosenSong = songs[Math.floor(Math.random()*songs.length)]
    }
    if (listenedAlready.indexOf(chosenSong) == -1){
      return chosenSong;
    } else {
      return chooseNextSong();
    }
  }

  var setupBelowMain = function(chosenSong){
    if (chosenSong['points'] == 1){
      var personOrPeople = 'person likes'
    } else {
      var personOrPeople = 'people like'
    }
    $('.below-main').empty();
    $('.below-main').append('<br><div class="show-song-author">'+chosenSong['points']+' '+personOrPeople+' this song<br>contributed by '+chosenSong['author']+'</div>')
    if (chosenSong['voted'] == 0){
      $('.below-main').append('<div class="vote-box"><br><br>liked</div>')
    } else {
      $('.below-main').append('<div class="upvote" data-path="/songs/'+chosenSong['id']+'/upvote"><br><br>like</div>')
    }
    if (chosenSong['priority'] == 1){
      $('.below-main').append('<div class="recently-added-tag">Recently Added</div>')
    }
  }

  var youtubeApiCall = function(playerID){
    $('.player-section').attr('style','')
    if ($('.testing1').attr('data-ytapi-received')){
      constructYTVideo(playerID);
    } else {
      $.getScript("https://www.youtube.com/iframe_api");
      $('.testing1').attr('data-ytapi-received', 'yes')
    }
  }

  var constructYTVideo = function(playerID){
    if (playerID == playerNumber){
      player = new YT.Player('ytplayer' + playerNumber, {
        height: '220',
        width: '545',
        videoId: $('.testing1').attr('data-youtube-code'),
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange,
          'onError': onPlayerError
        }
      })
    }
  }

  function onPlayerError(event){
    createPlayerErrorTooltip();
    var songPlayed = $('.testing1').attr('data-song-played');
    playNextSong(songPlayed);
    $.post('/remarks.json?fix_song='+songPlayed);
  }

  function onPlayerStateChange(event) {
    var myPlayerState;
    myPlayerState = event.data;
    if (myPlayerState == 0){
      playNextSong($('.testing1').attr('data-song-played'));
    }
  }

  function onPlayerReady(event){
    event.target.playVideo();
  }
  
  var createRadioTooltip = function(){
    $('body').prepend('<div class="radio-tooltip">Leave roseay on and we will play curated songs continuously from our '+songs.length+' song library.<div class="close-radio-tooltip">okay</div></div>')
    // setTimeout(function(){
    //   $('.radio-tooltip').remove();
    // }, 6000);
  }

  var createThankTooltip = function(){
    $('body').prepend('<div class="radio-tooltip">Thanks for your contribution!</div>')
    setTimeout(function(){
      $('.radio-tooltip').remove();
    }, 10000)
  }

  var createPlayerErrorTooltip = function(){
    $('body').prepend('<div class="radio-tooltip">We skipped a song for you because the video was broken. We will continue to make your listening experience smooth :)</div>')
    setTimeout(function(){
      $('.radio-tooltip').remove();
    }, 12000)
  }

  var createGoodTasteTooltip = function(songId){
    var likedSongAuthor = false;
    $.each(songs, function(i,song){
      if (song['id'] == songId){
        likedSongAuthor = song['author'];
      }
    })
    var chancinglol = [1,2,3,4]
    var chanced = chancinglol[Math.floor(Math.random()*chancinglol.length)]
    var currentUser = $('#logged_in').html();
    if (chanced == 1){
      var thanks = likedSongAuthor + ' : Thanks, ' + currentUser + '!'
    } else if (chanced == 2) {
      var thanks = currentUser + ', you are awesome. - ' + likedSongAuthor 
    } else if (chanced == 3) {
      var thanks = likedSongAuthor + ': You have good taste.'
    } else if (chanced == 4) {
      var thanks = 'BOOM! Thanks - ' + likedSongAuthor
    }
    $('body').prepend('<div class="radio-tooltip">'+thanks+'</div>')
    setTimeout(function(){
      $('.radio-tooltip').remove();
    }, 5000)
  }

  $('body').on('click','.close-radio-tooltip', function(){
    $('.radio-tooltip').remove();
  })

  var createPostSongTooltip = function(){
    $('body').prepend('<span class="post-song-tooltip">post a song, help the human movement!</span>')
    setTimeout(function(){
      $('.post-song-tooltip').remove();
    }, 6000)
  }

  var checkValidListen = function(uniqueId, songId){
    if ($('#logged_in').length){
      var userId = $('.logout').attr('href').split('sessions/')[1]
    } else {
      var userId = 0;
    }
    setTimeout(function(){
      if ($('.testing1').attr('data-song-number') == uniqueId){
        createListen(songId, userId, function(){
          var song = false;
          $.each(songs,function(i,checkSong){
            if (checkSong['id'] == songId){
              song = checkSong;
            }
          })
          song['recently_listened'] = 0 - playerNumber
          setUpRecentlyListened();
        });
      }
    }, 30000)
  }

  var createListen = function(songId, userId, callback){
    var q = $('.testing1').attr('is-queue');
    var b = $('.testing1').attr('is-blue');
    var s = $('.testing1').attr('is-search');
    var sh = $('.testing1').attr('is-shuffle');
    var l = $('.testing1').attr('is-recent');
    var upnext = $('.testing1').attr('upnext-clicks');
    $('.testing1').attr('upnext-clicks','');

    $.post(
      '/song_listens.json?q='+q+'&b='+b+'&s='+s+'&sh='+sh+'&l='+l+'&upnext='+upnext,
      {'song_listen' : {
        'user_id': userId,
        'song_id': songId
      }}, function(response){
        if (callback){
          callback();
        }
      }
    )
  }

  var createAddedQueueTooltip = function(y, x){
    $('body').append('<span class="queue-add-successful" id="'+x+'-'+y+'">added</span>')
    $('#'+x+'-'+y).css('top', y - 10);
    $('#'+x+'-'+y).css('left', x + 30);
    setTimeout(function(){
      $('#'+x+'-'+y).remove();
    }, 1500)
  }

  $('.next-song-btn').click(function(ev){
    $('.below-main').show();
    playNextSong($('.testing1').attr('data-song-played'));
    $('.radio-next-text').html('>>|');
  })

  $('body').on('click', '.song-modal-submit', function(ev){
    ev.preventDefault();
    var songArtist = $('#song_song_artist').val();
    var songName   = $('#song_song_name').val();
    var songLink   = $('#song_song_link').val();
    $('#song_song_artist').val('uploading..');
    $('#song_song_name').val('just wait..');
    $('#song_song_link').val('a few seconds..');
    $(this).hide();
    $('#close-modal').hide();

    $.post(
      '/songs.json',
      {'song' : {
        'song_name' : songName,
        'song_artist' : songArtist,
        'song_link': songLink
        }
      }, function(response){
        if (response['error']){
          $('#newSongModal h4').append('<br>--not logged in OR bad song link OR reached limit--')
        } else {
          $('#close-modal').trigger('click');
          fetchSongs(function(){
            setupNextSong(response);
          });
          createThankTooltip();
        }
        $('.song-modal-submit').show();
        $('#close-modal').show();
        $('#song_song_artist').val('');
        $('#song_song_name').val('');
        $('#song_song_link').val('');
      }
    )
  })

  $('.radio-button').click(function(){
    if ($('.testing1').attr('data-radio') == 'true') {
      $('.testing1').attr('data-radio', 'false')
      $('.radio-button').html('off')
      $('.next-song-btn').toggle();
    } else {
      $('.testing1').attr('data-radio', 'true')
      $('.radio-button').html('Jarvis on')
      $('.next-song-btn').toggle();
    }
  })

  $('body').on('click', '.delete-remark', function(){
    var remark_id = $(this).attr('data-remark-id')
    var page      = parseInt($('.next-remark-btn').attr('data-remark-page'))-1
    $.post(
      '/remarks/'+ remark_id+'.json?page='+page,
      { '_method': 'delete'},
      function(){
        fetchRemarks(page, '');
      }
    )
  })

  $('body').on('click', '.delete-song', function(){
    var songId = $(this).attr('data-delete-id');
    var origName = $('.song#'+songId+' a').html();

    $('.song#'+songId+' a').html('deleteing...')
    $.post(
      '/songs/'+ songId + '.json',
      {'_method': 'delete'},
      function(response){
        $('h1 a').trigger('click');
      }
    )
  })

  $('body').on('click', '.refresh', function(){
    $('.refresh').html('refreshing..');
    $('.next-remark-btn').attr('data-remark-filter', '');
    fetchRemarks(0, "", function(){
      $('.remark-header').attr('data-remark-user-page', '');
      $('.refresh').html('Refresh Remark Feed');
    });
  })

  $('body').on('click', '.remark-input-btn', function(ev){
    var input  = $('.remark-input').val();
    var filter = $('.next-remark-btn').attr('data-remark-filter');

    if (filter) {
      $('.remark-input').val('&' + filter + ' ');
    } else {
      $('.remark-input').val('');
    }

    // if ($('#logged_in').length){
    $.post(
      '/remarks.json',
      { 'remark':{
        'body': input
        }
      },
      function(response){
        // fetchRemarks(0, filter);
      }
    )
    // } else {
    //   $('.remark-input').val('you have to login to post a remark.')
    // }
  })

  $('body').on('click', '.next-remark-btn', function(ev){
    idleSeconds = 0;
    $(this).append('---')
    var filter = $(this).attr('data-remark-filter');
    var path   = $('.remark-header').attr('data-user-path');

    if ($('.remark-header').attr('data-remark-user-page').length){
      var page = parseInt($('.remark-header').attr('data-remark-user-page')) + 1;
      $.getJSON(
        path + '.json?page=' + page,
        function(data){
          $('.remarks').empty();
          $('.waiting').remove();
          $('.remark-header').attr('data-remark-user-page', parseInt(page) + 1);

          if (data.length){
            $.each(data, function(i, datum){
              setupRemark(i, datum);
            })
          } else {
            $('.remarks').append('<div class="remark"><br><span class="remark-body remark-text"> no more remarks </span></div>')
          }
          $('.next-remark-btn').html('more');
        }
      )
    } else {
      var page = parseInt($(this).attr('data-remark-page'));
      fetchRemarks(page, filter, function(){
        $('.next-remark-btn').html('more')
      })
    }
  })

  $('#12345').on('click', '.backbtn', function(){
    $('.nextbtn').show();
    $('.backbtn').html('less')
    
    if ($('.nextbtn').attr('class') == 'nextbtn inactive'){
      $('.nextbtn').toggleClass('inactive');
    }
    if (page > 0){
      page --
      // $('#songwrap').empty();
      $('#songwrap').attr('start', page*30 + 1)
      // $.each(songs.slice(page*30, page*30+30), function(i, song){
      //   setupSong(song);
      // })
      if ($('#songwrap .song').length % 30 == 0){
        $('#songwrap .song').slice($('#songwrap .song').length - 30, $('#songwrap .song').length).remove();
      } else {
        var notThirty = $('#songwrap .song').length % 30;
        $('#songwrap .song').slice($('#songwrap .song').length - notThirty, $('#songwrap .song').length).remove();
      }
      if (page < 1) {
        $('.backbtn').toggleClass('inactive');
      }
    }
    var counter = 0;
    while (counter < $('#songwrap .song').length){
     if ($($('#songwrap .song')[counter]).attr('class') == 'song'){
      $($('#songwrap .song')[counter]).attr('style', 'background:#F4F5E0;');
     }
     counter += 2;
    }
  })

  // $('#12345').on('click', '.nextbtn', function(ev){
  //   ev.preventDefault();
  //   if ($('.nextbtn').attr('class') == 'nextbtn'){
  //     if (($('.backbtn').attr('class') == 'backbtn inactive') && ($('.nextbtn a').html() != 'unshuffle') && ($('.nextbtn a').html() != 'exit search')){
  //       $('.backbtn').toggleClass('inactive');
  //     }
  //     $('#song-search').val('');
  //     $('.nextbtn a').html('more');

  //     if ((page + 2)*30 >= songs.length){
  //       $('.nextbtn').toggleClass('inactive');
  //     } 

  //     if (page == -1){
  //       $('#songwrap').empty();
  //     }
  //     page ++
  //     $('#songwrap').attr('start', page*30 + 1)
  //     $.each(songs.slice(page*30, page*30+30), function(i, song){
  //       setupSong(song);
  //     })
  //     var counter = 0;
  //     while (counter < $('#songwrap .song').length){
  //      if ($($('#songwrap .song')[counter]).attr('class') == 'song'){
  //       $($('#songwrap .song')[counter]).attr('style', 'background:#F4F5E0;');
  //      }
  //      counter += 2;
  //     }
  //   }

    // ev.stopImmediatePropagation()
    // var that = this;
    // $(that).append('---')

    // if ($('ol').attr('goback-start')){
    //   var songStart = parseInt($('ol').attr('goback-start'))
    // } else {
    //   var songStart = parseInt($('ol').attr('start')) + 30
    // }

    // var page   = parseInt($('.nextbtn a').attr('href').split('?page=')[1])
    // var byTime = $('#12345').attr('data-time')
    // $.getJSON(
    //   '/songs.json?page='+page+'&by_time='+byTime+'',
    //   function(data){
    //     $('#songwrap').remove()
    //     $(that).html('next');
    //     $('#12345').append('<ol start="' + songStart + '" id="songwrap"></ol>')
    //     $.each(data, function(i, datum){
    //       setupSong(datum);
    //     })
    //     $('#songwrap').append('<span class="pagination"><span id="nextbtn"><a href="/songs?page='+ (page+1) +'">more</a></span></span>')
    //   }
    // )
  // })

  // $('body').on('click', '.user', function(ev){
  //   ev.preventDefault();
  //   ev.stopImmediatePropagation()
  //   idleSeconds = 0;
  //   $('h1').append('<span class="waiting">...</span>')
  //   $('.remark-input').val('');

  //   var username = $(this).html();
  //   var path     = $(this).attr('href')
  //   var total    = $(this).attr('data_author_total')

  //   $.getJSON(
  //     path + '?page=0',
  //     function(data){
  //       $('.remarks').empty();
  //       $('.waiting').remove();
  //       $('.remark-header').html('remarks on ' + username + '\'s songs | total points ~ ' + total)
  //       $('.remark-header').attr('data-remark-user-page', 0);
  //       $('.remark-header').attr('data-user-path', path);

  //       if (data.length){
  //         $.each(data, function(i, datum){
  //           setupRemark(i, datum);
  //         })
  //       } else {
  //         $('.remarks').append('<div class="remark"><br><span class="remark-body remark-text"> no more remarks </span></div>')
  //       }
  //     }
  //   )
  // })

  $('body').on('click', '.upvote',function(ev){
    ev.preventDefault();
    ev.stopImmediatePropagation();

    if ($('#logged_in').length){
      var parent = this.parentNode;
      var songID = parseInt($(parent).attr('id'));
      if (!(songID)){
        songID = $(this).attr('data-path').split('/')[2]
      }
      var index = parseInt($(this).attr('data_song_index'))

      path = $(this).attr('data-path') + '.json'
      $(this).remove();
      changeIntoVoted(songID);

      if ($('.left-side-wrapper .song#'+songID+' .upvote').length){
        $('.left-side-wrapper .song#'+songID+ ' .upvote').remove();
        $('.left-side-wrapper .song#'+songID).prepend('&nbsp;&nbsp;&nbsp;')
        $('.upvote-player').empty()
        $('.upvote-player').append('<div class="checkmark"></div>')
        $('.upvote-player').append('<div class="upvote-text">voted</div>')
      }
      if (path == '/sessions/new.json'){
        $('#songwrap').append('<a class="need-to-login" href="#newSessionModal" data-toggle="modal">login</a>')
        $('.need-to-login').css('top', ev.pageY - 8)
        $('.need-to-login').css('left', ev.pageX - 60)
      } else {
        $.post(path, function(response){
          setTimeout(function(){
            createGoodTasteTooltip(songID);
          }, 2000)
          var votedSong = false;
          $.each(songs,function(i,song){
            if (song['id'] == songID){
              votedSong = song;
            }
          })
          votedSong['voted'] = 0;
          votedSong['points'] ++;

          if (songs[parseInt($('.upvote-player .upvote').attr('data_song_index'))]){
            if (songs[parseInt($('.upvote-player .upvote').attr('data_song_index'))]['id'] == songID){
              $('.upvote-player').empty()
              $('.upvote-player').append('<div class="checkmark"></div>')
              $('.upvote-player').append('<div class="upvote-text">voted</div>')
            }
          }
          if ($('.current-song .upvote').attr('href').split('/')[2] == songID){
            $('.current-song .upvote').remove();
          }
        })
      }
    } else {
      $('#login-modal').trigger('click');
      $.post('/remarks.json?guest_like=1');
      $('#login-modal').attr('data-guest','1');
    }
  })

  // $('.testing1').on('click', '.add-to-hubsongs', function(ev){
  //   ev.preventDefault();
  //   ev.stopImmediatePropagation();
  //   var path = $(this).attr('href')
  //   $(this).remove();

  //   if ($('.x1c2').length){
  //     $('.testing1').append('<a class="need-to-login2" href="/sessions/new">login</a>')
  //     $('.need-to-login2').css('top', ev.pageY)
  //     $('.need-to-login2').css('left', ev.pageX)
  //   } else {
  //     $.post(path)
  //   }
  // })

  $('body').on('click', '#song a', function(ev){
    $('.being-played').attr('class', 'song')
    var clickedId = $(this).parent().parent().attr('id');
    if (!(clickedId)){
      clickedId = $(this).attr('data-songid');
    }
    setupCurrentSong(clickedId);
    $('.song#'+clickedId).attr('class', 'song being-played');
    $('.song#'+clickedId).attr('style', '');
    ev.preventDefault();
    ev.stopImmediatePropagation();
    // fillOtherSongs(clickedId);
    playerNumber ++;

    $.each(songs, function(i, checkSong){
      checkSong['being-played'] = false;
      if (checkSong['id'] == clickedId){
        checkSong['being-played'] = true;
      }
    })

    $('.testing1').attr('data-song-number', playerNumber);
    $('.player-holder').remove();
    $('.next-song-btn').attr('class', 'next-song-btn');
    var queueSong = $(this.parentNode).attr('data-queue');

    if ($('.radio-next-text').html() == 'play'){
      $('.radio-next-text').html('>>|')
      // setTimeout(function(){
      //   createRadioTooltip();  
      // }, 7000)
    }

    var link   = this['href'].split('songs?d=')[1]
    var songId = $(this).parent().parent().attr('id')
    $('.testing1').attr('data-youtube-code', link + '?vq=hd720&autoplay=1&controls=1&iv_load_policy=3&autohide=1&modestbranding=1')
    $('.testing1').attr('data-song-played', songId);
    $('iframe').remove();

    if (link == undefined){
      var link = datum['song_link'];
    }

    if (link.indexOf('soundcloud')+1){
      $('.player-section').attr('style','height:171px;');
      var currentPlayer = playerNumber;
      var link = link.replace(/%2F/g, '/').replace(/%3A/g, ':')
      SC.oEmbed(link,{auto_play:true, maxwidth:545, height:300, show_comments: true, color:'602220' }, function(track){
        $('.player-section').attr('style','');
        if (currentPlayer == playerNumber){
          if (track){
            console.log(track);
            track.html['height'] = 300
            $('.left-side-wrapper').prepend(track.html);
            bindScPlayerFinish();
          } else {
            createPlayerErrorTooltip();
            playNextSong($('.testing1').attr('data-song-played'));
            $.post('/remarks.json?fix_song='+$('.testing1').attr('data-song-played'));
          }
        }
      })
    } else {
      $('.player-section').attr('style','height: 220px;')
      $('.left-side-wrapper').prepend('<div id="ytplayer'+playerNumber+'"></div>')
      youtubeApiCall(playerNumber);
    }

    if ($(this).attr('data-recent')){
      $('.testing1').attr('is-recent','1');
    } else {
      $('.testing1').attr('is-recent', '');
    }

    if (queueSong == '1'){
      $(this).parent().parent().remove();
      if (!($('.queue-songs a').length)){
        $('.queue-songs').html('&nbsp;&nbsp;&nbsp;empty')
      }
      $('.testing1').attr('is-queue', '1');
    } else {
      $('.testing1').attr('is-queue', '');
    }

    if ($(this).attr('is-blue')){
      $('.testing1').attr('is-blue', '1');
    } else {
      $('.testing1').attr('is-blue', '');
    }

    if ($('.nextbtn a').html() == 'unshuffle'){
      $('.testing1').attr('is-shuffle', '1')
    } else {
      $('.testing1').attr('is-shuffle', '')
    }

    if ($('.nextbtn a').html() == 'exit search'){
      $('.testing1').attr('is-search', '1');
    } else {
      $('.testing1').attr('is-search', '');
    }

    var counter = 0;
    while (counter < $('#songwrap .song').length){
     if ($($('#songwrap .song')[counter]).attr('class') == 'song'){
      $($('#songwrap .song')[counter]).attr('style', 'background:#F4F5E0;');
     }
     counter += 2;
    }

    checkValidListen(playerNumber, clickedId);
    if ($(this).attr('data-songid')){
      document.title = $(this).html().replace(/&amp;/g, '&');
    } else {
      var artist = $($(this).children()[0]).html().replace(/&amp;/g, '&');
      var title = $($(this).children()[2]).html().replace(/&amp;/g, '&');
      document.title = artist + ' - ' + title
    }

    if ($(this).attr('data-upnext')){
      var upNext = chooseNextSong();
      setupNextSong(upNext);
    }

    $.each(songs,function(i,song){
      if (song['id'] == clickedId){
        setupBelowMain(song);
        listenedAlready.push(song);
      }
    })
  })

  // $('body').on('click', '.add-to-queue', function(ev){
  //   createAddedQueueTooltip(ev.pageY, ev.pageX);
  //   var songID = $(this).attr('data-songid')
  //   var songName = $('.song#'+songID+' #song a').html();
  //   if (!(songName)){
  //     songName = $(this).attr('data-song-name');
  //   }
  //   var songLink = $('.song#'+songID+' #song a').attr('href');
  //   if (!($('.queue-songs #song').length)){
  //     $('.queue-songs').empty();
  //   }
  //   if ($(this).attr('data-link')){
  //     songLink = $(this).attr('data-link');
  //     songName = $(this).attr('data-name');
  //   }
  //   $('.queue-songs').append('<div class="queue-song" id="'+songID+'">&nbsp;&nbsp;&nbsp;<span id="song" data-queue="1"><a href="'+songLink+'">'+songName+'</a> | <span class="delete-queue">delete</span> </span></div> ')
  // })

  // $('body').on('click', '.delete-queue', function(){
  //   $(this.parentNode.parentNode).remove();
  //   if (!($('.queue-songs #song a').length)){
  //     $('.queue-songs').html('&nbsp;&nbsp;&nbsp;empty')
  //   }
  // })

  $('.small_header_index').click(function(){
    // $('h1').append('<span class="song-refreshing">...</span>')
    // $.getJSON(
    //   '/songs.json?random=1',
    //   function(data){
    //     $('#songwrap').remove();
    //     $('.song-refreshing').remove();
    //     $('#12345').append('<ol start="1" id="songwrap"></ol>')
    //     $('#12345').attr('data-time', '')
    //     $.each(data, function(i, datum){
    //       setupSong(datum);
    //     })
    //   }
    // )
    if (songs.length) {
      page = -1;
      $('.backbtn').attr('class', 'backbtn inactive');
      $('.nextbtn a').html('unshuffle');
      $('.nextbtn').attr('class', 'nextbtn');
      $('#songwrap').empty();
      $('#songwrap').attr('start', 1)
      var randomSongs = []
      while(randomSongs.length < 30){
        randomSong = songs[Math.floor(Math.random()*songs.length)]
        if (randomSongs.indexOf(randomSong) == -1) {
          randomSongs.push(randomSong);
        }
      }
      $.each(randomSongs, function(i, song){
        setupSong(song);
      })
      var counter = 0;
      while (counter < 30){
        if ($($('#songwrap .song')[counter]).attr('class') == 'song'){
          $($('#songwrap .song')[counter]).attr('style', 'background:#F4F5E0;');
        }
        counter += 2;
      }
    }
  })

  // $('.relevance').click(function(ev){
  //   ev.preventDefault();
  //   ev.stopImmediatePropagation();
  //   $('h1').append('<span class="song-refreshing">...</span>')
  //   $.getJSON(
  //     '/songs.json?page=-1',
  //     function(data){
  //       $('#songwrap').remove();
  //       $('.song-refreshing').remove();
  //       $('#12345').append('<ol start="1" id="songwrap"></ol>')
  //       $('#12345').attr('data-time', '')
  //       $.each(data, function(i, datum){
  //         setupSong(datum);
  //       })
  //       $('#songwrap').append('<span class="pagination"><span id="nextbtn"><a href="/songs?page=1">next</a></span></span>')
  //     }
  //   )
  // })

  // $('.time').click(function(ev){
  //   ev.preventDefault();
  //   ev.stopImmediatePropagation();
  //   $('h1').append('<span class="song-refreshing">...</span>')

  //   $.getJSON(
  //     '/songs.json?page=-1&by_time=1',
  //     function(data){
  //       $('#songwrap').remove();
  //       $('.song-refreshing').remove();
  //       $('#12345').append('<ol start="1" id="songwrap"></ol>')
  //       $('#12345').attr('data-time', true)
  //       $.each(data, function(i, datum){
  //         setupSong(datum);
  //       })
  //       $('#songwrap').append('<span class="pagination"><span id="nextbtn"><a href="/songs?page=1">next</a></span></span>')
  //     }
  //   )
  // })

  $('h1 a').click(function(ev){
    ev.preventDefault();
    ev.stopImmediatePropagation();

    if ($('#logged_in').length){
      fetchSongs(function(){
        $('.right-side-wrapper').show();
        $('.nextbtn').show();
        $('.backbtn').html('less');
        $('.backbtn').show();
        $('.submit-button').show();
        $('.small_header_index').show();
        setupTopSongs();
      })
    } else {
      fetchSongs(function(){
        var login = $('.new_user')[0];
        var join = $('.new_user')[1];
        setupTopSongs();
        $('.right-side-wrapper').show();
        $('.next-song-btn').attr('style', '');
        $('.nextbtn').show();
        $('.backbtn').html('less');
        $('.backbtn').show();
        $('.small_header_index').show();

        // $('.topsongs .song').slice(3,10).hide();
        // $('.topsongs-holder').append('<div class="remarks-login"></div>')
        // $('.remarks-login').append('<h5>sign in to see trending and to upvote<br>(won\'t leave page)</h5>')
        // $('.remarks-login').append('<h2>sign in</h2>')
        // $('.remarks-login').append(login);
        // $('.remarks-login').append('<h2>join</h2>')
        // $('.remarks-login').append(join);
      })
    }
  })

  // $('body').on('click', ' .song-id-filter', function(){
  //   var id = $(this).attr('data-id');
  //   $('h1').append('<span class="song-refreshing">...</span>');
  //   $('.next-remark-btn').attr('data-remark-filter', id);

  //   fetchRemarks(0, id, function(){
  //     $('.remark-header').html('&' + id + ' remarks');
  //     $('.song-refreshing').remove();
  //     $('.remark-input').val('&' + id + ' ');
  //   });
  // })

  // $('.about').click(function(){
  //   page = 1;
  //   $('#songwrap').empty();
  //   $('.nextbtn').hide();
  //   $('.backbtn').html('go home');
  //   $('.backbtn').attr('class', 'backbtn');
  //   $('#songwrap').append('<div class="about-text">we\'re leading the war against robots,<br>robots who decide what music we listen to<br>join the human music movement<br><br>discovering music sucks.<br>constantly clicking through \'related videos\' - <br>ain\'t nobody got time for that<br><br><br><strong>listening</strong><br><br>1. click play<br><br><br><strong>submitting</strong><br><br>1. <strong>you</strong> post a song (anyone can post) <br><br>2. the song <strong>instantly</strong> goes onto everyone\'s list <br><br> 3. people vote it up!</div>')
  //   // $('#songwrap').append('<div class="about-text"><i>"she got a big booty so I call her big booty"</i> <br> - Two Chainz <br><br> we aspire to be that simple.<br><br><i>"they ask me what I do and who I do it fo"</i><br>-Two Chainz<br><br>we do it because we think the people who share good music<br>are the most awesome people in the world<br><br><b>Jarvis</b><br>Jarvis is the reason that after every song finishes,<br>another song begins to play.<br>Jarvis will intelligently calculate an algorithm that will <br>play the song best matched to your needs, wants, desires.<br> (joking, he chooses a song randomly on the left side of the page)<br>if Jarvis sees that you have a song in your Q <br> he will play the top one. otherwise it\'s up to him to play a song<br>Jarvis is just smart enough to know when you change the page<br>Jarvis loves you<br><br>on the song list, notice the "&" numbers.<br> type it in a remark and it will allow people to queue that song up easily.<br>for example: queue this song up -> <span class="add-to-queue remark-queue" data-link="/songs?d=6jhC6GjGC5M" data-name="Knife Party - Internet Friends (AnonFM Remix)">&25</span><br><br>the ^ button gives the song another point.<br>^ buttons are anonymous<br><br>you are now a master<br>leave jarvis on and party<br>.roseay</div>')
  // })

  $('#song-search').keyup(function(){
      if ($(this).val() == ''){
        $('.nextbtn').trigger('click');
      }
      var input = $(this).val();
      if (input.length > 1){
        page = -1;
        $('.nextbtn a').html('exit search');
        $('.backbtn').attr('class', 'backbtn inactive');
        $('#songwrap').empty();
        $('#songwrap').attr('start', 1)
        matchedNames = [];
        $.each(names, function(i, name){
          if (name.indexOf(input) != -1) {
            song = songs[names.indexOf(name)]
            if (matchedNames.indexOf(song) == -1) {
              matchedNames.push(song);
            }
          }
        })
        if (matchedNames.length){
          $.each(matchedNames, function(i, song){
            setupSong(song);
          })
        } else {
          $('#songwrap').html('<br><span class="search-holder">song doesn\'t exist! <br> help us out! <br> go to <a href="https://www.youtube.com" target="_blank">youtube</a>, find it, and submit it here!</span>')
        }
      }
  })

  $('body').on('click', '.join-session-modal', function(ev){
    ev.preventDefault();
    ev.stopImmediatePropagation();
    var username = $('#create_username').val();
    var password = $('#create_password').val();
    var password_confirmation = $('#create_password_confirmation').val();
    $($('h3')[1]).html('loading...')

    $.post(
      '/users.json',
      {'user' : {
        'username': username,
        'password': password,
        'password_confirmation': password_confirmation
      }}, function(response){
        if (!(response['error'])){
          if ($('#login-modal').attr('data-guest')){
            $.post('/remarks.json?convert_guest_like=1')
          }
          $('#login-modal').remove();
          $('.notifications').show();
          $('.submit-button').show();
          $('.top-banner').prepend('<span id="logged_in"></span><a href="/sessions/'+response['id']+'" class="logout" data-method="delete" rel="nofollow">logout</a>');
          // fetchRemarks(0, '', function(){
          //   $('.refresh').html('Refresh Remark Feed')
          //   $('.next-remark-btn').show();
          //   $('.refresh').show();
          //   $('.remark-news').show();
          // })
          $('#close-login-modal').trigger('click');
          fetchSongs();
          $('#newSongModal h4').html('youtube/soundcloud links');
        } else {
          $($('h2')[1]).html('join')
          $($('.new_user')[1]).prepend('<h4 style="color:red">something went wrong</h4>')
          $('#create_password').val('');
          $('#create_password_confirmation').val('');
        }
      }
    )
  })

  $('body').on('click', '.login-session-modal', function(ev){
    ev.preventDefault();
    ev.stopImmediatePropagation();
    var username = $('#user_username').val();
    var password = $('#user_password').val();
    $($('h3')[0]).html('loading...')

    $.post(
      '/sessions.json',
      {'user' : {
        'username' : username,
        'password' : password
      }}, function(response){
        if (!(response['error'])){
          $('#login-modal').remove();
          $('.notifications').show();
          $('.submit-button').show();
          $('.top-banner').prepend('<span id="logged_in">'+response['username']+'</span><a href="/sessions/'+response['id']+'" class="logout" data-method="delete" rel="nofollow" style="margin-left:50px;">logout</a>')
          $('#newSongModal h4').html('youtube/soundcloud links');
          $('#close-login-modal').trigger('click')
          // fetchRemarks(0, '', function(){
          //   $('.refresh').html('Refresh Remark Feed')
          //   $('.next-remark-btn').show();
          //   $('.refresh').show();
          //   $('.remark-news').show();
          // })
          fetchSongs(function(){
            setUpRecentlyListened();
          });
        } else {
          $($('h3')[0]).html('sign in')
          $($('.new_user')[0]).prepend('<h4 style="color:red">wrong username or password</h4>')
          $('#user_password').val('');
          $('#user_username').val('');
        }
      }
    )
  })

  $('body').on('click','#contributors-modal',function(){
    if ($('.not-fetched').length){
      $('.instructions-to-contribute').hide();
    }
    $.getJSON(
      '/users.json',
      function(response){
        $('.contributors-list').empty();
        $.each(response, function(i, user){
          $('.instructions-to-contribute').show();
          var styling = false;
          if (user['is_current_user'] == 1){
            styling = 'color: red;' 
          } else {
            styling = ''
          }
          $('.contributors-list').append('<div class="contributor-item" style="'+styling+'">'+user['username']+' ('+user['total']+' likes)</div>');
        })
      }
    )
  })

  $('.notifications').hover(function(){
    $('.notifications').attr('hovering', '1');
    setTimeout(function(){
      if ($('#logged_in').length){
        if ($('.notifications').attr('hovering').length){
          if ($('.notification-panel').length == 0){
            $('.notifications').append('<div class="notification-panel"><span class="not-header" style="margin-left: 80px;margin-top: 40px;">loading...</span></div>')
            $.getJSON(
              '/users.json',
              function(response){
                $('.not-header').html('activity on your songs');
                $('.notification-panel').append('<div class="notification-title">likes</div>')
                if (response[0].length){
                  $.each(response[0],function(i, like){
                    if (like['recent'] == '1'){
                      var panelClass = 'notification-content-holder recent'
                    } else {
                      var panelClass = 'notification-content-holder'
                    }
                    $('.notification-panel').append('<div class="'+panelClass+'"><span class="notification-content">someone liked your ' + like['song']+'</span></div>')
                    $($('.notification-content-holder')[$('.notification-content-holder').length - 1]).append('<div class="notification-timestamp">'+like['timestamp']+'</div>')
                  })
                } else {
                  $('.notification-panel').append('<div class="notification-content-holder"><span class="notification-content">no likes on your songs</span></div>')
                }
                $('.notification-panel').append('<div class="notification-title">listens</div>')
                if (response[1].length){
                  $.each(response[1],function(i, listen){
                    if (listen['recent'] == '1'){
                      var panelClass = 'notification-content-holder recent'
                    } else {
                      var panelClass = 'notification-content-holder'
                    }
                    $('.notification-panel').append('<div class="'+panelClass+'"><span class="notification-content">someone listened to ' + listen['song']+'</span></div>')
                    $($('.notification-content-holder')[$('.notification-content-holder').length - 1]).append('<div class="notification-timestamp">'+listen['timestamp']+'</div>')
                  })
                } else {
                  $('.notification-panel').append('<div class="notification-content-holder"><span class="notification-content">no listens on your songs</span></div>')
                }
              }
            )
          }
        }
      } else {
        if ($('.notifications').attr('hovering').length){
          if ($('.notification-panel').length == 0){
            $('.notifications').append('<div class="notification-panel"><span class="not-header" style="margin-left: 40px;margin-top: 40px;">need to login to see activity</span></div>')
          }
        }
      }
    }, 650)
  }, function(){
    $('.notifications').attr('hovering', '');
    setTimeout(function(){
      if ($('.notifications').attr('hovering').length == 0)
        $('.notification-panel').remove();
    }, 1600)
  })

  $('body').on('click','.up-next-change',function(){
    var songID = $('.up-next-song .song').attr('id');
    var upNext = false;
    if ($('.testing1').attr('upnext-clicks')){
      $('.testing1').attr('upnext-clicks', parseInt($('.testing1').attr('upnext-clicks')) + 1)
    } else {
      $('.testing1').attr('upnext-clicks', '1');
    }
    $.each(songs,function(i,song){
      if (song['id'] == songID){
        upNext = song;
      }
    })
    listenedAlready.push(upNext);
    upNext = chooseNextSong();
    setupNextSong(upNext);
  })
 
  SC.initialize({client_id:"8f1e619588b836d8f108bfe30977d6db"});

  // fetchRemarks(0, "")
  // setInterval(function(){
  //   if (onTab){
  //     idleSeconds += 1;
  //   }
  //   if ((idleSeconds  >= 20) && ($('.next-remark-btn').attr('data-remark-page'))){
  //     $('.refresh').html('refreshing..');
  //     var page = parseInt($('.next-remark-btn').attr('data-remark-page') - 1);
  //     var filter = $('.next-remark-btn').attr('data-remark-filter');
  //     fetchRemarks(page, filter, function(){
  //       $('.refresh').html('Refresh Remark Feed')
  //     })
  //   }
  // }, 4000)

  // window.onfocus = function(){
  //   onTab = true
  //   if (blurSeconds >= 15){
  //     $('.refresh').html('refreshing..');
  //     var page = parseInt($('.next-remark-btn').attr('data-remark-page') - 1);
  //     var filter = $('.next-remark-btn').attr('data-remark-filter');
  //     fetchRemarks(page, filter, function(){
  //       $('.refresh').html('Refresh Remark Feed')
  //     })
  //   }
  //   blurSeconds = 0;
  // }

  // window.onblur = function(){
  //   onTab = false

  // }

  // setInterval(function(){
  //   if (!(onTab)) {
  //     blurSeconds += 1;
  //   }
  // }, 4000)

  // periodically refresh song list
  // setInterval(function(){
  //   songIdle ++;
  //   if ((songIdle >= 20) && (!($('.nextbtn a').html() == 'exit search'))) {
  //     songIdle = 0;
  //     fetchSongs(function(){
  //       var onPage = 0;
  //       if ($('.nextbtn a').html() == 'unshuffle'){
  //         $('.small_header_index').trigger('click');
  //       } else {
  //         while(onPage < oldPage){
  //           $($('.nextbtn')[0]).trigger('click');
  //           onPage ++;
  //         }
  //       }
  //       setupTopSongs();
  //     })
  //   }
  // }, 40000);

  if ($('.player-holder').length) {
    if ($('#logged_in').length){
      fetchSongs(function(){
        if ($('#logged_in').length){
          $('.submit-button').show();
          $('.notifications').show();
        }
        $('.small_header_index').show();
        $('.next-song-btn').attr('class', 'next-song-btn');
        setupTopSongs();
        $('.radio-next-text').show();
        $('.next-song-btn').show();
        $('.page-wrapper').show();
        var pageheight = $(window).height() - 90
        var marginTop = ($(window).height() - 390) / 2
        $('.page-wrapper').css({height: pageheight})
        $('.left-side-wrapper').css({top: marginTop})
        $('.up-next-holder').css({top: marginTop+60})
        setUpRecentlyListened();
        $('.next-song-btn').trigger('click');
        // $('.next-song-btn').trigger('click');
      });
    } else {
      fetchSongs(function(){
        setupTopSongs();
        $('.radio-next-text').show();
        $('.next-song-btn').show();
        $('.page-wrapper').show();
        var pageheight = $(window).height() - 90
        var marginTop = ($(window).height() - 390) / 2
        $('.page-wrapper').css({height: pageheight})
        $('.left-side-wrapper').css({top: marginTop})
        $('.up-next-holder').css({top: marginTop+60})
        setUpRecentlyListened();
        $('.next-song-btn').trigger('click');
        // $('.next-song-btn').trigger('click');
      });
    }
    $('.other-songs-holder').hide();
  } else {
    fetchSongs(function(){
      $('.small_header_index').show();
      $('.next-song-btn').attr('class', 'next-song-btn');
      setupTopSongs();
      setUpRecentlyListened();
      $('.next-song-btn').show();
      $('.page-wrapper').show();
    });
  }
  $('.page-wrapper').hide();
  $('html').keydown(function(event) {
    if (event.keyCode == 39){
      $('.next-song-btn').trigger('click');
    }// else if (event.keyCode == 65) {
    //   if ((!($('#song-search').val().length))) {
    //     $('.small_header_index').trigger('click');
    //   }
    // } else if (event.keyCode == 83) {
    //   if ((!($('#song-search').val().length))) {
    //     $('.backbtn').trigger('click');
    //   }
    // } else if (event.keyCode == 68) {
    //   if ((!($('#song-search').val().length))) {
    //     $('.nextbtn').trigger('click');
    //   }
    // }
  })
  var holder = (($(window).width() / 2)+270)
  bigPictureTextMargin = 'margin-left:'+($(window).width() - 350) / 2+'px'
  nextSongMargin = 'margin-left:'+($(window).width() - 170) / 2+'px'
  leftWrapperMargin = 'margin-left:'+($(window).width() - 565) / 2+'px'
  roseayWordMargin = 'margin-left:'+($(window).width() - 205) / 2+'px'
  upNextLeftMargin = 'left:'+ (((($(window).width() - holder) / 2)-115)+holder)+'px'
  $('.big-picture-text').attr('style',bigPictureTextMargin);
  $('.next-song-btn').attr('style',nextSongMargin);
  $('.left-side-wrapper').attr('style',leftWrapperMargin);
  $('.roseay-word').attr('style',roseayWordMargin);
  $('.up-next-holder').attr('style',upNextLeftMargin);
  $('.submit-button').attr('style',upNextLeftMargin);

  $('.next-song-btn').hide();
  $('.notifications').hide();
  $('.submit-button').hide();
  $('.below-main').hide();
})