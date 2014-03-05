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

// $(function(){
//   console.log('app.js')
//   playerNumber = 0;
//   songs = [];
//   names = [];
//   page = 0;
//   libPage = 0;
//   playerCounter = 0;
//   edmScrollTop = 'k';
//   libraryScrollTop = 'k';

//   Array.prototype.remove = function(from, to) {
//     var rest = this.slice((to || from) + 1 || this.length);
//     this.length = from < 0 ? this.length + from : from;
//     return this.push.apply(this, rest);
//   };

//   var fetchSongs = function(callback){
//     $('.top-banner').prepend('<div class="loading-gif"></div>')

//     $.getJSON(
//       '/songs.json?fetch=1',
//       function(response){
//         var beingPlayed = false;
//         $.each(songs, function(i, song){
//           if (song['being-played']){
//             beingPlayed = song;
//           }
//         })

//         names = [];
//         songs = null;
//         oldPage = page;
//         $('.loading-gif').remove();

//         $.each(response['edm_songs'], function(i, datum){
//           if (datum['id'] == beingPlayed['id']){
//             datum['being-played'] = true;
//           }
//           names.push(datum['song_artist'].toLowerCase() + ' - ' +  datum['song_name'].toLowerCase())
//         })

//         songs = response['edm_songs'];
//         librarySongs = response['library_songs'];

//         if (callback){
//           callback();
//         }
//       }
//     )
//   }

//   var setupSongLine = function(song, i){
//     var link = song['song_link'].split('watch?v=')[1]
//     if (link == undefined){
//       var link = song['song_link'];
//     }
//     if (i == 0){
//       if (song['points'] == 1){
//         var likeWord = ' like'
//       } else {
//         var likeWord = ' likes'
//       }
//     } else {
//       var likeWord = ''
//     }
//     if (song['voted'] == 2){
//       var likeOrNo = '<div class="upvote" data-path="/songs/'+song['id']+'/upvote">like</div>'
//     } else {
//       var likeOrNo = '<div class="edm-add-to-lib" data-id='+song['id']+'>+</div>'
//     }
//     if (song['being-played']){
//       var beingPlayedOrNo = ' being-played'
//     } else {
//       var beingPlayedOrNo = ''
//     }
//     $('.song-list').append('<div class="song-line '+song['id']+beingPlayedOrNo+'"><div class="song" id="'+song['id']+'"><span id="song"><a href="/songs?d='+link+'">play</a></span></div><div class="song-id-text">'+song['song_name']+'<span class="song-artist-shade">'+song['song_artist']+'</span></div><div class="right-inline"><div class="like-count">'+song['points']+likeWord+'</div>'+likeOrNo+'<div class="song-line-author">'+song['author']+'</div></div></div>');
//   }

//   var setupLibrarySongLine = function(song, i){
//     var link = song['song_link'].split('watch?v=')[1]
//     if (link == undefined){
//       var link = song['song_link'];
//     }
    
//     if (song['being-played']){
//       var beingPlayedOrNo = ' being-played'
//     } else {
//       var beingPlayedOrNo = ''
//     }

//     $('.song-list').append('<div class="song-line '+song['id']+beingPlayedOrNo+'"><div class="song" id="'+song['id']+'"><span id="song"><a data-library=1 href="/songs?d='+link+'">play</a></span></div><div class="song-id-text">'+song['song_name']+'<span class="song-artist-shade">'+song['song_artist']+'</span></div><div class="right-inline"><a id="edit-lib-link" data-id="'+song['id']+'" href="#edit-library-song" data-toggle="modal">edit</a><div class="remove-warning" data-id="'+song['id']+'">remove</div></div></div>');
//   }

//   var changeIntoVoted = function(songId){
//     var chosenSong = false;
//     $.each(songs, function(i, song){
//       if (song['id'] == songId){
//         chosenSong = song
//       }
//     })
//     $('.below-main').empty();
//     $('.below-main').append('<div class="show-song-author">'+ (parseInt(chosenSong['points']) + 1) +' people like this song<br>contributed by '+chosenSong['author']+'</div>')
//     $('.below-main').append('<div class="vote-box"><br>liked</div>')
//     if (chosenSong['priority']){
//       $('.below-main').append('<div class="recently-added-tag">Recently Added</div>')
//     }
//   }

