// Todo
// - Debug rough transitions, pause/play issues
// - More Media Types (Iframe)
// - Document changes

////////////////////////////
// Handle Transitions
////////////////////////////

  var loadlock = 0;
  var transitions = [];
  var media = {};

  var indicators = false;
  var playing = false;
  var transitionlock = false;
  var currentslide = -1;
  var reversing = false;
  var loaded = false;

  function activateTransition(reverse = false){

    if(transitionlock)
      return console.log('  ERROR: Transition in Progress');
    if(!loaded)
      return console.log('  ERROR: Media Loading');

    if(!playing)
      togglePlayPause();

    if(reverse){
      if(currentslide >= 0){
        console.log('BACKWARD to Slide '+(currentslide+1));

        reversing = true;
        transitions[currentslide]();

        currentslide--;
      }else
        console.log('  ERROR: Already at Beginning');
    }

    else{
      if(currentslide < transitions.length-1){
        console.log('FORWARD to Slide'+(currentslide+1));

        currentslide ++;

        reversing = false;
        transitions[currentslide]();
      }else
        console.log('  ERROR: Already at End');
    }

  }

  function togglePlayPause(){
    playing = !playing;
    
    for (var i in media){
      if(!playing)
        media[i].pause();
      else if(media[i].visible)
        media[i].play();
    }
  }

  function rewindAll(){
    for (var i in media){
      media[i].rewind();
    }
  }


////////////////////////////
// User Interactions
////////////////////////////

  function updateIndicators(){
    $('indicator#status').html(playing?"Playing":"Paused");
    $('indicator#transitionstatus').html(transitionlock ? "In Progress" : "Done");
    $('indicator#load').html(loaded?"Ready":"Loading");
    $('indicator#transition').html(currentslide+1);
    $('indicator#transitioncount').html(transitions.length);
    $('indicator#transitiondirection').html(reversing?"Reverse":"Forward");

    $('timeindicators').html('');
    for (var i in media){
      if(media[i].visible)
        $('timeindicators').append(i+': '+media[i].currentTime()+'<br>');
    }
  }

  $(document).ready(function(){

    $(document).keydown(function(e){
      if(e.which == 39) activateTransition();
      if(e.which == 37) activateTransition(true);
      if(e.which == 32) togglePlayPause();
      if(e.which == 38) rewindAll();
    });

    if(indicators)
      setInterval(updateIndicators, 10);
    else
      $('#indicators').remove();

    // Build List of Media
    for (var i in window)
      if(window[i] && window[i].mediaLoaded)
        media[i] = window[i];
      
    // Check if Media Loaded
    loadcheck = setInterval(function(){
      console.log('Checking if Loaded...');
      for (var i in media)
        if(media[i].mediaLoaded() === false)
          return false;
      loaded = true;
      $('body').addClass('ready');
      console.log('Loaded!');
      clearInterval(loadcheck);
    }, 100);
  });


////////////////////////////
// Media Type Objects
////////////////////////////

  function Media(params){
    this.visible = false;
  	this.file = params.file;
    this.volume = params.volume ? params.volume : 0.0;
    this.opacity = params.opacity ? params.opacity : 1.0;
    this.startTime = params.startTime ? params.startTime : 0.0;
    this.fade = 0;
  	this.loadMedia();
  }
  Media.prototype.loadMedia = function(){}
  Media.prototype.mediaLoaded = function(){ return true;}
  Media.prototype.currentTime = function(){ return true;}
  Media.prototype.play = function(){}
  Media.prototype.pause = function(){}
  Media.prototype.rewind = function(){}
  Media.prototype.reset = function(){ this.dom.animate({opacity:0.0, volume: 0.0}, 0);}
  Media.prototype.in = function(length){
    this.fade = length;

    if(reversing)
      return this.transitionOut();
    this.transitionIn();
  }
  Media.prototype.out = function(length){
    this.fade = length;

    if(reversing)
      return this.transitionIn();
    this.transitionOut();
  }
  Media.prototype.transitionIn = function(){
    this.dom.animate({opacity: this.opacity, volume: this.volume}, {
      duration: this.fade,
      specialEasing: {
        opacity: 'linear',
        volume: 'easeOutExpo'
      },
      start: () => {
        transitionlock++;
        this.play();
        this.visible = true;
      },
      done: () => {
        transitionlock--;
      }
    });
  }
  Media.prototype.transitionOut = function(){
    this.dom.animate({opacity: 0.0, volume: 0.0}, {
      duration: this.fade,
      specialEasing: {
        opacity: 'linear',
        volume: 'easeOutExpo'
      },
      start: () => {
        transitionlock++;
      },
      done: () => {
        transitionlock--;
        this.visible = false;
        this.pause();
      }
    });
  }

  function Video(params){ Media.call(this, params);}
  Video.prototype = Object.create(Media.prototype);
  Video.prototype.loadMedia = function(){
    this.dom = $('<video src="media/'+this.file+'" loop></video>').appendTo('body');
    this.rewind();
    this.reset();
  }
  Video.prototype.mediaLoaded = function(){ return this.dom.get()[0].readyState == 4;}
  Video.prototype.play = function(){ this.dom.get()[0].play();}
  Video.prototype.pause = function(){ this.dom.get()[0].pause();}
  Video.prototype.currentTime = function(){ return this.dom.get()[0].currentTime;}
  Video.prototype.rewind = function(){ this.dom.get()[0].currentTime = this.startTime;}

  function Image(params){ Media.call(this, params);}
  Image.prototype = Object.create(Media.prototype);
  Image.prototype.loadMedia = function(){
    this.dom = $('<img src="media/'+this.file+'" />').appendTo('body');
    this.reset();
  }

  function Markdown(params){ Media.call(this, params);}
  Markdown.prototype = Object.create(Media.prototype);
  Markdown.prototype.loadMedia = function(){
    jQuery.get('media/'+this.file, (data) => {
        var converter = new showdown.Converter(),
        html = converter.makeHtml(data);
        this.dom = $('<div class=md>'+html+'</div>').appendTo('body');
        this.reset();
    });
  }

  function Audio(params){ Video.call(this, params);}
  Audio.prototype = Object.create(Video.prototype);
  Audio.prototype.loadMedia = function(){
    this.volume = this.volume ? this.volume : 1.0; // Don't allow zero volume audio clips
    this.dom = $('<audio src="media/'+this.file+'" loop></video>').appendTo('body');
    this.rewind();
    this.reset();
  }