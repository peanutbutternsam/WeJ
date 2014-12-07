// function findNextToPlay
var needStop = false;
var numOfSongs; //3
var lastIndex;
var currentIndex;
var nextIndex;
var nextSong;
var startOver;
var listedSearchResults;

var songKey = 'https://api.soundcloud.com/tracks.json?client_id=4346c8125f4f5c40ad666bacd8e96498&q=';
var client = '5fac89a005124d747e2d1b1fc44cc474';

function clearSongs(playlist){
  children = $('.song-display').children();
  for(var i = 0; i < children.length; i++){
    children[i].remove();
  }
   makePlaylist(playlist);
}

  function displayFriends(data){
    $('#friends').html(data);
  }

function searchResults(song){
  $.get('https://api.soundcloud.com/tracks.json?client_id=4346c8125f4f5c40ad666bacd8e96498&q=' + song + '&limit=5', function (result) {
    listOfObjs = result;
    listOfResults = [];
    for(var i = 0; i < listOfObjs.length; i++){
      listOfResults.push(listOfObjs[i].title);
    }
    console.log(listOfResults);
    printSearchResults(listOfResults);
    listedSearchResults = listOfResults;
  });
}



function printSearchResults(arrayOfResults){
  resultContainer = document.getElementById("results-container");


  for(var i = 0; i < arrayOfResults.length; i++){
    song_index = i;
    song_title = listOfResults[i];
    var item = document.createElement("li");
    item.className ="result-titles";
    item.id = song_index;
    console.log(item);
    console.log(song_title);
    item.innerHTML = " + " + song_title;
    resultContainer.appendChild(item);
  }
  console.log("inside printer");

}

function printSong(song){
  $.get('https://api.soundcloud.com/tracks.json?client_id=4346c8125f4f5c40ad666bacd8e96498&q=' + song + '&limit=5', function (result) {
        listOfResults = result;
        songContainer = document.querySelector(".song-display");
        // song_id = listOfResults[0].id;
        song_title = listOfResults[0].title;
        var item = document.createElement("li");
        item.className ="song-row";
        item.innerHTML = song_title;
        songContainer.appendChild(item);
    });
}

function makePlaylist(playlist){
  for(var i = 0; i < playlist.length; i++){
    song = playlist[i];
    printSong(song);
  }
}

function addToPlaylist(song){
  printSong(song);
}



function playSong(song){
  console.log(needStop);
  if (needStop === true){
    soundManager.stopAll;
      needStop = false;
        return;
  } else {

  $.get('https://api.soundcloud.com/tracks.json?client_id=4346c8125f4f5c40ad666bacd8e96498&q=' + song + '&limit=5', function (result) {

      listOfResults = result;
      console.log(listOfResults);
      test = listOfResults[0];
      console.log("sound duration");
      console.log(result[0].duration);
      song_id = listOfResults[0].id;
      song_title = listOfResults[0].title;
      song_pic = listOfResults[0].artwork_url;
      standardPic = 'https://i1.sndcdn.com/artworks-000010016632-v6brmk-large.jpg';
      // $(".song-row").first().text(song_title);

      if (song_pic){
        $("#artist-pic").attr('src', song_pic);
      } else {
        $("#artist-pic").attr('src', standardPic);
      }

      numOfSongs = playlist.length; //3
      lastIndex = numOfSongs - 1;
      currentIndex = playlist.indexOf(song);
      console.log(currentIndex);
      nextIndex = currentIndex + 1; //1
      console.log(nextIndex);
      nextSong = playlist[nextIndex];
      startOver = playlist[0];
      console.log(song_title);
      console.log(song_id);


      // function playNext

    SC.stream(song_id, function(sound){
      sound.play({onfinish: function(){
        console.log("onfinish");
        numOfSongs = playlist.length; //3
        lastIndex = numOfSongs - 1;
        currentIndex = playlist.indexOf(song);
        console.log(currentIndex);
        nextIndex = currentIndex + 1; //1
        console.log(nextIndex);
        nextSong = playlist[nextIndex];
        startOver = playlist[0];
        console.log(nextIndex);
        sound.stop();

          if(nextIndex <= lastIndex){
            playSong(nextSong);
          } else {
            playSong(startOver);
          }
        }
    });

    $('.play-pause').on('click', function(){
      if($('.play-pause').hasClass('play')){
        sound.pause();
      } else {
        sound.resume();
      }
    });


  });
});
}
}

