(function(){var requirejs,require,define,__inflate;(function(e){function a(e,t){var n=t&&t.split("/"),i=r.map,s=i&&i["*"]||{},o,u,a,f,l,c,h;if(e&&e.charAt(0)==="."&&t){n=n.slice(0,n.length-1),e=n.concat(e.split("/"));for(l=0;h=e[l];l++)if(h===".")e.splice(l,1),l-=1;else if(h===".."){if(l===1&&(e[2]===".."||e[0]===".."))return!0;l>0&&(e.splice(l-1,2),l-=2)}e=e.join("/")}if((n||s)&&i){o=e.split("/");for(l=o.length;l>0;l-=1){u=o.slice(0,l).join("/");if(n)for(c=n.length;c>0;c-=1){a=i[n.slice(0,c).join("/")];if(a){a=a[u];if(a){f=a;break}}}f=f||s[u];if(f){o.splice(0,l,f),e=o.join("/");break}}}return e}function f(t,n){return function(){return u.apply(e,s.call(arguments,0).concat([t,n]))}}function l(e){return function(t){return a(t,e)}}function c(e){return function(n){t[e]=n}}function h(r){if(n.hasOwnProperty(r)){var s=n[r];delete n[r],i[r]=!0,o.apply(e,s)}if(!t.hasOwnProperty(r))throw new Error("No "+r);return t[r]}function p(e,t){var n,r,i=e.indexOf("!");return i!==-1?(n=a(e.slice(0,i),t),e=e.slice(i+1),r=h(n),r&&r.normalize?e=r.normalize(e,l(t)):e=a(e,t)):e=a(e,t),{f:n?n+"!"+e:e,n:e,p:r}}function d(e){return function(){return r&&r.config&&r.config[e]||{}}}var t={},n={},r={},i={},s=[].slice,o,u;o=function(r,s,o,u){var a=[],l,v,m,g,y,b;u=u||r,typeof o=="string"&&(o=__inflate(r,o));if(typeof o=="function"){s=!s.length&&o.length?["require","exports","module"]:s;for(b=0;b<s.length;b++){y=p(s[b],u),m=y.f;if(m==="require")a[b]=f(r);else if(m==="exports")a[b]=t[r]={},l=!0;else if(m==="module")v=a[b]={id:r,uri:"",exports:t[r],config:d(r)};else if(t.hasOwnProperty(m)||n.hasOwnProperty(m))a[b]=h(m);else if(y.p)y.p.load(y.n,f(u,!0),c(m),{}),a[b]=t[m];else if(!i[m])throw new Error(r+" missing "+m)}g=o.apply(t[r],a);if(r)if(v&&v.exports!==e&&v.exports!==t[r])t[r]=v.exports;else if(g!==e||!l)t[r]=g}else r&&(t[r]=o)},requirejs=require=u=function(t,n,i,s){return typeof t=="string"?h(p(t,n).f):(t.splice||(r=t,n.splice?(t=n,n=i,i=null):t=e),n=n||function(){},s?o(e,t,n,i):setTimeout(function(){o(e,t,n,i)},15),u)},u.config=function(e){return r=e,u},define=function(e,t,r){t.splice||(r=t,t=[]),n[e]=[e,t,r]},define.amd={jQuery:!0}})(),__inflate=function(name,src){var r;return eval(["r = function(a,b,c){","\n};\n//@ sourceURL="+name+"\n"].join(src)),r},define("lib/api/events",["require","exports","module"],function(e,t,n){t.api={LOAD_PROGRESS:"loadProgres",PLAY_PROGRESS:"playProgress",PLAY:"play",PAUSE:"pause",FINISH:"finish",SEEK:"seek",READY:"ready",OPEN_SHARE_PANEL:"sharePanelOpened",SHARE:"share",CLICK_DOWNLOAD:"downloadClicked",CLICK_BUY:"buyClicked"},t.bridge={REMOVE_LISTENER:"removeEventListener",ADD_LISTENER:"addEventListener"}}),define("lib/api/getters",["require","exports","module"],function(e,t,n){n.exports={GET_VOLUME:"getVolume",GET_DURATION:"getDuration",GET_POSITION:"getPosition",GET_SOUNDS:"getSounds",GET_CURRENT_SOUND:"getCurrentSound",GET_CURRENT_SOUND_INDEX:"getCurrentSoundIndex",IS_PAUSED:"isPaused"}}),define("lib/api/setters",["require","exports","module"],function(e,t,n){n.exports={PLAY:"play",PAUSE:"pause",TOGGLE:"toggle",SEEK_TO:"seekTo",SET_VOLUME:"setVolume",NEXT:"next",PREV:"prev",SKIP:"skip"}}),define("lib/api/api",["require","exports","module","lib/api/events","lib/api/getters","lib/api/setters"],function(e,t,n){function m(e){return!!(e===""||e&&e.charCodeAt&&e.substr)}function g(e){return!!(e&&e.constructor&&e.call&&e.apply)}function y(e){return!!e&&e.nodeType===1&&e.nodeName.toUpperCase()==="IFRAME"}function b(e){var t=!1,n;for(n in i)if(i.hasOwnProperty(n)&&i[n]===e){t=!0;break}return t}function w(e){var t,n,r;for(t=0,n=f.length;t<n;t++){r=e(f[t]);if(r===!1)break}}function E(e){var t="",n,r,i;e.substr(0,2)==="//"&&(e=window.location.protocol+e),i=e.split("/");for(n=0,r=i.length;n<r;n++){if(!(n<3))break;t+=i[n],n<2&&(t+="/")}return t}function S(e){return e.contentWindow?e.contentWindow:e.contentDocument&&"parentWindow"in e.contentDocument?e.contentDocument.parentWindow:null}function x(e){var t=[],n;for(n in e)e.hasOwnProperty(n)&&t.push(e[n]);return t}function T(e,t,n){n.callbacks[e]=n.callbacks[e]||[],n.callbacks[e].push(t)}function N(e,t){var n=!0,r;return t.callbacks[e]=[],w(function(t){r=t.callbacks[e]||[];if(r.length)return n=!1,!1}),n}function C(e,t,n){var r=S(n),i,s;if(!r.postMessage)return!1;i=n.getAttribute("src").split("?")[0],s=JSON.stringify({method:e,value:t}),i.substr(0,2)==="//"&&(i=window.location.protocol+i),i=i.replace(/http:\/\/(w|wt).soundcloud.com/,"https://$1.soundcloud.com"),r.postMessage(s,i)}function k(e){var t;return w(function(n){if(n.instance===e)return t=n,!1}),t}function L(e){var t;return w(function(n){if(S(n.element)===e)return t=n,!1}),t}function A(e,t){return function(n){var r=g(n),i=k(this),s=!r&&t?n:null,o=r&&!t?n:null;return o&&T(e,o,i),C(e,s,i.element),this}}function O(e,t,n){var r,i,s;for(r=0,i=t.length;r<i;r++)s=t[r],e[s]=A(s,n)}function M(e,t,n){return e+"?url="+t+"&"+_(n)}function _(e){var t,n,r=[];for(t in e)e.hasOwnProperty(t)&&(n=e[t],r.push(t+"="+(t==="start_track"?parseInt(n,10):n?"true":"false")));return r.join("&")}function D(e,t,n){var r=e.callbacks[t]||[],i,s;for(i=0,s=r.length;i<s;i++)r[i].apply(e.instance,n);if(b(t)||t===o.READY)e.callbacks[t]=[]}function P(e){var t,n,r,i,s;try{n=JSON.parse(e.data)}catch(u){}t=L(e.source),r=n.method,i=n.value,r===o.READY&&(t?(t.isReady=!0,D(t,l),N(l,t)):a.push(e.source)),r===o.PLAY&&!t.playEventFired&&(t.playEventFired=!0),r===o.PLAY_PROGRESS&&!t.playEventFired&&(t.playEventFired=!0,D(t,o.PLAY,[i]));if(!t||H(e.origin)!==H(t.domain))return!1;s=[],i!==undefined&&s.push(i),D(t,r,s)}function H(e){return e.replace(h,"")}var r=e("lib/api/events"),i=e("lib/api/getters"),s=e("lib/api/setters"),o=r.api,u=r.bridge,a=[],f=[],l="__LATE_BINDING__",c="http://wt.soundcloud.dev:9200/",h=/^http(?:s?)/,p,d,v;window.addEventListener?window.addEventListener("message",P,!1):window.attachEvent("onmessage",P),n.exports=v=function(e,t,n){m(e)&&(e=document.getElementById(e));if(!y(e))throw new Error("SC.Widget function should be given either iframe element or a string specifying id attribute of iframe element.");t&&(n=n||{},e.src=M(c,t,n));var r=L(S(e)),i,s;return r&&r.instance?r.instance:(i=a.indexOf(S(e))>-1,s=new p(e),f.push(new d(s,e,i)),s)},v.Events=o,window.SC=window.SC||{},window.SC.Widget=v,d=function(e,t,n){this.instance=e,this.element=t,this.domain=E(t.getAttribute("src")),this.isReady=!!n,this.callbacks={}},p=function(){},p.prototype={constructor:p,load:function(e,t){if(!e)return;t=t||{};var n=this,r=k(this),i=r.element,s=i.src,a=s.substr(0,s.indexOf("?"));r.isReady=!1,r.playEventFired=!1,i.onload=function(){n.bind(o.READY,function(){var e,n=r.callbacks;for(e in n)n.hasOwnProperty(e)&&e!==o.READY&&C(u.ADD_LISTENER,e,r.element);t.callback&&t.callback()})},i.src=M(a,e,t)},bind:function(e,t){var n=this,r=k(this);return r&&r.element&&(e===o.READY&&r.isReady?setTimeout(t,1):r.isReady?(T(e,t,r),C(u.ADD_LISTENER,e,r.element)):T(l,function(){n.bind(e,t)},r)),this},unbind:function(e){var t=k(this),n;t&&t.element&&(n=N(e,t),e!==o.READY&&n&&C(u.REMOVE_LISTENER,e,t.element))}},O(p.prototype,x(i)),O(p.prototype,x(s),!0)}),window.SC=window.SC||{},window.SC.Widget=require("lib/api/api")})();