//   var bindScPlayerFinish = function(){
//     // var widgetIframe = $('iframe')[0],
//     //     widget       = SC.Widget(widgetIframe);
//     widget.bind(SC.Widget.Events.FINISH, function(player, data) {
//       if ($('.testing1').attr('song-repeat')){
//         widget.play();
//         widget.seekTo(0);
//         checkValidListen(playerNumber, $('.testing1').attr('currently-playing'));
//       } else {
//         if ($('.testing1').attr('current-playlist') == 'edm'){
//           playNextSong($('.testing1').attr('data-song-played'));
//         } else {
//           playNextLibrarySong($('.testing1').attr('data-song-played'));
//         }
//       }
//     });
//     playerCounter = setInterval(function(){
//       widget.getPosition(function(current){
//         widget.getDuration(function(duration){
//           var ratio = current / duration
//           $('.listened-bar').css({width:ratio*370});
//           $('.current-player-time').html(secondsToTime(Math.floor(current/1000)) + ' / ' + secondsToTime(Math.floor(duration/1000)))
//         })
//       })
//     }, 300)
//   }

//   var playNextSong = function(songzid){
//     var nextSong = songs[Math.floor(Math.random()*songs.length)]
//     playSongMechanics(nextSong['id'], nextSong['song_link'].split('watch?v=')[1]);
//   }

//   var playNextLibrarySong = function(prevId){
//     var nextSong = librarySongs[Math.floor(Math.random()*librarySongs.length)]
//     playSongMechanics(nextSong['id'], nextSong['song_link'].split('watch?v=')[1], 1);
//   }

//   var setupBelowMain = function(chosenSong){
//     if (chosenSong['points'] == 1){
//       var personOrPeople = 'person likes'
//     } else {
//       var personOrPeople = 'people like'
//     }
//     $('.below-main').empty();
//     $('.below-main').append('<div class="show-song-author">'+chosenSong['points']+' '+personOrPeople+' this song<br>contributed by '+chosenSong['author']+'</div>')
//     if (chosenSong['voted'] == 0){
//       $('.below-main').append('<div class="vote-box"><br>liked</div>')
//     } else {
//       $('.below-main').append('<div class="upvote" data-path="/songs/'+chosenSong['id']+'/upvote"><br>like</div>')
//     }
//     if (chosenSong['priority'] == 1){
//       $('.below-main').append('<div class="recently-added-tag">Recently Added</div>')
//     }
//   }

//   var youtubeApiCall = function(playerID){
//     $('.player-section').attr('style','')
//     if ($('.testing1').attr('data-ytapi-received')){
//       constructYTVideo(playerID);
//     } else {
//       $.getScript("https://www.youtube.com/iframe_api");
//       $('.testing1').attr('data-ytapi-received', 'yes')
//     }
//   }

//   var constructYTVideo = function(playerID){
//     if (playerID == playerNumber){
//       player = new YT.Player('ytplayer' + playerNumber, {
//         height: '320',
//         width: '600',
//         videoId: $('.testing1').attr('data-youtube-code'),
//         playerVars: {
//           //autoplay=1&controls=1&iv_load_policy=3&autohide=1&modestbranding=1
//           autoplay: 1,
//           controls: 1
//         },
//         events: {
//           'onReady': onPlayerReady,
//           'onStateChange': onPlayerStateChange,
//           'onError': onPlayerError
//         }
//       })
//     }
//   }

//   function onPlayerError(event){
//     createPlayerErrorTooltip();
//     var songPlayed = $('.testing1').attr('data-song-played');
//     if ($('.testing1').attr('current-playlist') == 'edm'){
//       playNextSong(songPlayed);
//     } else {
//       playNextLibrarySong(songPlayed);
//     }
//     $.post('/remarks.json?fix_song='+songPlayed);
//   }

//   function onPlayerStateChange(event) {
//     var myPlayerState;
//     myPlayerState = event.data;
//     if (myPlayerState == 0){
//       if ($('.testing1').attr('song-repeat')){
//         widget.seekTo(0);
//         checkValidListen(playerNumber, $('.testing1').attr('currently-playing'));
//       } else {
//         if ($('.testing1').attr('current-playlist') == 'edm'){
//           playNextSong($('.testing1').attr('data-song-played'));
//         } else {
//           playNextLibrarySong($('.testing1').attr('data-song-played'));
//         }
//       }
//     }
//   }

//   function onPlayerReady(event){
//     console.log(event.target)
//     widget = event.target;
//     event.target.playVideo();
//     playerCounter = setInterval(function(){
//       var current = widget.getCurrentTime(),
//           duration = widget.getDuration()
//       var ratio = current / duration
//       $('.listened-bar').css({width:ratio*370});
//       var currentTime = secondsToTime(Math.floor(widget.getCurrentTime())) + ' / ' + secondsToTime(widget.getDuration())
//       $('.current-player-time').html(currentTime);
//     }, 300)
//   }
//   // function secondsToTime(secs){
//   //   var hours = Math.floor(secs / (60 * 60));
   
//   //   var divisor_for_minutes = secs % (60 * 60);
//   //   var minutes = Math.floor(divisor_for_minutes / 60);
 
