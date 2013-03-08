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
    $('#'+songID).append('<div class="info_bar">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>')
    $('#'+songID+' .info_bar').append('<span class="12345">'+points+' points ~ </span>')
    $('#'+songID+' .info_bar').append('<a class="user" href="/users/'+datum["author_id"]+'" data_author_total="'+datum["author_total"]+'" data_author_avg="'+datum["author_avg"]+'" data_author_submissions="'+datum["author_submissions"]+'">'+datum["author"]+'</a>')
    $('#'+songID+' .info_bar').append('&nbsp;|&nbsp;'+ datum['time'] +' ago &nbsp;| &'+datum['id'])
  }

  var fetchRemarks = function(page) {
    idleSeconds = 0
    $('.remarks').empty();
    if (!(page)) {
      page = 0
    }
    $.getJSON(
      '/remarks.json?page='+page,
      function(response){
        $.each(response, function(i, datum){
          $('.remarks').append('<div class="remark" id="'+i+'"><a class="user" href="/users/'+datum["author_id"]+'" data_author_total="'+datum["author_total"]+'" data_author_avg="'+datum["author_avg"]+'" data_author_submissions="'+datum["author_submissions"]+'">'+datum["author"]+'</a> | <span class="remark-info">'+datum['time']+' ago</span> <br><span class="remark-body">'+datum['body']+'</span></div>')
          if (datum['authored']){
            $('.remarks #'+i+' .remark-info').append('&nbsp;| <span class="delete-remark" data-remark-id="'+datum['id']+'">delete</span>')
          }
        })
        $('.next-remark-btn').attr('data-remark-page', page+1)
      }
    )
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
        fetchRemarks(page);
      }
    )
  })

  $('.testing1').on('click', '.refresh', function(){
    fetchRemarks();
  })

  $('.testing1').on('click', '.remark-input-btn', function(ev){
    var input = $('.remark-input').val();
    $('.remark-input').val('')

    if ($('#logged_in').length){
      $.post(
        '/remarks.json',
        { 'remark':{
          'body': input
          }
        },
        function(response){
          fetchRemarks();
        }
      )
    } else {
      $('.remark-input').val('you have to login to post a remark. chill, it takes 10 seconds.')
    }
  })

  $('.testing1').on('click', '.next-remark-btn', function(ev){
    var page = parseInt($(this).attr('data-remark-page'))
    fetchRemarks(page)
  })

  $('#12345').on('click', '#nextbtn a', function(ev){
    ev.preventDefault();

    if ($('ol').attr('goback-start')){
      var songStart = parseInt($('ol').attr('goback-start'))
    } else {
      var songStart = parseInt($('ol').attr('start')) + 20
    }

    var page = parseInt($('#nextbtn a').attr('href').split('?page=')[1])
    var byTime = $('#12345').attr('data-time')
    $('#songwrap').remove()
    $.getJSON(
      '/songs.json?page='+page+'&by_time='+byTime+'',
      function(data){
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

    var path = $(this).attr('href')
    var total = $(this).attr('data_author_total')
    var avg = $(this).attr('data_author_avg')
    var submissions = $(this).attr('data_author_submissions')
    var byTime = $('#12345').attr('data-time')
    if ( byTime == "true"){
      var byTime = 1
    } else {
      var byTime = 0
    }
    if ($('#nextbtn a').length) {
      var page = parseInt($('#nextbtn a').attr('href').split('?page=')[1])
    } else {
      var page = 0
    }
    var songStart = $('ol').attr('start')


    $('#songwrap').remove();
    $('#12345').append('<ol start="1" id="songwrap" goback-start="'+songStart+'"></ol>')
    if (page) {
      $('#songwrap').append('<br><span class="pagination"><span class="goback" id="nextbtn"><a href="/songs?page='+ (page-1) +'&by_time='+byTime+'">back</a></span></span>')
    }

    $.getJSON(
      path,
      function(data){
        $('#songwrap').append('<h4 class="user_header">'+data['username']+'.hub</h4>')
        $('#songwrap').append('<div class="user_info">total ~ '+total+'</div>')

        if (data['songhubs'].length){
          $.each(data['songhubs'], function(i, datum){
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
            
            $('#'+songID).append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
            $('#'+songID).append('<span id="song"><a href="/songs?d='+link+'">'+datum["song_artist"]+' - '+datum["song_name"]+'</a>&nbsp;| &'+datum['id']+'</span>')
          })
        } else {
          $('#songwrap').append('<br><br><span style="margin-left:138px">empty .hub</span>')
        }
      }
      )
  })

  $('#12345').on('click', '.upvote',function(ev){
    ev.preventDefault();
    ev.stopImmediatePropagation();

    var that = this;
    var parent = this.parentNode;
    var songID = parseInt($(parent).attr('id'));


    path = $(this).attr('href') + '.json'
    if (path == '/sessions/new.json'){
      $('#songwrap').append('<a class="need-to-login" href="/sessions/new">login</a>')
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
      $('.need-to-login2').css('left', ev.pageX * .50)
    } else {
      $.post(path)
    }
  })

  $('body').on('click', '#song a', function(ev){
    ev.preventDefault();
    ev.stopImmediatePropagation();
    $('.add-to-hubsongs').remove();
    $('iframe').remove();
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
      })
    } else if (link.indexOf('&aboutus')+1) {
      var link = link.replace('&aboutus', '')
      $('.testing1').prepend('<iframe width="545" height="220" src="http://www.youtube.com/embed/'+ link +
                             '?autoplay=1&controls=2&iv_load_policy=3&autohide=2&modestbranding=1&loop=1&vq=hd360&start=119" frameborder="0"></iframe>')
    } else {
      $('.testing1').prepend('<iframe width="545" height="220" src="http://www.youtube.com/embed/'+ link +
                             '?autoplay=1&controls=2&iv_load_policy=3&autohide=2&modestbranding=1&loop=1&vq=hd360" frameborder="0"></iframe>')
    }

    if (($(this).parent().parent().attr('data-uphub') == 'true') || ($(this).attr('data-uphubb') == 'true')){
      $('.testing1').prepend('<a href="/songs/'+ songId +'/uphub" class="add-to-hubsongs">+.hub</a>')
    }
  })

  $('.relevance').click(function(ev){
    ev.preventDefault();
    ev.stopImmediatePropagation();
    $('#songwrap').remove();

    $.getJSON(
      '/songs.json?page=-1',
      function(data){
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
    $('#songwrap').remove();

    $.getJSON(
      '/songs.json?page=-1&by_time=1',
      function(data){
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
    $('#songwrap').remove();

    $.getJSON(
      '/songs.json?page=-1',
      function(data){
        $('#12345').append('<ol start="1" id="songwrap"></ol>')
        $.each(data, function(i, datum){
          setupSong(datum);
        })
        $('#songwrap').append('<span class="pagination"><span id="nextbtn"><a href="/songs?page=1">next</a></span></span>')
      }
    )
  })

  setInterval(function(){
    if (onTab){
      idleSeconds += 1;
    }
    if ((idleSeconds  >= 20) && ($('.next-remark-btn').attr('data-remark-page'))){
      fetchRemarks(parseInt($('.next-remark-btn').attr('data-remark-page') - 1))
    }
  }, 4000)

  window.onfocus = function(){
    onTab = true
    if (blurSeconds >= 15){
      fetchRemarks(parseInt($('.next-remark-btn').attr('data-remark-page') - 1))
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

  fetchRemarks();
})