$(document).ready(function() {
  SC.initialize({
    client_id: '5fac89a005124d747e2d1b1fc44cc474'
  });

  $('.friend-form').hide();
  $('.results').hide();
  $('.playlist-form').show();

  addFriendShowing = false;
  newPlaylistShowing = true;
  searchShowing = false;




  window.onload = function(e){
    e.preventDefault();
    loadPlaylist();

  };

  bindEvents();
  typeWriter();
  var text = $('.user_legit_name').text();
  var length = text.length;
  var timeOut;
  var character = 0;

  function typeWriter() {
    timeOut = setTimeout(function() {
      character++;
      var type = text.substring(0, character);
      $('.user_legit_name').text(type);
      typeWriter();

      if (character == length) {
        clearTimeout(timeOut);
      }
    }, 100);
  }

  $('.play-pause').on('click', function(){
    if($('.play-pause').hasClass('play')){
      $(this).removeClass("play").addClass("pause");
    } else {
      $(this).removeClass("pause").addClass("play");
    }
  });

  $('#fast-forward').on('click', function(e){
    e.stopPropagation();
    needStop = true;
    soundManager.stopAll();
    console.log(currentIndex);
    nextIndex = currentIndex + 1; //1
    console.log(nextIndex);
    nextSong = playlist[nextIndex];
    startOver = playlist[0];

    if(nextIndex <= lastIndex){
        playSong(nextSong);
        playSong(nextSong);
      } else {
        playSong(startOver);
        playSong(startOver);
      }
    });

  $('#rewind').on('click', function(e){
    e.stopPropagation();
    needStop = true;
    soundManager.stopAll();

    nextIndex = currentIndex - 1; //1
    nextSong = playlist[nextIndex];
    goToLast = playlist[lastIndex];

    if(nextIndex < 0){
        playSong(goToLast);
        playSong(goToLast);
      } else {
        playSong(nextSong);
        playSong(nextSong);
      }
    });



  function bindEvents() {
    $('.add-friend').on('click', function(event) {
      event.preventDefault();
      console.log("hi");
      var formData = $(this).parent().parent().serialize();
      console.log(formData);
      $('#friends ul').remove();
      addBuddy(formData, displayFriends);
    });

    // $('.create-playlist').on('click', function(event){
    //   event.preventDefault();
    //   console.log("hi");
    //   var formData = $(this).parent().serialize();
    //   console.log(formData);
    //   getEmptyPlaylist(formData);
    // });


    $('.new-friend').on('click', function(){
      console.log("new friend clicked");
      $('.results').fadeOut();
      $('.playlist-form').fadeOut();
      searchShowing = false;
      newPlaylistShowing = false;
      if(addFriendShowing){
        $('.friend-form').fadeOut();
        addFriendShowing = false;
      } else {
        $('.friend-form').delay(400).fadeIn();
        addFriendShowing = true;
      }

    });

    $('.add-playlist').on('click', function(){
      $('.results').fadeOut();
      $('.friend-form').fadeOut();
      searchShowing = false;
      addFriendShowing = false;
      if(newPlaylistShowing){
        $('.playlist-form').fadeOut();
        newPlaylistShowing = false;
      } else {
        $('.playlist-form').delay(400).fadeIn();
        newPlaylistShowing = true;
      }

    });

    $('.search-songs').on('click', function(){
      console.log("hi");
      $('.friend-form').fadeOut();
      $('.playlist-form').fadeOut();
      newPlaylistShowing = false;
      addFriendShowing = false;
      if(searchShowing){
        $('.results').fadeOut();
        searchShowing = false;
      } else {
        $('.results').delay(400).fadeIn();
        searchShowing = true;
      }

    });

    $('.find-song').on('click', function(event) {
      event.preventDefault();
      $('#results-container').slideUp('100').empty();
      var formData = $(this).parent().parent().serialize();
      var buttonParent = $(this).serialize();
      console.log(buttonParent);
      console.log("FORM DATA HERE!");
      console.log(formData);
      getSearchResults(formData);
      $('#results-container').slideDown('100');
    });

    // $('.add-song').on('click', function(event) {
    //   event.preventDefault();
    //   var formData = $(this).parent().serialize();
    //   addSong(formData);
    // });



    $(document).on('click', '.result-titles', function(event){
      event.preventDefault();
      resultID = (this.id);
      songTitle = (listedSearchResults[resultID]);
      addSongFromResults(songTitle);
      $('#results-container').slideUp('100').empty();
    });

    $(document).on('click', '.change-playlist', function(event){
      event.preventDefault();
      console.log("The playlistID");
      playlistID = (this.id);
      console.log(playlistID);
      switchPlaylist(playlistID);
    });


  }

});