//   //   var divisor_for_seconds = divisor_for_minutes % 60;
//   //   var seconds = Math.ceil(divisor_for_seconds);
//   //   if ((''+seconds).length == 1){
//   //     seconds = '0'+seconds
//   //   }
//   //   var obj = {
//   //       "h": hours,
//   //       "m": minutes,
//   //       "s": seconds
//   //   };
//   //   return minutes+':'+seconds;
//   // }


//   var createThankTooltip = function(){
//     $('.left-half').prepend('<div style="top:42px;" class="radio-tooltip">Thanks for your contribution!</div>')
//     setTimeout(function(){
//       $('.radio-tooltip').remove();
//     }, 6000)
//   }

//   var createPlayerErrorTooltip = function(){
//     $('.left-half').prepend('<div style="top:42px;"class="radio-tooltip">We skipped a song because the video was broken</div>')
//     setTimeout(function(){
//       $('.radio-tooltip').remove();
//     }, 6000)
//   }

//   var createAddedToLibTooltip = function(song){
//     var songTitle = song['song_name'] + ' by ' + song['song_artist']
//     $('.left-half').prepend('<div class="radio-tooltip">Added \"'+songTitle+'\" to Library</div>')
//     setTimeout(function(){
//       $('.radio-tooltip').remove();
//     }, 5000)
//   }

//   var checkValidListen = function(uniqueId, songId){
//     var playlist = $('.testing1').attr('current-playlist');
//     if ($('#logged_in').length){
//       var userId = $('.logout').attr('href').split('sessions/')[1]
//     } else {
//       var userId = 0;
//     }
//     setTimeout(function(){
//       if ($('.testing1').attr('data-song-number') == uniqueId){
//         createListen(songId, userId, function(){
//           var song = false;
//           if (playlist == 'edm'){
//             $.each(songs,function(i,checkSong){
//               if (checkSong['id'] == songId){
//                 song = checkSong;
//               }
//             })
//           } else {
//             $.each(librarySongs,function(i,checkSong){
//               if (checkSong['id'] == songId){
//                 song = checkSong;
//               }
//             })
//           }
//           song['recently_listened'] = 0 - playerNumber
//         }, playlist);
//       }
//     }, 30000)
//   }

//   var createListen = function(songId, userId, callback, playlist){
//     var q = $('.testing1').attr('is-queue');
//     var b = $('.testing1').attr('is-blue');
//     var s = $('.testing1').attr('is-search');
//     var sh = $('.testing1').attr('is-shuffle');
//     var l = $('.testing1').attr('is-recent');
//     var upnext = $('.testing1').attr('upnext-clicks');
//     $('.testing1').attr('upnext-clicks','');

//     if (playlist == 'edm'){
//       $.post(
//         '/song_listens.json?q='+q+'&b='+b+'&s='+s+'&sh='+sh+'&l='+l+'&upnext='+upnext,
//         {'song_listen' : {
//           'user_id': userId,
//           'song_id': songId
//         }}, function(response){
//           if (callback){
//             callback();
//           }
//         }
//       )
//     } else {
//       $.post(
//         '/song_listens.json?lib_listen=1',
//         {'song_listen' : {
//           'user_id': userId,
//           'song_id': songId
//         }}, function(response){
//           if (callback){
//             callback();
//           }
//         }
//       )
//     }
//   }

//   $('.next-song-btn').click(function(ev){
//     $('.below-main').show();
//     if ($('.testing1').attr('current-playlist') == 'edm'){
//       playNextSong($('.testing1').attr('data-song-played'));
//     } else {
//       playNextLibrarySong($('.testing1').attr('data-song-played'));
//     }
//   })

//   $('body').on('click', '.song-modal-submit', function(ev){
//     ev.preventDefault();
//     var songArtist = $('#song_song_artist').val();
//     var songName   = $('#song_song_name').val();
//     var songLink   = $('#song_song_link').val();
//     $('#song_song_artist').val('uploading..');
//     $('#song_song_name').val('just wait..');
//     $('#song_song_link').val('a few seconds..');
//     $(this).hide();
//     $('#close-modal').hide();

//     $.post(
//       '/songs.json',
//       {'song' : {
//         'song_name' : songName,
//         'song_artist' : songArtist,
//         'song_link': songLink
//         }
//       }, function(response){
//         if (response['error']){
//           $('#newSongModal h4').append('<br>--not logged in OR bad song link OR reached limit--')
//         } else {
//           $('#close-modal').trigger('click');
//           fetchSongs(function(){
//             $('.edm-playlist-button').trigger('click');
//           });
//           createThankTooltip();
//         }
//         $('.song-modal-submit').show();
//         $('#close-modal').show();
//         $('#song_song_artist').val('');
//         $('#song_song_name').val('');
//         $('#song_song_link').val('');
//       }
//     )
//   })