function secondsToTime(secs){
  var hours = Math.floor(secs / (60 * 60));
 
  var divisor_for_minutes = secs % (60 * 60);
  var minutes = Math.floor(divisor_for_minutes / 60);

  var divisor_for_seconds = divisor_for_minutes % 60;
  var seconds = Math.ceil(divisor_for_seconds);
  if ((''+seconds).length == 1){
    seconds = '0'+seconds
  }
  var obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
  };
  return minutes+':'+seconds;
}

function SongController(){
  var that = this;
  this.listeners = 'off';
  this.page = 0;
  this.libPage = 0;
  this.playerCounter = 0;
  this.edmScrollTop = 'k';
  this.libraryScrollTop = 'k';
  this.userSongs;
  this.dataSongNumer;
  this.onPlaylist;
  this.stopTitle = 0;

  this.beginExperience = function(){
		this.userSongs = new AllSongs();
		this.userView = new SongView($('body'));
		this.player = new SongPlayer(this.playNextSong.bind(this));

		this.userSongs.fetchSongs(function(){
			if (that.listeners == 'off'){
				setTimeout(function(){
					$('.edm-playlist-button').trigger('click')
					that.playNextSong();
		    	that.userView.scaleElements();
				}, 500)
			} else {
				$('.edm-playlist-button').trigger('click')
				that.playNextSong();
	    	that.userView.scaleElements();
			}
		})
  }

  this.play = function(clickedId, link, libraryClick){
    this.userView.switchBeingPlayed(clickedId);
    this.player.playerNumber ++;
    this.changePlaylist(libraryClick);
    this.userSongs.setBeingPlayed(clickedId, libraryClick);
    this.player.play(clickedId, link);
    this.checkValidListen(this.player.playerNumber, clickedId);
    this.userView.setupSongTimer(this.userSongs.getSong(clickedId, libraryClick), libraryClick);
  }

  this.changePlaylist = function(playlist){
  	this.player.changePlaylist(playlist);
  	this.userSongs.changePlaylist(playlist);
  }

  this.playNextSong = function(){
  	var nextSong = this.userSongs.getRandom();
  	var libraryClick = this.player.currentPlaylist == 'lib'
    this.play(nextSong['id'], this.userSongs.filterLink(nextSong['song_link'], nextSong['id']), libraryClick);
  }

  this.getCurrentScroll = function(){
    if (this.currentTab == 'lib'){
      this.libraryScrollTop = $(document).scrollTop();
    } else {
      this.edmScrollTop = $(document).scrollTop();
    }
  }

  this.tabHandler = function(playlist){
    // this.getCurrentScroll();
    this.currentTab = playlist;

    if (playlist == 'edm'){
      var songs = that.userSongs.getPaged(this.page, this.currentTab, true)
      this.userView.switchToEdmTab(this.edmScrollTop, songs);
    } else {
      var songs = this.userSongs.getPaged(this.libPage, this.currentTab, true)
      this.userView.switchtoLibTab(this.libraryScrollTop, songs);
    }
  }

  this.checkValidListen = function(uniqueId, songId){
    var playlist = this.player.currentPlaylist;
    if ($('#logged_in').length){
      var userId = $('.logout').attr('href').split('sessions/')[1]
    } else {
      var userId = 0;
    }
    setTimeout(function(){
      if (that.player.playerNumber == uniqueId){
        that.createListen(songId, userId, playlist);
      }
    }, 30000)
  }

  this.createListen = function(songId, userId, playlist){
    if (playlist == 'edm'){
      $.post(
        '/song_listens.json',
        {'song_listen' : {
          'user_id': userId,
          'song_id': songId
        }})
    } else {
      $.post(
        '/song_listens.json?lib_listen=1',
        {'song_listen' : {
          'user_id': userId,
          'song_id': songId
        }}
      )
    }
  }

  this.goToNextPage = function(){
  	if (this.currentTab == 'edm'){
  		this.page ++;
  		var nextPageSongs = this.userSongs.getPaged(this.page, 'edm');
  		this.userView.appendSongs(nextPageSongs, 'edm')
  	} else {
  		if (this.userSongs.librarySongs.length > (this.libPage+1) * 50){
	  		this.libPage ++;
	  		var nextPageSongs = this.userSongs.getPaged(this.libPage, 'lib');
	  		this.userView.appendSongs(nextPageSongs, 'lib')
	  	}
  	}
  }

  this.stopTitleTimer = function(){
  	that.stopTitle = 1;
  	setTimeout(function(){
  		that.stopTitle = 0;
  	}, 500)
  }

  this.listenersActivate = function(){
  	this.listeners = 'on';
  	$('body').on('click', '.next-song-btn', function(ev){
  		if (that.player.songRepeat){
  			that.player.repeat();
  		} else {
			  $('.below-main').show();
			  that.playNextSong();
			}
		})

	  $('body').on('click', '.song-modal-submit', function(ev){
	    ev.preventDefault();
	    $(this).hide();
	    var song = that.userView.getSongSubmitInfo();
	    $.post(
	      '/songs.json',
	      {'song' : {
	        'song_name' : song['name'],
	        'song_artist' : song['artist'],
	        'song_link': song['link']
	        }
	      }, function(response){
	        if (response['error']){
	          $('#newSongModal h4').append('<br>--not logged in OR bad song link OR reached limit--')
	        } else {
	          that.userSongs.fetchSongs(function(){
	            $('.edm-playlist-button').trigger('click');
	          });
	          that.userView.createThankTooltip();
	        }
	        that.userView.closeSongSubmitModal();
	      }
	    )
	  })

	  $('body').on('click', '.upvote',function(ev){
	    ev.preventDefault();
	    ev.stopImmediatePropagation();

	    if ($('#logged_in').length){
	      var path = $(this).attr('data-path') + '.json'
	      var songID = that.userView.getSongIdFromUpvote(this);
	      var song = that.userSongs.getSong(songID, false);
	      that.userSongs.upvote(songID);
	      that.userView.changeIntoVoted(songID, this, song);
	      $(this).remove();
	      $.post(path, function(response){})
	    } else {
	      $('#login-modal').trigger('click');
	    }
	  })

	  $('body').on('click','.edm-add-to-lib',function(){
	    var id = $(this).attr('data-id');
	    var addedSong = that.userSongs.getSong(id, false);
	    that.userSongs.addToLib(addedSong)
	    var songName = addedSong['song_name'].replace(/&/g,'zxcvbn').replace(/#/g,'wphshtg');
	    var songArtist = addedSong['song_artist'].replace(/&/g,'zxcvbn').replace(/#/g,'wphshtg');
	    var songLink = addedSong['song_link'];

	    $.post('/remarks.json?new_lib=1&artist='+songArtist+'&name='+songName+'&link='+songLink);
	    that.userView.createAddedToLibTooltip(addedSong);
	  })

	  $('body').on('click', '#song a', function(ev){
	    ev.preventDefault();
	    ev.stopImmediatePropagation();

	    var clickedId = that.userView.getsongIdFromSong(this);
	    var libraryClick = that.currentTab == 'lib';
	    that.play(clickedId, this['href'].split('songs?d=')[1], libraryClick);
	  })

	  $('body').on('keyup','#song-search',function(){
	    var input = that.userView.getSearchInput(this);
	    if (input.length > 1){
	      that.userView.emptySongList();
	      var matchedSongs = that.userSongs.findMatched(input);
	      that.userView.appendSongs(matchedSongs, 'edm')
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
	          that.userView.successfulLogin(response['id']);
	          fetchSongs(function(){
	            that.currentTab == 'edm' ? $('.edm-playlist-button').trigger('click') : $('.library-playlist-button').trigger('click')
	          });
	        } else {
	          that.userView.failedLogin('join');
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
	          that.userView.successfulLogin(response['id']);
	          that.userSongs.fetchSongs(function(){
	            that.currentTab == 'edm' ? $('.edm-playlist-button').trigger('click') : $('.library-playlist-button').trigger('click')
	          });
	        } else {
	          that.userView.failedLogin('login')
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

	  $('body').on('click','.edm-playlist-button',function(){
	    that.tabHandler('edm')
	  })

	  $('body').on('click','.library-playlist-button',function(){
	    that.tabHandler('lib');
	  })

	  $('body').on('click','.submit-lib-song',function(){
	    var id = that.userSongs.getNextLibId();
	    var addedSong = that.userView.getLibSubmitInfo(id);
	    if (addedSong['song_link'].length > 0){
		    that.userSongs.addToLib(addedSong);
		    $('.library-playlist-button').trigger('click');
		    if ($('#logged_in').length){
		      $.post('/remarks.json?new_lib=1&artist='+(addedSong['song_artist'].replace(/&/g,'zxcvbn').replace(/#/g,'wphshtg'))+'&name='+(addedSong['song_name'].replace(/&/g,'zxcvbn').replace(/#/g,'wphshtg'))+'&link='+addedSong['song_link']);
		    }
	    }
	  })

	  $('body').on('click','.play-pause-button',function(){
	    that.player.togglePlayPause();
	  })

	  $('.top-banner').hover(function(){
	    $('.top-banner').css({opacity:1})
	    $('.top-banner').attr('data-hovered','1');
	  }, function(){
	    if ($(window).scrollTop() > 400){
	      $('.top-banner').css({opacity:0.1})
	    }
	    $('.top-banner').attr('data-hovered','');
	  })
	 
	  $('body').on('click','.loading-bar',function(ev){
	    that.player.skipPlayerTo(ev)
	  })

	  $('.loading-bar').mousemove(function(ev){
	    var timePosition = that.player.getHoveredTimePosition(ev);
	    that.userView.skipToHover(that.player.timePosition, ev);
	  })

	  $('.loading-bar').hover(function(){},function(){
	    $('.skip-to').remove();
	  })

	  $('body').on('click','.remove-warning',function(){
	    var id = $(this).attr('data-id')
	    $(this).remove()
	    $('.song-line.'+id+' .right-inline').prepend('<div class="remove-real" data-id="'+id+'">sure?</div>');
	  })

	  $('body').on('click','.remove-real',function(){
	    var id = $(this).attr('data-id')
	    that.userView.removeLibrarySong(this, id)
	    that.userSongs.removeLibrarySong(id);
	    $.post('/remarks.json?delete_lib=1&lib_id='+id);
	  })

	  $('body').on('click','#edit-lib-link',function(){
	    var id = $(this).attr('data-id');
	    var editingSong = that.userSongs.getSong(id, true);

	    $('#edit-lib-song-artist').val(editingSong['song_artist'])
	    $('#edit-lib-song-name').val(editingSong['song_name'])
	    $('#edit-lib-song-link').val(editingSong['song_link'])
	    $('.edit-lib-submit').attr('data-id',id)
	  })

	  $('body').on('click','.edit-lib-submit',function(){
	    var id = $(this).attr('data-id')
	    var newValues = that.userView.getEditValues();
	    var editedSong = that.userSongs.editLibSong(id, newValues);
	    that.userView.libEditSuccess();
	    $.post('/remarks.json?edit_lib=1&name='+editedSong['song_name'].replace(/&/g,'zxcvbn').replace(/#/g,'wphshtg')+'&artist='+editedSong['song_artist'].replace(/&/g,'zxcvbn').replace(/#/g,'wphshtg')+'&link='+editedSong['song_link']+'&lib_id='+editedSong['id'])
	  })

	  $('body').on('click','.repeat-button',function(){
	    that.player.toggleRepeat();
	    that.userView.toggleRepeat();
	  })

	  $('body').on('click','.volume-setter',function(ev){
	  	var x = ev.pageX;
	  	if (x < 31){
	  		if (that.player.volume == 0){
	  			$('.volume-setter').attr('style','');
	  			$('.volume-inner').attr('style','width:'+(that.player.lastVolume/100)*160+'px');
	  			that.player.volume = that.player.lastVolume;
	  		} else {
	  			$('.volume-setter').attr('style','background-color:#e74c3c');
					$('.volume-inner').attr('style','width:0px');
					that.player.lastVolume = that.player.volume;
					that.player.volume = 0;
				}
	  	} else {
	  		$('.volume-setter').attr('style','');
	  		$('.volume-inner').attr('style','width:'+(x-30)+'px');
	  		that.player.volume = ((x-30)/160)*100
	  	}
	  })

	  $('.volume-setter').hover(function(){
	  	$('.volume-inner').attr('style','width:'+(that.player.volume/100)*160+'px')
	  },function(){
	  	$('.volume-inner').attr('style','width:0px');
	  })

	  $('body').on('keyup','#song_song_link', function(ev){
	  	var link = $('#song_song_link').val();
	  	if (link.length > 10){
		  	if (that.stopTitle == 0){
		  		that.player.extractTitle(link);
	  			that.stopTitleTimer();
			  }
	  	}
	  })

	  $('body').on('keyup','#new-lib-song-link', function(){
	  	var link = $('#new-lib-song-link').val();
	  	if (link.length > 10){
		  	if (that.stopTitle == 0){
		  		that.player.extractTitle(link, 'lib');
  				that.stopTitleTimer();
		  	}
		  }
	  })
  }
}

function AllSongs(){
  this.names;
  this.songs;
  this.beingPlayed;
  this.librarySongs;
  this.currentPlaylist;

  this.fetchSongs = function(callback){
	  var that = this;
	    $.getJSON(
	      '/songs.json?fetch=1',
	      function(response){
	        that.songs = null;
	        $('.loading-gif').remove();

	        that.songs = response['edm_songs'];
	        that.librarySongs = response['library_songs'];
	        if (that.beingPlayed){
	        	that.setBeingPlayed(that.beingPlayed['id'], false)
	        } else {
	        	that.currentPlaylist = that.songs;
	        }
	        that.fillNames(that.songs);
	        if (callback){
	          callback();
	        }
	      }
	    )
	}

	this.changePlaylist = function(bool){
		if (bool){
			this.currentPlaylist = this.librarySongs;
		} else {
			this.currentPlaylist = this.songs;
		}
	}

	this.filterLink = function(link, id){
		var link = link.split('watch?v=')[1]
		if (link == undefined){
      link = this.getSong(id, this.currentPlaylist == this.librarySongs)['song_link'];
    }
    return link;
	}

	this.setBeingPlayed = function(songId, playlist){
		var that = this;
		var checkSongs;
		playlist ? checkSongs = this.librarySongs : checkSongs = this.songs

		$.each(checkSongs, function(i, song){
			song['being-played'] = '';
			if (song['id'] == songId){
				song['being-played'] = '1'
				that.beingPlayed = song
			}
		})
	}

	this.fillNames = function(songlist){
		this.names = [];
		var that = this;
		$.each(songlist, function(i, datum){
	    that.names.push(datum['song_artist'].toLowerCase() + ' - ' +  datum['song_name'].toLowerCase())
	  })
	}

	this.getSong = function(songId, libraryClick){
		var returnSong;
    var checkPlaylist;
    libraryClick ? checkPlaylist = this.librarySongs : checkPlaylist = this.songs;
		$.each(checkPlaylist, function(i, song){
			if (song['id'] == songId){
				returnSong = song;
			}
		})
		return returnSong;
	}

	this.getRandom = function(){
		return this.currentPlaylist[Math.floor(Math.random()*this.currentPlaylist.length)]
	}

	this.upvote = function(songId){
		var song = this.getSong(songId, false);
		song['voted'] = 0;
		song['points']++;
	}

	this.findMatched = function(input){
		var matchedNames = [];
		var that = this;
    $.each(this.names, function(i, name){
      if (name.indexOf(input) != -1) {
        song = that.songs[that.names.indexOf(name)]
        if (matchedNames.indexOf(song) == -1) {
          matchedNames.push(song);
        }
      }
    })
    return matchedNames;
	}

  this.getPaged = function(page, playlist, upToPage){
    var tabSongs;
    if (playlist == 'edm'){
      tabSongs = this.songs;
    } else {
      tabSongs = this.librarySongs;
    }
    var beginning;
    upToPage ? beginning = 0 : beginning = page*50
    return tabSongs.slice(beginning,(50*page+50));
  }

  this.removeLibrarySong = function(id){
    var that = this;
    $.each(that.librarySongs,function(i, song){
      if (song){
        if (song['id'] == id){
          that.librarySongs.splice(i, 1);
        }
      }
    })
  }

  this.addToLib = function(song){
    this.librarySongs.unshift({
      id: song['id'],
      song_name: song['song_name'],
      song_artist: song['song_artist'],
      song_link: song['song_link']
    })
  }

  this.getNextLibId = function(){
    var id;
    if (this.librarySongs.length){
      id = this.librarySongs[0]['id'] + 1
    } else {
      id = 1;
    }
    return id;
  }

  this.editLibSong = function(id, newValues){
    var song = this.getSong(id, true);
    song['song_artist'] = newValues['artist']
    song['song_name'] = newValues['name']
    song['song_link'] = newValues['link']
    return song;
  }
}

function SongView(){
	this.songList = $('.song-list')

	this.appendSongs = function(showSongs, playlist){
		var that = this;
		if (playlist == 'edm'){
			$.each(showSongs, function(i, song){
				that.appendEdmSong(song, i);
			})
		} else {
			$.each(showSongs, function(i, song){
				that.appendLibrarySong(song);
			})
		}
	}

	this.appendEdmSong = function(song, i){
		var link = song['song_link'].split('watch?v=')[1]
	    if (link == undefined){
	      var link = song['song_link'];
	    }
	    if (i == 0){
	      if (song['points'] == 1){
	        var likeWord = ' like'
	      } else {
	        var likeWord = ' likes'
	      }
	    } else {
	      var likeWord = ''
	    }
	    if (song['voted'] == 2){
	      var likeOrNo = '<div class="upvote" data-path="/songs/'+song['id']+'/upvote"></div>'
	    } else {
	      var likeOrNo = '<div class="edm-add-to-lib" data-id='+song['id']+' title="add to library">+</div>'
	    }
	    if (song['being-played']){
	      var beingPlayedOrNo = ' being-played'
	    } else {
	      var beingPlayedOrNo = ''
	    }
	    $('.song-list').append('<div class="song-line '+song['id']+beingPlayedOrNo+'"><div class="song" id="'+song['id']+
	    	'"><span id="song"><a href="/songs?d='+link+'"></a></span></div><div class="song-id-text">'+
	    	song['song_name']+'<span class="song-artist-shade">'+song['song_artist']+'</span></div><div class="right-inline"><div class="like-count">'+
	    	song['points']+likeWord+'</div>'+likeOrNo+'<div class="song-line-author">'+song['author']+'</div></div></div>');
	}

	this.appendLibrarySong = function(song){
		var link = song['song_link'].split('watch?v=')[1]
	    if (link == undefined){
	      var link = song['song_link'];
	    }
	    
	    if (song['being-played']){
	      var beingPlayedOrNo = ' being-played'
	    } else {
	      var beingPlayedOrNo = ''
	    }

	    $('.song-list').append('<div class="song-line '+song['id']+beingPlayedOrNo+'"><div class="song" id="'+song['id']+'"><span id="song"><a data-library=1 href="/songs?d='+link+'"></a></span></div><div class="song-id-text">'+song['song_name']+'<span class="song-artist-shade">'+song['song_artist']+'</span></div><div class="right-inline"><a id="edit-lib-link" data-id="'+song['id']+'" href="#edit-library-song" data-toggle="modal">edit</a><div class="remove-warning" data-id="'+song['id']+'">remove</div></div></div>');
	}

	this.switchBeingPlayed = function(clickedId){
		if ($('.being-played').length){
      var prevId = $('.being-played').attr('class').split(' ')[1];
      $('.being-played').attr('class', 'song-line ' + prevId);
    }
    $('.song-line.'+clickedId).attr('class', 'song-line '+clickedId+' being-played');
    $('.song#'+clickedId).attr('style', '');
	}

	this.setupBelowMain = function(song, playlist){
		if (!playlist){
      $('.below-main').show();
      if (song['points'] == 1){
	      var personOrPeople = 'person likes'
	    } else {
	      var personOrPeople = 'people like'
	    }
	    $('.below-main').empty();
	    $('.below-main').append('<div class="show-song-author">'+song['points']+' '+personOrPeople+' this song<br>contributed by '+song['author']+'</div>')
	    if (song['voted'] == 0){
	      $('.below-main').append('<div class="vote-box"><br>liked</div>')
	    } else {
	      $('.below-main').append('<div class="upvote" data-path="/songs/'+song['id']+'/upvote"></div>')
	    }
	    if (song['priority'] == 1){
	      $('.below-main').append('<div class="recently-added-tag">Recently Added</div>')
	    }
    } else {
      $('.below-main').hide();
    }
	}

	this.setupSongTimer = function(song, playlist){
    $('.current-player-time').html('---- / ----')
    $('.listened-bar').css({width:0})
    $('.right-arrow-info').html(song['song_name']+' by '+song['song_artist']);
    var currentSongWidth = $('.right-arrow-info').width()
    if (currentSongWidth < 370 ){
      var currentSongLeft = (370 - currentSongWidth) / 2
      $('.right-arrow-info').css({left:currentSongLeft});
    }
    document.title = (song['song_name']+' by '+song['song_artist']).replace(/&amp;/g, '&');
    // this.setupBelowMain(song, playlist);
  }

  this.emptySongList = function(){
    $('.song-list').empty();
  }

  this.changeToEdmHeader = function(){
    $('.right-half').append('<div class="edm-banner"><input id="song-search" placeholder="search playlist"></input><div class="edm-description">EDM music. Sorted by time. Contribute recent songs only.</div><a href="#newsong" class="submit-button" data-toggle="modal">contribute song</a><a id="contributors-modal" href="#contributors" data-toggle="modal">contributors</a></div><div class="song-list"></div>')
  }

  this.changeToLibHeader = function(){
    var notLogged = false;
    if ($('#logged_in').length){
      notLogged = '';
    } else {
      notLogged = '<div class="not-logged-library">You don\'t have a library yet, so we added a song we really like for you. Don\'t feel left out. Try out adding a song to the library! Log in to start your own.</div>'
    }
    $('.right-half').append('<div class="edm-banner"><input id="new-lib-song-artist" placeholder="artist"></input><input id="new-lib-song-name" placeholder="song name"></input><input id="new-lib-song-link" placeholder="youtube/soundcloud link"></input><div class="submit-lib-song"><div class="submit-lib-song-word">Add to Library</div></div><div class="library-description">Songs you <span class="edm-add-to-lib-fake">+</span>\'d or manually added. Any genre. Song or set.</div></div><div class="song-list"></div>'+notLogged);
  }

  this.switchToEdmTab = function(edmScrollTop, songs){
    $('.edm-playlist-button').css({width:157,right:-7})
    $('.library-playlist-button').css({width:150,right:0})
    $('.right-half').empty();
    this.changeToEdmHeader();
    this.appendSongs(songs, 'edm');
    // if (!(edmScrollTop == 'k')){
    // 	if (!(edmScrollTop < 400)){
    //   	$(document).scrollTop(edmScrollTop)
    //   }
    // }
  }

  this.switchtoLibTab = function(libraryScrollTop, songs){
    $('.library-playlist-button').css({width:157,right:-7})
    $('.edm-playlist-button').css({width:150,right:0})
    $('.right-half').empty();
    this.changeToLibHeader();
    if (songs.length){
      this.appendSongs(songs, 'lib')
    } else {
      $('.right-half').append('<div class="not-logged-library">Library is empty</div>')
    }
    // if (!(libraryScrollTop == 'k')){
    // 	if (!(libraryScrollTop < 400)){
    //   	$(document).scrollTop(libraryScrollTop)
    //   }
    // }
  }

  this.toggleRepeat = function(){
    if ($('.repeat-button .repeat-text').html() == 'repeat is on'){
      $('.repeat-button .repeat-text').html('repeat is off');
      $('.repeat-button').attr('style','');
    } else {
      $('.repeat-button .repeat-text').html('repeat is on');
      $('.repeat-button').attr('style','background-color:#2ecc71');
    }
  }

  this.scaleElements = function(){
    var holder = (($(window).width() / 2)+270)
    var bigPictureTextMargin = 'margin-left:'+($(window).width() - 350) / 2+'px'
    var nextSongMargin = 'margin-left:'+($(window).width() + 50) / 2+'px'
    var leftWrapperMargin = 'margin-left:'+($(window).width() - 620) / 2+'px'
    var roseayWordMargin = 'margin-left:'+($(window).width() - 205) / 2+'px'
    var upNextLeftMargin = 'left:'+ (((($(window).width() - holder) / 2)-115)+holder)+'px'
    var leftHalfHeight = 'height:'+($(window).height())+'px'
    var pageheight = $(window).height() - 90
		var rightHalfWidth = 'width:'+($(window).width() - 400)+'px'
    var rightHalfHeight = 'min-height:'+($(window).height())+'px'
    $('.big-picture-text').attr('style',bigPictureTextMargin);
    $('.left-side-wrapper').attr('style',leftWrapperMargin);
    $('.up-next-holder').attr('style',upNextLeftMargin);
    $('.left-half').attr('style',leftHalfHeight);
    $('.top-banner').css({opacity:1});
  	$('.page-wrapper').css({height: pageheight})
    $('.right-half').attr('style',rightHalfWidth+';'+rightHalfHeight);
    $('.play-pause-button').css({opacity:1});
    $('.next-song-btn').css({opacity:1});
    $('.top-banner').hide();
  }

  this.skipToHover = function(duration, mouse){
  	var y = mouse.pageY;
  	var x = mouse.pageX;
  	if ((x - 40) < 0){
      x = 40;
    }
    $('.skip-to').remove();
    $('body').append('<div class="skip-to">skip to '+duration+'</div>');
    $('.skip-to').css({top:y - 50, left:x - 40})
  }

  this.getSongIdFromUpvote = function(upvote){
    var parent = upvote.parentNode;
    var songID = parseInt($(parent).attr('id'));
    if (!(songID)){
      songID = $(upvote).attr('data-path').split('/')[2]
    }
    return songID;
  }

  this.getsongIdFromSong = function(song){
    var clickedId = $(song).parent().parent().attr('id');
    if (!(clickedId)){
      clickedId = $(song).attr('data-songid');
    }
    return clickedId;
  }

  this.changeIntoVoted = function(songID, upvote, song){
    $(upvote).remove();
    $('.song-line.'+songID+' .like-count').html(song['points']);
    $('.song-line.'+songID+' .upvote').remove();
    $('.song-line.'+songID+' .right-inline').append('<div class="edm-add-to-lib" data-id='+songID+' title="add to library">+</div>');
    $('.below-main').empty();
    $('.below-main').append('<div class="show-song-author">'+ song['points'] +' people like this song<br>contributed by '+song['author']+'</div>')
    $('.below-main').append('<div class="vote-box"><br>liked</div>')
    if (song['priority']){
      $('.below-main').append('<div class="recently-added-tag">Recently Added</div>')
    }
  }

  this.getSearchInput = function(search){
    if ($(search).val() == ''){
      $('.edm-playlist-button').trigger('click');
    }
    return $(search).val();
  }

  this.removeLibrarySong = function(librarySong, id){
    $(librarySong).remove();
    $('.song-line.'+id+' .song').remove();
    $('.song-line.'+id+' .song-id-text').remove();
    $('.song-line.'+id).attr('style','height:0px;border-bottom: solid black 0px;');
  }

  this.getSongSubmitInfo = function(){
    var songArtist = $('#song_song_artist').val();
    var songName   = $('#song_song_name').val();
    var songLink   = $('#song_song_link').val();
    $('#song_song_artist').val('uploading..');
    $('#song_song_name').val('just wait..');
    $('#song_song_link').val('a few seconds..');
    $('#close-modal').hide();

    return {'artist': songArtist, 'name': songName, 'link':songLink};
  }

  this.getLibSubmitInfo = function(id){
    $('.not-logged-library').remove();
    var songArtist = $('#new-lib-song-artist').val()
    var songName   = $('#new-lib-song-name').val()
    var songLink   = $('#new-lib-song-link').val()
    var id = id;
    $('#song_song_artist').val('');
    $('#song_song_name').val('');
    $('#song_song_link').val('');

    return {'id': id, 'song_artist': songArtist, 'song_name': songName, 'song_link':songLink};
  }

  this.closeSongSubmitModal = function(){
    $('#close-modal').trigger('click');
    $('.song-modal-submit').show();
    $('#close-modal').show();
    $('#song_song_artist').val('');
    $('#song_song_name').val('');
    $('#song_song_link').val('');
  }

  this.createThankTooltip = function(){
    $('.left-half').prepend('<div class="radio-tooltip">Thanks for your contribution!</div>')
    setTimeout(function(){
      $('.radio-tooltip').remove();
    }, 6000)
  }

  this.createAddedToLibTooltip = function(song){
    var songTitle = song['song_name'] + ' by ' + song['song_artist']
    $('.left-half').prepend('<div class="radio-tooltip">Added \"'+songTitle+'\" to Library</div>')
    setTimeout(function(){
      $('.radio-tooltip').remove();
    }, 5000)
  }

  this.successfulLogin = function(id){
    $('#login-modal').remove();
    $('.submit-button').show();
    $('.left-half').prepend('<span id="logged_in"></span><a href="/sessions/'+id+'" class="logout" data-method="delete" rel="nofollow"></a>');
    $('#close-login-modal').trigger('click');
    $('#newSongModal h4').html('youtube/soundcloud links');
  }

  this.failedLogin = function(loginMethod){
    if (loginMethod == 'join'){
      $($('h2')[1]).html('join')
      $($('.new_user')[1]).prepend('<h4 style="color:red">something went wrong</h4>')
      $('#create_password').val('');
      $('#create_password_confirmation').val('');
    } else {
      $($('h3')[0]).html('sign in')
      $($('.new_user')[0]).prepend('<h4 style="color:red">wrong username or password</h4>')
      $('#user_password').val('');
      $('#user_username').val('');
    }
  }

  this.getEditValues = function(){
    var artist = $('#edit-lib-song-artist').val();
    var name = $('#edit-lib-song-name').val();
    var link = $('#edit-lib-song-link').val()
    return {'artist': artist, 'name': name, 'link': link}
  }

  this.libEditSuccess = function(){
    $('#edit-lib-song-artist').val('')
    $('#edit-lib-song-name').val('')
    $('#edit-lib-song-link').val('')
    $('.library-playlist-button').trigger('click');
    $('.modal-backdrop').trigger('click');
  }
}

function SongPlayer(songFinishBind){
  this.songFinishBind = songFinishBind;
	this.youtubeCode;
	this.songPlayed;
	this.playerType;
	this.currentPlaylist ='edm';
	this.songRepeat = false;
	this.playerNumber = 1;
	this.titleNumber = 1;
	this.currentlyPlaying;
	this.volume = 70;
	this.lastVolume = 70;
	this.widget;

	this.changePlaylist = function(bool){
		if (bool){
      this.currentPlaylist = 'lib';
    } else {
      this.currentPlaylist = 'edm';
    }
	}

	this.play = function(songId, link){
		var that = this;
		clearInterval(this.playerCounter);
    this.currentlyPlaying = songId;
    this.youtubeCode = link;
    this.songPlayed = songId;
    $('iframe').remove();

    if (link.indexOf('soundcloud')+1){
      var currentPlayer = this.playerNumber;
      SC.oEmbed(link,{auto_play:true, maxwidth:600, maxheight:350, show_comments: true, color:'602220' }, function(track){
        if (currentPlayer == that.playerNumber){
          if (track){
            $('.left-side-wrapper').css({top:0})
            that.playerType = 'soundcloud';
            $('.left-side-wrapper').prepend(track.html);
            that.bindScPlayerFinish();
          } else {
            // createPlayerErrorTooltip();
            that.songFinishBind();
            $.post('/remarks.json?fix_song='+songPlayed);
          }
        }
      })
    } else {
      $('.left-side-wrapper').css({top:0})
      this.playerType = 'youtube';
      $('.left-side-wrapper').prepend('<div id="ytplayer'+this.playerNumber+'"></div>')
      this.constructYTVideo(this.playerNumber);
    }
	}

  this.onPlayerError = function(event){
    // createPlayerErrorTooltip();
    this.songFinishBind();
    $.post('/remarks.json?fix_song='+this.songPlayed);
  }

  this.onPlayerStateChange = function(event) {
    var myPlayerState;
    myPlayerState = event.data;
    if (myPlayerState == 0){
      if (this.songRepeat){
        this.repeat();
      } else {
        this.songFinishBind();
      }
    }
  }

  this.onPlayerReady = function(event){
    this.widget = event.target;
    var that = this;
    this.widget.playVideo();
    this.playerCounter = setInterval(function(){
      var current = that.widget.getCurrentTime(),
          duration = that.widget.getDuration()
      var ratio = current / duration
      $('.listened-bar').css({width:ratio*340});
      var currentTime = secondsToTime(Math.floor(current)) + ' / ' + secondsToTime(duration)
      if (that.widget.getPlayerState() == -1){
      	currentTime = secondsToTime(duration)
      }
      $('.current-player-time').html(currentTime);
      if (that.widget.getPlayerState() == 1){
      	$('.play-pause-button').attr('class','play-pause-button pause-image');
      } else if ( that.widget.getPlayerState() == 2){
      	$('.play-pause-button').attr('class','play-pause-button play-image');
      }

      that.widget.setVolume(that.volume);
    }, 300)
  }

	this.constructYTVideo = function(playerID){
    if (playerID == this.playerNumber){
      player = new YT.Player('ytplayer' + this.playerNumber, {
        height: '320',
        width: '600',
        videoId: this.youtubeCode,
        events: {
          'onReady': this.onPlayerReady.bind(this),
          'onStateChange': this.onPlayerStateChange.bind(this),
          'onError': this.onPlayerError.bind(this)
        }
      })
    }
  }

	this.bindScPlayerFinish = function(){
		var that = this;
    var widgetIframe = $('iframe')[0]
    this.widget = SC.Widget(widgetIframe);
    this.widget.bind(SC.Widget.Events.FINISH, function(player, data) {
      if (that.songRepeat){
        that.repeat();
        that.widget.play();
      } else {
        that.songFinishBind();
      }
    });
    this.playerCounter = setInterval(function(){
      that.widget.getPosition(function(current){
        that.widget.getDuration(function(duration){
          var ratio = current / duration
          $('.listened-bar').css({width:ratio*340});
          $('.current-player-time').html(secondsToTime(Math.floor(current/1000)) + ' / ' + secondsToTime(Math.floor(duration/1000)))
          that.widget.isPaused(function(paused){
          	if (paused){
          		$('.play-pause-button').attr('class','play-pause-button play-image');
          	} else {
          		$('.play-pause-button').attr('class','play-pause-button pause-image');
          	}
          })
        })
        that.widget.setVolume(that.volume);
      })
    }, 300)
  }

  this.toggleRepeat = function(){
    this.songRepeat ? this.songRepeat = false : this.songRepeat = true
  }

  this.skipPlayerTo = function(ev){
  	var that = this;
    var ratio = (ev.pageX - 30) / 340;
    if (this.playerType == 'youtube'){
      this.widget.seekTo(this.widget.getDuration()*ratio);
    } else if (this.playerType == 'soundcloud'){
      this.widget.getDuration(function(duration){
        that.widget.seekTo(duration*ratio);
      })
    }
  }

  this.getHoveredTimePosition = function(ev){
  	var that = this;
    var ratio = (ev.pageX - 30) / 340;
    var x = ev.pageX;
    var y = ev.pageY;
    if ((x - 40) < 0){
      x = 40;
    }
    if (this.playerType == 'youtube'){
      var seek = this.widget.getDuration()*ratio;
      that.timePosition = secondsToTime(seek);
    } else {
      this.widget.getDuration(function(duration){
        var seek = (duration*ratio)/1000;
        that.timePosition = secondsToTime(seek);
      })
    }
    
  }

  this.togglePlayPause = function(){
    if (this.playerType == 'youtube'){
      var playerState = this.widget.getPlayerState();
      if (playerState == 1){
        this.widget.pauseVideo();
      } else if (playerState == 2){
        this.widget.playVideo();
      }


      //if the video playback status is bugged. shit.
      if (this.widget.getPlayerState() == -1){
      	if ($('.play-pause-button').hasClass('play-image')){
      		this.widget.playVideo();
      		$('.play-pause-button').attr('class','play-pause-button pause-image');
      	} else {
      		this.widget.pauseVideo();
      		$('.play-pause-button').attr('class','play-pause-button play-image');
      	}
      }
    } else {
      this.widget.toggle();
    }
  }

  this.repeat = function(){
  	this.widget.seekTo(0);
  }

  this.extractTitle = function(link, lib){
  	var that = this;
  	if (link.indexOf('youtube') > -1){
	  	$.get(
	  		'https://gdata.youtube.com/feeds/api/videos/'+link.split('watch?v=')[1]+'?v=2',
	  		function(response){
	  			that.appendTitle($($(response).find('title')[0]).html().split('-'), lib)
	  		}
	  	)
  	} else if (link.indexOf('soundcloud') > -1) {
      SC.oEmbed(link,{auto_play:false, show_comments: false}, function(track){
        if (track){
          $('.title-extractor').prepend(track.html);
          setTimeout(function(){
          	that.extractSCTitle(lib);
          }, 1000);
        }
      })
  	}
  	this.titleNumber ++;
  }

  this.extractSCTitle = function(lib){
  	var that = this;
  	var widgetIframe = $('.title-extractor iframe')[0]
    this.titlePlayer = SC.Widget(widgetIframe);
    this.titlePlayer.getCurrentSound(function(sound){
    	that.appendTitle(sound['title'].split('-'), lib)
    	$('.title-extractor').empty();
    })
  }

  this.appendTitle = function(title, lib){
  	var artist = title[0].replace('&amp;','&')
  	var name = title[1].replace('&amp;','&')
  	if (name[0] == ' '){
  		name = name.slice(1,name.length);
  	}
  	if (artist[artist.length - 1] == ' '){
  		artist = artist.slice(0,artist.length -1);
  	}
  	if (lib){
			$('#new-lib-song-artist').val(artist);
	  	$('#new-lib-song-name').val(name);
	  	$('.submit-lib-song').trigger('click');
  	} else {
	  	$('#song_song_artist').val(artist);
	  	$('#song_song_name').val(name);
	  }
  }
}

$.getScript("https://www.youtube.com/iframe_api");
var doit = new SongController();
doit.beginExperience();

window.onload = function(){
	SC.initialize({client_id:"8f1e619588b836d8f108bfe30977d6db"});
	doit.listenersActivate();
}


  $(function() {
    $.fn.scrollBottom = function() {
        return $(document).height() - this.scrollTop() - this.height();
    };

    var $el = $('.top-banner');
    var $el3 = $('.left-half');
    var $el4 = $('.left-blue-top-banner');
    var $window = $(window);

    $window.bind("scroll resize", function() {
        var gap = $window.height() - $el.height() - 10;
        var visibleFoot = 400 - $window.scrollBottom();
        var scrollTop = $window.scrollTop()
        
        if(scrollTop < 400 + 10){
            $el.css({
                top: (400 - scrollTop) + "px",
                bottom: "auto"
            });
            $el3.css({
                top: (480 - scrollTop) + "px",
                bottom: "auto"
            });
            $el4.css({
                top: (400 - scrollTop) + "px",
                bottom: "auto"
            });
            $('.top-banner').css({opacity:1})
        }else if (visibleFoot > gap) {
            $el.css({
                top: "auto",
                bottom: visibleFoot + "px"
            });
            $el3.css({
                top: "auto",
                bottom: visibleFoot + "px"
            });
            $el4({
                top: "auto",
                bottom: visibleFoot + "px"
            });
        } else {
            $el.css({
                top: 0,
                bottom: "auto"
            });
            $el3.css({
                top: 80,
                bottom: "auto"
            });
            $el4.css({
                top: 0,
                bottom: "auto"
            });
        }
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100){
        	if ($('#song-search').val().length == 0){
        		doit.goToNextPage();
        	}
        }
    });
});