function addBuddy(formData, callback) {
  $.ajax({
    url: '/friends',
    data: formData,
    success: callback
  }).done(function(serverData){
    console.log(serverData);
    callback(serverData);
  });
}

function loadBuddies(callback) {
  console.log("inside loadBuddies");
  $.ajax({
    url: '/load_friends',
    type: 'GET',
    success: callback
  }).done(function(serverData){
    console.log(serverData);
    callback(serverData);
  });
}



/////// Switch Playlist //////
function switchPlaylist(playlistID) {
  console.log("inside switcher function");
  $.ajax({
    url: '/playlist/' + playlistID,
    type: 'GET'
  }).done( function(serverData) {
      console.log(serverData);
      playlist = [];
      playlist = serverData;
      if (playlist.length > 0){
        clearSongs(playlist);
        soundManager.stopAll();
        // playSong(playlist[1]);
        playSong(playlist[0]);
        console.log(playlist[0]);
        loadBuddies(displayFriends);
    }
     });
}

function getEmptyPlaylist(playlistName) {
  $.ajax({
    url: '/playlist/new',
    type: 'POST',
    data: playlistName
  }).done( function(serverData){
    console.log("inside ajax");
    preparePlaylist(serverData);
  });
}

//////// Get Search Results ////////
function getSearchResults(formData) {
  $.ajax({
    url: '/find_song',
    type: 'POST',
    data: formData
  }).done( function(serverData) {
      console.log("sd works");
      console.log(serverData);
      song_to_search = serverData;
      console.log(song_to_search);
      searchResults(song_to_search);
  });
}


/////// AJAX CALL ADD NEW SONG //////
function addSong(formData) {
  console.log("this is form data");
  console.log(formData);
  $.ajax({
    url: '/add_song',
    type: 'POST',
    data: formData
  }).done( function(formData) {
        console.log(formData);
        song = formData.song.title;
        playlist.push(song);
        toAdd = song;
        addToPlaylist(toAdd);
        console.log(playlist);
        if (playlist.length === 1){
          playSong(playlist[0]);
        }
     });
}


function addSongFromResults(formData) {
  $.ajax({
    url: '/add_song_from_search/' + formData,
    type: 'POST',
    data: formData
  }).done( function(formData) {
    song = formData.song.title;
    playlist.push(song);
    toAdd = song;
    addToPlaylist(toAdd);
    if (playlist.length === 1){
      playSong(playlist[0]);
    }
  });
}

/////// AJAX CALL LOAD SONGS //////

function loadPlaylist(){
  $.ajax({
    url: '/playlist',
    type: 'GET',
  }).done( function(data) {
    playlist = data;
    if (playlist.length > 0){
      makePlaylist(data);

      // playSong(playlist[1]);
      playSong(playlist[0]);
    }
  });
}

function createPlaylist(){
  $.ajax({
    url: '/playlist',
    type: 'GET',
  }).done( function(data) {
    playlist = data;
    if (playlist.length > 0){
      makePlaylist(data);

      // playSong(playlist[1]);
      playSong(playlist[0]);
    }
  });
}