//   $('body').on('click', '.upvote',function(ev){
//     ev.preventDefault();
//     ev.stopImmediatePropagation();

//     if ($('#logged_in').length){
//       var parent = this.parentNode;
//       var songID = parseInt($(parent).attr('id'));
//       if (!(songID)){
//         songID = $(this).attr('data-path').split('/')[2]
//       }
//       var index = parseInt($(this).attr('data_song_index'))

//       path = $(this).attr('data-path') + '.json'
//       $(this).remove();
//       changeIntoVoted(songID);

//       if ($('.left-side-wrapper .song#'+songID+' .upvote').length){
//         $('.left-side-wrapper .song#'+songID+ ' .upvote').remove();
//         $('.left-side-wrapper .song#'+songID).prepend('&nbsp;&nbsp;&nbsp;')
//         $('.upvote-player').empty()
//         $('.upvote-player').append('<div class="checkmark"></div>')
//         $('.upvote-player').append('<div class="upvote-text">voted</div>')
//       }
//       if (path == '/sessions/new.json'){
//         $('.need-to-login').css('top', ev.pageY - 8)
//         $('.need-to-login').css('left', ev.pageX - 60)
//       } else {
//         var votedSong = false;
//         $.each(songs,function(i,song){
//           if (song['id'] == songID){
//             votedSong = song;
//           }
//         })
//         votedSong['voted'] = 0;
//         votedSong['points'] ++;

//         $('.song-line.'+songID+' .like-count').html(votedSong['points']);
//         $('.song-line.'+songID+' .upvote').remove();
//         $('.song-line.'+songID+' .right-inline').append('<div class="edm-add-to-lib" data-id='+songID+'>+</div>');
//         $.post(path, function(response){

//           if (songs[parseInt($('.upvote-player .upvote').attr('data_song_index'))]){
//             if (songs[parseInt($('.upvote-player .upvote').attr('data_song_index'))]['id'] == songID){
//               $('.upvote-player').empty()
//               $('.upvote-player').append('<div class="checkmark"></div>')
//               $('.upvote-player').append('<div class="upvote-text">voted</div>')
//             }
//           }
//           if ($('.current-song .upvote').attr('href').split('/')[2] == songID){
//             $('.current-song .upvote').remove();
//           }
//         })
//       }
//     } else {
//       $('#login-modal').trigger('click');
//       $('#login-modal').attr('data-guest','1');
//     }
//   })

//   $('body').on('click','.edm-add-to-lib',function(){
//     if ($(this).attr('data-stop')){

//     } else {
//       var id = $(this).attr('data-id');
//       var addedSong = false;
//       $.each(songs,function(i, song){
//         if (song){
//           if (song['id'] == id){
//             addedSong = song;
//           }
//         }
//       })
//       librarySongs.unshift({
//         id: addedSong['id'],
//         song_name: addedSong['song_name'],
//         song_artist: addedSong['song_artist'],
//         song_link: addedSong['song_link']
//       })
//       var songName = addedSong['song_name'].replace(/&/g,'zxcvbn').replace(/#/g,'wphshtg');
//       var songArtist = addedSong['song_artist'].replace(/&/g,'zxcvbn').replace(/#/g,'wphshtg');
//       var songLink = addedSong['song_link'];

//       $.post('/remarks.json?new_lib=1&artist='+songArtist+'&name='+songName+'&link='+songLink);

//       createAddedToLibTooltip(addedSong);
//     }
//   })

//   $('body').on('click', '#song a', function(ev){
//     var clickedId = $(this).parent().parent().attr('id');
//     if (!(clickedId)){
//       clickedId = $(this).attr('data-songid');
//     }

//     ev.preventDefault();
//     ev.stopImmediatePropagation();
//     var libraryClick;
//     $(this).attr('data-library') ? libraryClick = 1 : libraryClick = undefined

//     playSongMechanics(clickedId, this['href'].split('songs?d=')[1], libraryClick);
//   })

//   var playSongMechanics = function(clickedId, link, libraryClick){
//     if ($('.being-played').length){
//       var prevId = $('.being-played').attr('class').split(' ')[1];
//       $('.being-played').attr('class', 'song-line ' + prevId);
//     }
//     $('.song-line.'+clickedId).attr('class', 'song-line '+clickedId+' being-played');
//     $('.song#'+clickedId).attr('style', '');
//     playerNumber ++;
//     if (libraryClick){
//       $('.testing1').attr('current-playlist','lib')
//     } else {
//       $('.testing1').attr('current-playlist','edm')
//     }
//     turnNewSongIntoBeingPlayed(clickedId);
//     $('.testing1').attr('data-song-number', playerNumber);
//     placeNewPlayer(clickedId, link);
//     checkValidListen(playerNumber, clickedId);
//     setupSongTimer(clickedId);
//   }

