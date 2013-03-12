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
  blurSeconds = 0;
  onTab = true;

  var setupSong = function(datum){
    var songID = datum['id']
    var link = datum['song_link'].split('watch?v=')[1]
    var points = datum['points']
    var createdAt = datum['created_at']

    if (link == undefined){
      var link = datum['song_link'];
    }
    if (datum['uphubbed'] == 0) {
      $('#songwrap').append('<li class="song" id="'+songID+'" data-uphub="true"></li>')
    } else {
      $('#songwrap').append('<li class="song" id="'+songID+'" data-uphub="false"></li>')
    }
    if (datum['voted'] == 0){
      $('#'+songID).append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
    } else if (datum['voted'] == 1){
      $('#'+songID).append('<a href="/sessions/new" class="upvote">^</a>&nbsp;&nbsp;&nbsp;')
    } else {
      $('#'+songID).append('<a href="/songs/'+songID+'/upvote" class="upvote">^</a>&nbsp;&nbsp;&nbsp;')
    }
    $('#'+songID).append('<span id="song"><a href="/songs?d='+link+'">'+datum["song_artist"]+" - "+datum["song_name"]+'</a></span>')
                 .append('<div class="info_bar">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>')
    $('#'+songID+' .info_bar').append('<span class="12345">'+points+' points ~ </span>')
                              .append('<a class="user" href="/users/'+datum["author_id"]+
                                      '" data_author_total="'+datum["author_total"]+'" data_author_avg="'+datum["author_avg"]+
                                      '" data_author_submissions="'+datum["author_submissions"]+'">'+datum["author"]+'</a>')
                              .append('&nbsp;|&nbsp;'+ datum['time'] +' ago &nbsp;| <span class="song-id-filter" data-id='+songID+'>&'+datum['id']+
                                      '</span>')
  }

  var fetchRemarks = function(page, filter, callback) {
    idleSeconds = 0
    if (!(page)) {
      page = 0
    }
    $('remark-header').attr('data-remark-user-page', '')

    $.getJSON(
      '/remarks.json?page='+page+'&filter='+filter,
      function(response){
        $('.remarks').empty();
        if (response.length){
          $.each(response, function(i, datum){
            setupRemark(i, datum);
          })
          $('.next-remark-btn').attr('data-remark-page', page+1)
        } else {
          $('.remarks').append('<div class="remark"><br><span class="remark-body remark-text"> be the first to remark </span></div>')
        }
        if (callback){
          callback();
        }
      }
    )
  }

  var setupRemark = function(i, datum){
    $('.remarks').append('<div class="remark" id="'+i+'"><span class="remark-text"><b><a class="user" href="/users/'+datum["author_id"]+
                         '" data_author_total="'+datum["author_total"]+'" data_author_avg="'+datum["author_avg"]+
                         '" data_author_submissions="'+datum["author_submissions"]+'">'+datum["author"]+
                         '</a></b> | <span class="remark-info">'+datum['time']+' ago</span> <br><span class="remark-body">'+
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

  $('body').on('click', '.song-modal-submit', function(ev){
    ev.preventDefault();
    var songArtist = $('#song_song_artist').val();
    var songName = $('#song_song_name').val();
    var songLink = $('#song_song_link').val();
    $('#song_song_artist').val('');
    $('#song_song_name').val('');
    $('#song_song_link').val('');
    $('#close-modal').trigger('click');

    $.post(
      '/songs.json',
      {'song' : {
        'song_name' : songName,
        'song_artist' : songArtist,
        'song_link': songLink
        }
      }
    )
  })

  $('.testing1').on('click', '.delete-remark', function(){
    var remark_id = $(this).attr('data-remark-id')
    var page = parseInt($('.next-remark-btn').attr('data-remark-page'))-1
    $.post(
      '/remarks/'+ remark_id+'.json?page='+page,
      { '_method': 'delete'},
      function(){
        fetchRemarks(page, '');
      }
    )
  })

  $('.testing1').on('click', '.refresh', function(){
    $('.refresh').html('refreshing..');
    $('.next-remark-btn').attr('data-remark-filter', '');
    fetchRemarks(0, "", function(){
      $('.remark-input').val('');
      $('.remark-header').html('air remarks');
      $('.remark-header').attr('data-remark-user-page', '');
      $('.refresh').html('home');
    });
  })

  $('.testing1').on('click', '.remark-input-btn', function(ev){
    var input = $('.remark-input').val();
    var filter = $('.next-remark-btn').attr('data-remark-filter');
    $('.remark-header').html('air remarks');
    
    if (filter) {
      $('.remark-input').val('&' + filter + ' ');
    } else {
      $('.remark-input').val('');
    }

    if ($('#logged_in').length){
      $.post(
        '/remarks.json',
        { 'remark':{
          'body': input
          }
        },
        function(response){
          fetchRemarks(0, filter);
        }
      )
    } else {
      $('.remark-input').val('you have to login to post a remark.')
    }
  })

  $('.testing1').on('click', '.next-remark-btn', function(ev){
    $(this).append('---')
    var filter = $(this).attr('data-remark-filter');
    
    var path = $('.remark-header').attr('data-user-path');

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
            $('.remarks').append('<div class="remark"><br><span class="remark-body remark-text"> be the first to remark </span></div>')
          }
          $('.next-remark-btn').html('next');
        }
      )
    } else {
      var page = parseInt($(this).attr('data-remark-page'));
      fetchRemarks(page, filter, function(){
        $('.next-remark-btn').html('next')
      })
    }
  })

  $('#12345').on('click', '#nextbtn a', function(ev){
    ev.preventDefault();
    var that = this;
    $(that).append('---')

    if ($('ol').attr('goback-start')){
      var songStart = parseInt($('ol').attr('goback-start'))
    } else {
      var songStart = parseInt($('ol').attr('start')) + 20
    }

    var page = parseInt($('#nextbtn a').attr('href').split('?page=')[1])
    var byTime = $('#12345').attr('data-time')
    $.getJSON(
      '/songs.json?page='+page+'&by_time='+byTime+'',
      function(data){
        $('#songwrap').remove()
        $(that).html('next');
        $('#12345').append('<ol start="' + songStart + '" id="songwrap"></ol>')
        $.each(data, function(i, datum){
          setupSong(datum);
        })
        $('#songwrap').append('<span class="pagination"><span id="nextbtn"><a href="/songs?page='+ (page+1) +'">next</a></span></span>')
      }
    )
    ev.stopImmediatePropagation()
  })

  $('body').on('click', '.user', function(ev){
    ev.preventDefault();
    ev.stopImmediatePropagation()
    $('h1').append('<span class="waiting">...</span>')

    var username = $(this).html();
    var path = $(this).attr('href')
    var total = $(this).attr('data_author_total')

    $.getJSON(
      path + '?page=0',
      function(data){
        $('.remarks').empty();
        $('.waiting').remove();
        $('.remark-header').html('remarks on ' + username + '\'s songs | total points ~ ' + total)
        $('.remark-header').attr('data-remark-user-page', 0);
        $('.remark-header').attr('data-user-path', path);

        if (data.length){
          $.each(data, function(i, datum){
            setupRemark(i, datum);
          })
        } else {
          $('.remarks').append('<div class="remark"><br><span class="remark-body remark-text"> be the first to remark </span></div>')
        }
      }
    )
  })

  $('#12345').on('click', '.upvote',function(ev){
    ev.preventDefault();
    ev.stopImmediatePropagation();

    var parent = this.parentNode;
    var songID = parseInt($(parent).attr('id'));
    var that = this;

    path = $(this).attr('href') + '.json'
    if (path == '/sessions/new.json'){
      $('#songwrap').append('<a class="need-to-login" href="#newSessionModal" data-toggle="modal">login</a>')
      $('.need-to-login').css('top', ev.pageY - 8)
      $('.need-to-login').css('left', ev.pageX - 65)
    } else {
    $.post(path, function(response){
      $(that).remove();
      $(parent).prepend('</b>&nbsp;&nbsp;&nbsp;<b>')
    })
    }
  })

  $('.testing1').on('click', '.add-to-hubsongs', function(ev){
    ev.preventDefault();
    ev.stopImmediatePropagation();
    var path = $(this).attr('href')
    $(this).remove();

    if ($('.x1c2').length){
      $('.testing1').append('<a class="need-to-login2" href="/sessions/new">login</a>')
      $('.need-to-login2').css('top', ev.pageY)
      $('.need-to-login2').css('left', ev.pageX)
    } else {
      $.post(path)
    }
  })

  $('body').on('click', '#song a', function(ev){
    ev.preventDefault();
    ev.stopImmediatePropagation();
    $('.player-holder').remove();
    $('.add-to-hubsongs').remove();
    $('iframe').remove();
    var that = this;
    var link = this['href'].split('songs?d=')[1]
    var songId = $(this).parent().parent().attr('id')

    if (link == undefined){
      var link = datum['song_link'];
    }

    if (link.indexOf('soundcloud')+1){
      var link = link.replace(/%2F/g, '/').replace(/%3A/g, ':')
      SC.oEmbed(link,{auto_play:true, maxwidth:545, height:300, show_comments: false, color:'602220' }, function(track){
        track.html['height'] = 300
        $('.testing1').prepend(track.html);
        // appendUphub(that, songId);
      })
    } else {
      if (link.indexOf('&aboutus')+1) {
        var link = link.replace('&aboutus', '')
        $('.testing1').prepend('<iframe width="545" height="220" src="http://www.youtube.com/embed/'+ link +
                               '?autoplay=1&controls=2&iv_load_policy=3&autohide=2&modestbranding=1&loop=1&vq=hd360&start=119" frameborder="0"></iframe>')
        // appendUphub(that, songId);
      } else {
        $('.testing1').prepend('<iframe width="545" height="220" src="http://www.youtube.com/embed/'+ link +
                               '?autoplay=1&controls=2&iv_load_policy=3&autohide=2&modestbranding=1&loop=1&vq=hd360" frameborder="0"></iframe>')
        // appendUphub(that, songId);
      }
    }
    if ($(this).html()[0] == '&') {
      document.title = 'roseay'
    } else {
      document.title = $(this).html();
    }
  })

  $('.random').click(function(){
    $('h1').append('<span class="song-refreshing">...</span>')
    $.getJSON(
      '/songs.json?random=1',
      function(data){
        $('#songwrap').remove();
        $('.song-refreshing').remove();
        $('#12345').append('<ol start="1" id="songwrap"></ol>')
        $('#12345').attr('data-time', '')
        $.each(data, function(i, datum){
          setupSong(datum);
        })
      }
    )
  })

  $('.relevance').click(function(ev){
    ev.preventDefault();
    ev.stopImmediatePropagation();
    $('h1').append('<span class="song-refreshing">...</span>')
    $.getJSON(
      '/songs.json?page=-1',
      function(data){
        $('#songwrap').remove();
        $('.song-refreshing').remove();
        $('#12345').append('<ol start="1" id="songwrap"></ol>')
        $('#12345').attr('data-time', '')
        $.each(data, function(i, datum){
          setupSong(datum);
        })
        $('#songwrap').append('<span class="pagination"><span id="nextbtn"><a href="/songs?page=1">next</a></span></span>')
      }
    )
  })

  $('.time').click(function(ev){
    ev.preventDefault();
    ev.stopImmediatePropagation();
    $('h1').append('<span class="song-refreshing">...</span>')

    $.getJSON(
      '/songs.json?page=-1&by_time=1',
      function(data){
        $('#songwrap').remove();
        $('.song-refreshing').remove();
        $('#12345').append('<ol start="1" id="songwrap"></ol>')
        $('#12345').attr('data-time', true)
        $.each(data, function(i, datum){
          setupSong(datum);
        })
        $('#songwrap').append('<span class="pagination"><span id="nextbtn"><a href="/songs?page=1">next</a></span></span>')
      }
    )
  })

  $('h1 a').click(function(ev){
    ev.preventDefault();
    ev.stopImmediatePropagation();
    $('h1').append('<span class="song-refreshing">...</span>')

    $.getJSON(
      '/songs.json?page=-1',
      function(data){
        $('#songwrap').remove();
        $('.song-refreshing').remove();
        $('#12345').attr('data-time', '')
        $('#12345').append('<ol start="1" id="songwrap"></ol>')
        $.each(data, function(i, datum){
          setupSong(datum);
        })
        $('#songwrap').append('<span class="pagination"><span id="nextbtn"><a href="/songs?page=1">next</a></span></span>')
      }
    )
  })

  $('body').on('click', ' .song-id-filter', function(){
    var id = $(this).attr('data-id');
    $('h1').append('<span class="song-refreshing">...</span>');
    $('.next-remark-btn').attr('data-remark-filter', id);

    fetchRemarks(0, id, function(){
      $('.remark-header').html('&' + id + ' remarks');
      $('.song-refreshing').remove();
      $('.remark-input').val('&' + id + ' ');
    });
  })

  $('.about').click(function(){
    $('#songwrap').empty()
    $('#songwrap').append('<div class="about-text"><i>"she got a big booty so I call her big booty"</i> <br> - Two Chainz <br><br> we aspire to be that simple.<br><br><i>"they ask me what I do and who I do it fo"</i><br>-Two Chainz<br><br>we do it because we think the people who share good music<br>are the most awesome people in the world<br><br>on the song list, notice the "&" numbers.<br> type it in a remark and it will turn into a link<br> for example:  <span id="song"><a href="songs?d=6jhC6GjGC5M&aboutus">&25</a></span><br><br>straight magical. <br><br><br>the +.hub button puts the song into your playlist<br>the ^ button gives the song another point.<br>^ buttons are anonymous<br><br>you are now a master<br>.roseay</div>')
  })

  setInterval(function(){
    if (onTab){
      idleSeconds += 1;
    }
    if ((idleSeconds  >= 20) && ($('.next-remark-btn').attr('data-remark-page'))){
      $('.refresh').html('refreshing..');
      var page = parseInt($('.next-remark-btn').attr('data-remark-page') - 1);
      var filter = $('.next-remark-btn').attr('data-remark-filter');
      fetchRemarks(page, filter, function(){
        $('.refresh').html('home')
      })
    }
  }, 4000)

  window.onfocus = function(){
    onTab = true
    if (blurSeconds >= 15){
      $('.refresh').html('refreshing..');
      var page = parseInt($('.next-remark-btn').attr('data-remark-page') - 1);
      var filter = $('.next-remark-btn').attr('data-remark-filter');
      fetchRemarks(page, filter, function(){
        $('.refresh').html('home')
      })
    }
    blurSeconds = 0;
  }

  window.onblur = function(){
    onTab = false

  }

  setInterval(function(){
    if (!(onTab)) {
      blurSeconds += 1;
    }
  }, 4000)

  // if (!($('#logged_in').length)){
  //   $('#login-modal').trigger('click');
  // }

  fetchRemarks(0, "");
})