//   var placeNewPlayer = function(songId, link){
//     $('.testing1').attr('currently-playing',songId);
//     $('.testing1').attr('data-youtube-code', link) //+ '?autoplay=1&controls=1&iv_load_policy=3&autohide=1&modestbranding=1')
//     $('.testing1').attr('data-song-played', songId);
//     $('iframe').remove();

//     if (link == undefined){
//       $.each(songs, function(i, checkSong){
//         if (checkSong['id'] == songId){
//           link = checkSong['song_link'];
//         }
//       })
//     }
//     if (link.indexOf('soundcloud')+1){
//       $('.player-section').attr('style','height:171px;');
//       var currentPlayer = playerNumber;
//       SC.oEmbed(link,{auto_play:true, maxwidth:600, height:300, show_comments: true, color:'602220' }, function(track){
//         $('.player-section').attr('style','');
//         if (currentPlayer == playerNumber){
//           if (track){
//             $('.left-side-wrapper').css({top:0})
//             $('.testing1').attr('data-player-type','soundcloud');
//             track.html['height'] = 300
//             $('.left-side-wrapper').prepend(track.html);
//             var widgetIframe = $('iframe')[0]
//             widget = SC.Widget(widgetIframe);
//             bindScPlayerFinish();
//           } else {
//             createPlayerErrorTooltip();
//             var songPlayed = $('.testing1').attr('data-song-played');
//             if ($('.testing1').attr('current-playlist') == 'edm'){
//               playNextSong(songPlayed);
//             } else {
//               playNextLibrarySong(songPlayed);
//             }
//             $.post('/remarks.json?fix_song='+songPlayed);
//           }
//         }
//       })
//     } else {
//       $('.left-side-wrapper').css({top:0})
//       $('.testing1').attr('data-player-type','youtube');
//       $('.player-section').attr('style','height: 220px;')
//       $('.left-side-wrapper').prepend('<div id="ytplayer'+playerNumber+'"></div>')
//       youtubeApiCall(playerNumber);
//     }
//   }

//   var turnNewSongIntoBeingPlayed = function(clickedId){
//     var checkSongs;
//     if ($('.testing1').attr('current-playlist') == 'edm'){
//       checkSongs = songs;
//     } else {
//       checkSongs = librarySongs;
//     }
//     $.each(checkSongs, function(i, checkSong){
//       checkSong['being-played'] = false;
//       if (checkSong['id'] == clickedId){
//         checkSong['being-played'] = true;
//       }
//     })
//   }

//   var setupSongTimer = function(clickedId){
//     clearInterval(playerCounter);
//     $('.current-player-time').html('0:00 / 0:00')
//     $('.listened-bar').css({width:0})
//     var checkSongs;
//     if ($('.testing1').attr('current-playlist') == 'edm'){
//       checkSongs = songs;
//     } else { 
//       checkSongs = librarySongs;
//     }
//     $.each(checkSongs,function(i,song){
//       if (song['id'] == clickedId){
//         $('.right-arrow-info').html(song['song_name']+' by '+song['song_artist']);
//         var currentSongWidth = $('.right-arrow-info').width()
//         if (currentSongWidth < 370 ){
//           var currentSongLeft = (370 - currentSongWidth) / 2
//           $('.right-arrow-info').css({left:currentSongLeft});
//         }
//         document.title = (song['song_name']+' by '+song['song_artist']).replace(/&amp;/g, '&');
//         if ($('.testing1').attr('current-playlist') == 'edm'){
//           $('.below-main').show();
//           setupBelowMain(song);
//         } else {
//           $('.below-main').hide();
//         }
//       }
//     })
//   }

//   $('body').on('keyup','#song-search',function(){
//     if ($(this).val() == ''){
//       $('.edm-playlist-button').trigger('click');
//     }
//     var input = $(this).val();
//     if (input.length > 1){
//       $('.nextbtn a').html('exit search');
//       $('.backbtn').attr('class', 'backbtn inactive');

//       $('.song-list').empty();
//       matchedNames = [];
//       $.each(names, function(i, name){
//         if (name.indexOf(input) != -1) {
//           song = songs[names.indexOf(name)]
//           if (matchedNames.indexOf(song) == -1) {
//             matchedNames.push(song);
//           }
//         }
//       })
//       if (matchedNames.length){
//         $.each(matchedNames, function(i, song){
//           setupSongLine(song,i);
//         })
//       } else {
//         $('.song-list').html('');
//       }
//     }
//   })

//   $('body').on('click', '.join-session-modal', function(ev){
//     ev.preventDefault();
//     ev.stopImmediatePropagation();
//     var username = $('#create_username').val();
//     var password = $('#create_password').val();
//     var password_confirmation = $('#create_password_confirmation').val();
//     $($('h3')[1]).html('loading...')

//     $.post(
//       '/users.json',
//       {'user' : {
//         'username': username,
//         'password': password,
//         'password_confirmation': password_confirmation
//       }}, function(response){
//         if (!(response['error'])){
//           if ($('#login-modal').attr('data-guest')){
//             $.post('/remarks.json?convert_guest_like=1')
//           }
//           $('#login-modal').remove();
//           $('.submit-button').show();
//           $('.top-banner').prepend('<span id="logged_in"></span><a href="/sessions/'+response['id']+'" class="logout" data-method="delete" rel="nofollow">logout</a>');
//           $('#close-login-modal').trigger('click');
//           fetchSongs(function(){
//             if ($('.edm-playlist-button').attr('onclick')){
//               $('.edm-playlist-button').trigger('click');
//             } else {
//               $('.library-playlist-button').trigger('click');
//             }
//           });
//           $('#newSongModal h4').html('youtube/soundcloud links');
//         } else {
//           $($('h2')[1]).html('join')
//           $($('.new_user')[1]).prepend('<h4 style="color:red">something went wrong</h4>')
//           $('#create_password').val('');
//           $('#create_password_confirmation').val('');
//         }
//       }
//     )
//   })

//   $('body').on('click', '.login-session-modal', function(ev){
//     ev.preventDefault();
//     ev.stopImmediatePropagation();
//     var username = $('#user_username').val();
//     var password = $('#user_password').val();
//     $($('h3')[0]).html('loading...')

//     $.post(
//       '/sessions.json',
//       {'user' : {
//         'username' : username,
//         'password' : password
//       }}, function(response){
//         if (!(response['error'])){
//           $('#login-modal').remove();
//           $('.submit-button').show();
//           $('.top-banner').prepend('<span id="logged_in">'+response['username']+'</span><a href="/sessions/'+response['id']+'" class="logout" data-method="delete" rel="nofollow" style="margin-left:50px;">logout</a>')
//           $('#newSongModal h4').html('youtube/soundcloud links');
//           $('#close-login-modal').trigger('click')
//           fetchSongs(function(){
//             if ($('.edm-playlist-button').attr('onclick')){
//               $('.edm-playlist-button').trigger('click');
//             } else {
//               $('.library-playlist-button').trigger('click');
//             }
//           });
//         } else {
//           $($('h3')[0]).html('sign in')
//           $($('.new_user')[0]).prepend('<h4 style="color:red">wrong username or password</h4>')
//           $('#user_password').val('');
//           $('#user_username').val('');
//         }
//       }
//     )
//   })

//   $('body').on('click','#contributors-modal',function(){
//     if ($('.not-fetched').length){
//       $('.instructions-to-contribute').hide();
//     }
//     $.getJSON(
//       '/users.json',
//       function(response){
//         $('.contributors-list').empty();
//         $.each(response, function(i, user){
//           $('.instructions-to-contribute').show();
//           var styling = false;
//           if (user['is_current_user'] == 1){
//             styling = 'color: red;' 
//           } else {
//             styling = ''
//           }
//           $('.contributors-list').append('<div class="contributor-item" style="'+styling+'">'+user['username']+' ('+user['total']+' likes)</div>');
//         })
//       }
//     )
//   })

//   $('body').on('click','.edm-playlist-button',function(){
//     if ($('.library-playlist-button').attr('onclick')){
//       libraryScrollTop = $(document).scrollTop();
//     } else {
//       edmScrollTop = $(document).scrollTop();
//     }
//     $(this).css({width:157,right:-7})
//     $('.library-playlist-button').css({width:150,right:0})
//     $('.library-playlist-button').attr('onclick','');
//     $('.edm-playlist-button').attr('onclick','1');
//     $('.right-half').empty();
//     $('.right-half').append('<div class="edm-banner"><input id="song-search" placeholder="search playlist"></input><div class="edm-description">EDM music. Sorted by time. Contribute recent songs only.</div><a href="#newsong" class="submit-button" data-toggle="modal">contribute song</a><a id="contributors-modal" href="#contributors" data-toggle="modal">contributors</a></div><div class="song-list"></div>')
//     var firstPageSongs = songs.slice(0,(50*page+50));
//     $.each(firstPageSongs, function(i, song){
//       setupSongLine(song,i);
//     })
//     if (!(edmScrollTop == 'k')){
//       if (edmScrollTop < 400){
//         $(document).scrollTop(400)
//       } else {
//         $(document).scrollTop(edmScrollTop)
//       }
//     }
//   })

//   $('body').on('click','.library-playlist-button',function(){
//     var notLogged = false;
//     if ($('.edm-playlist-button').attr('onclick')){
//       edmScrollTop = $(document).scrollTop();
//     } else {
//       libraryScrollTop = $(document).scrollTop();
//     }
//     $(this).css({width:157,right:-7})
//     $('.edm-playlist-button').css({width:150,right:0})
//     $('.library-playlist-button').attr('onclick','1');
//     $('.edm-playlist-button').attr('onclick','');
//     $('.right-half').empty();
//     if ($('#logged_in').length){
//       notLogged = '';
//     } else {
//       notLogged = '<div class="not-logged-library">You don\'t have a library yet, so we added a song we really like for you. Don\'t feel left out. Try out adding a song to the library! Log in to start your own.</div>'
//     }
//     $('.right-half').append('<div class="edm-banner"><input id="new-lib-song-artist" placeholder="artist"></input><input id="new-lib-song-name" placeholder="song name"></input><input id="new-lib-song-link" placeholder="youtube/soundcloud link"></input><div class="submit-lib-song"><div class="submit-lib-song-word">Add to Library</div></div><div class="library-description">Songs you <span class="edm-add-to-lib" data-stop=1>+</span>\'d or manually added. Any genre. Song or set.</div></div><div class="song-list"></div>'+notLogged);
//     var firstPageSongs = librarySongs.slice(0,(50*libPage+50));
//     if (librarySongs.length){
//       $.each(firstPageSongs, function(i, song){
//         setupLibrarySongLine(song,i);
//       })
//     } else {
//       $('.right-half').append('<div class="not-logged-library">Library is empty</div>')
//     }
//     if (!(libraryScrollTop == 'k')){
//       if (libraryScrollTop < 400){
//         $(document).scrollTop(400)
//       } else {
//         $(document).scrollTop(libraryScrollTop)
//       }
//     } else {
//       $(document).scrollTop(400)
//     }
//   })

//   $('body').on('click','.submit-lib-song',function(){
//     $('.not-logged-library').remove();
//     var songArtist = $('#new-lib-song-artist').val()
//     var songName   = $('#new-lib-song-name').val()
//     var songLink   = $('#new-lib-song-link').val().split('&')[0]
//     var id = '';
//     if (librarySongs.length){
//       id = librarySongs[0]['id'] + 1
//     } else {
//       id = 1;
//     }
//     $('#song_song_artist').val('');
//     $('#song_song_name').val('');
//     $('#song_song_link').val('');
//     librarySongs.unshift({
//       id: id,
//       song_name: songName,
//       song_artist: songArtist,
//       song_link: songLink
//     })
//     $('.library-playlist-button').trigger('click');
//     if ($('#logged_in').length){
//       $.post('/remarks.json?new_lib=1&artist='+(songArtist.replace(/&/g,'zxcvbn').replace(/#/g,'wphshtg'))+'&name='+(songName.replace(/&/g,'zxcvbn').replace(/#/g,'wphshtg'))+'&link='+songLink);
//     }
//   })

//   $('body').on('click','.play-pause-button',function(){
//     if ($('.testing1').attr('data-player-type') == 'youtube'){
//       var playerState = widget.getPlayerState();
//       if (playerState == 1){
//         widget.pauseVideo();
//       } else if (playerState == 2){
//         widget.playVideo();
//       }
//     } else {
//       widget.toggle();
//     }
//   })

//   $('.top-banner').hover(function(){
//     $('.top-banner').css({opacity:1})
//     $('.top-banner').attr('data-hovered','1');
//   }, function(){
//     if ($(window).scrollTop() > 400){
//       $('.top-banner').css({opacity:0.1})
//     }
//     $('.top-banner').attr('data-hovered','');
//   })
 
//   $('body').on('click','.loading-bar',function(ev){
//     var ratio = ev.pageX / 370
//     if ($('.testing1').attr('data-player-type') == 'youtube'){
//       widget.seekTo(widget.getDuration()*ratio);
//     } else if ($('.testing1').attr('data-player-type') == 'soundcloud'){
//       widget.getDuration(function(duration){
//         widget.seekTo((duration*ratio)*1000);
//       })
//     }
//   })

//   $('.loading-bar').mousemove(function(ev){
//     $('.skip-to').remove();
//     var ratio = ev.pageX / 370;
//     var seek;
//     var x = ev.pageX;
//     var y = ev.pageY;
//     if ((x - 40) < 0){
//       x = 40;
//     }
//     if ($('.testing1').attr('data-player-type') == 'youtube'){
//       seek = widget.getDuration()*ratio
//       $('body').append('<div class="skip-to">skip to '+secondsToTime(seek)+'</div>');
//       $('.skip-to').css({top:y - 50, left:x - 40})
//     } else {
//       widget.getDuration(function(duration){
//         seek = (duration*ratio)/1000
//         secondsToTime(seek);
//         $('body').append('<div class="skip-to">skip to '+secondsToTime(seek)+'</div>');
//         $('.skip-to').css({top:y - 50, left:x - 40})
//       })
//     }
//   })

//   $('.loading-bar').hover(function(){},function(){
//     $('.skip-to').remove();
//   })

//   $('body').on('click','.remove-warning',function(){
//     var id = $(this).attr('data-id')
//     $(this).remove()
//     $('.song-line.'+id+' .right-inline').prepend('<div class="remove-real" data-id="'+id+'">sure?</div>');
//   })

//   $('body').on('click','.remove-real',function(){
//     var id = $(this).attr('data-id')
//     $('.song-line.'+id+' .song').remove();
//     $('.song-line.'+id+' .song-id-text').remove();
//     $(this).remove();
//     $('.song-line.'+id).attr('style','height:0px;border-bottom: solid black 0px;');
//     $.each(librarySongs,function(i, song){
//       if (song){
//         if (song['id'] == id){
//           librarySongs.remove(i);
//         }
//       }
//     })
//     $.post('/remarks.json?delete_lib=1&lib_id='+id);
//   })

//   $('body').on('click','#edit-lib-link',function(){
//     var id = $(this).attr('data-id');
//     var editingSong = false;
//     $.each(librarySongs,function(i, song){
//       if (song){
//         if (song['id'] == id){
//           editingSong = song;
//         }
//       }
//     })
//     $('#edit-lib-song-artist').val(editingSong['song_artist'])
//     $('#edit-lib-song-name').val(editingSong['song_name'])
//     $('#edit-lib-song-link').val(editingSong['song_link'])
//     $('.edit-lib-submit').attr('data-id',id)
//   })

//   $('body').on('click','.edit-lib-submit',function(){
//     var id = $(this).attr('data-id')
//     var artist = $('#edit-lib-song-artist').val();
//     var name = $('#edit-lib-song-name').val();
//     var link = $('#edit-lib-song-link').val()

//     $.each(librarySongs,function(i, song){
//       if (song){
//         if (song['id'] == id){
//           song['song_artist'] = artist
//           song['song_name'] = name
//           song['song_link'] = link
//         }
//       }
//     })
//     $('#edit-lib-song-artist').val('')
//     $('#edit-lib-song-name').val('')
//     $('#edit-lib-song-link').val('')
//     $('.library-playlist-button').trigger('click');
//     $('.modal-backdrop').trigger('click');

//     $.post('/remarks.json?edit_lib=1&name='+name.replace(/&/g,'zxcvbn').replace(/#/g,'wphshtg')+'&artist='+artist.replace(/&/g,'zxcvbn').replace(/#/g,'wphshtg')+'&link='+link+'&lib_id='+id)
//   })

//   $('body').on('click','.repeat-button',function(){
//     if ($('.testing1').attr('song-repeat')){
//       $('.testing1').attr('song-repeat','');
//       $('.repeat-button .repeat-text').html('repeat is off');
//     } else {
//       $('.testing1').attr('song-repeat','1');
//       $('.repeat-button .repeat-text').html('repeat is on');
//     }
//   })

//   SC.initialize({client_id:"8f1e619588b836d8f108bfe30977d6db"});


//   fetchSongs(function(){
//     if ($('#logged_in').length){
//       $('.submit-button').show();
//     }
//     var pageheight = $(window).height() - 90
//     $('.page-wrapper').css({height: pageheight})
//     $('.edm-playlist-button').trigger('click');
//     $('.next-song-btn').trigger('click');
//     rightHalfWidth = 'width:'+($(window).width() - 370)+'px'
//     rightHalfHeight = 'min-height:'+($(window).height() - 60)+'px'
//     $('.right-half').attr('style',rightHalfWidth+';'+rightHalfHeight);
//   });

//   var holder = (($(window).width() / 2)+270)
//   bigPictureTextMargin = 'margin-left:'+($(window).width() - 350) / 2+'px'
//   nextSongMargin = 'margin-left:'+($(window).width() + 50) / 2+'px'
//   leftWrapperMargin = 'margin-left:'+($(window).width() - 620) / 2+'px'
//   roseayWordMargin = 'margin-left:'+($(window).width() - 205) / 2+'px'
//   upNextLeftMargin = 'left:'+ (((($(window).width() - holder) / 2)-115)+holder)+'px'
//   leftHalfHeight = 'height:'+($(window).height() - 78)+'px'
//   $('.big-picture-text').attr('style',bigPictureTextMargin);
//   $('.left-side-wrapper').attr('style',leftWrapperMargin);
//   $('.up-next-holder').attr('style',upNextLeftMargin);
//   $('.left-half').attr('style',leftHalfHeight);

//   $('.below-main').hide();
//   $('.top-banner').css({opacity:1});
// })