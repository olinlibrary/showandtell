currentTransition = -1;
lastTransition = -1;
transitionCount = 0;

playing = false;
ready = false;

transitioninprogress = false;

function updateIndicators(){
  nt = transitions[currentTransition];

  $('indicator#status').html(playing?"Playing":"Paused");
  $('indicator#transitionstatus').html(transitioninprogress ? "In Progress" : "Done");
  $('indicator#load').html(ready?"Ready":"Loading");
  $('indicator#transition').html(currentTransition+1);
  $('indicator#transitioncount').html(transitionCount);

  // Current Visual
  $('indicator#currentvisual').html('');
  if(nt && nt.visual.id !== false){
    if($('elements #'+nt.visual.id).is('video')){
      $('indicator#currentvisual').html($('elements #'+nt.visual.id).attr('src'));
      $('indicator#visualaudio').html(nt.visual.volume);
    }
    else if($('elements #'+nt.visual.id).is('img')){
      $('indicator#currentvisual').html($('elements #'+nt.visual.id).attr('src'));
      $('indicator#visualaudio').html('');
    }
  }

  // Current Audio
  $('indicator#currentaudio').html('');
  if(nt && nt.audio.id !== false)
    $('indicator#currentaudio').html($('elements #'+nt.audio.id).attr('src'));
}

function transition(reverse = false){
  if(transitioninprogress){
    console.log('  Err: Transition in Progress');
    return;
  }
  if(!ready){
    console.log('  Err: Not Loaded Yet');
    return;
  }

  oldTransition = currentTransition;

  if(reverse){
    if(currentTransition >= 0){
      currentTransition--;
      console.log('BACKWARD to Transition '+(currentTransition+1));
    }else
      console.log('  Err: Already at Beginning');
  }
  else{
    if(currentTransition < transitionCount){
      currentTransition++;
      console.log('FORWARD to Transition '+(currentTransition+1));
    }else
      console.log('  Err: Already at End');
  }

  playing = true;
  ot = transitions[oldTransition];
  nt = transitions[currentTransition];

  // If Change in Visual
  if(!ot || !nt || nt.visual.id != ot.visual.id){

    fade = (nt && nt.visual.fade) ? nt.visual.fade : 0;
    
    // Visual Transition Out
    if(ot && ot.visual.id !== false)
      $('elements #'+ot.visual.id).animate({opacity: 0.0, volume: 0.0}, {
        duration: fade,
        specialEasing: {
          opacity: 'linear',
          volume: 'easeOutExpo'
        },
        start: function(){
          transitioninprogress++;
        },
        done: function(){
          transitioninprogress--;
          if($(this).is('video'))
            $(this).get()[0].pause();
        }
      });

    // Visual Transition In
    if(nt && nt.visual.id !== false)
      $('elements #'+nt.visual.id).animate({opacity: 1.0, volume: nt.visual.volume}, {
        duration: fade,
        specialEasing: {
          opacity: 'linear',
          volume: 'easeOutExpo'
        },
        start: function(){
          transitioninprogress++;
          if($(this).is('video'))
            $(this).get()[0].play();
        },
        done: function(){
          transitioninprogress--;
        }
      });
  }

  // If Change in Audio
  if(!ot || !nt || nt.audio.id != ot.audio.id){

    fade = (nt && nt.audio.fade) ? nt.audio.fade : 0;
    
    // Audio Transition Out
    if(ot && ot.audio.id !== false)
      $('elements #'+ot.audio.id).animate({opacity: 0.0, volume: 0.0}, {
        duration: fade,
        easing: 'easeOutExpo',
        start: function(){
          transitioninprogress++;
        },
        done: function(){
          transitioninprogress--;
          $(this).get()[0].pause();
        }
      });

    // Audio Transition In
    if(nt && nt.audio.id !== false)
      $('elements #'+nt.audio.id).animate({opacity: 1.0, volume: nt.audio.volume}, {
        duration: fade,
        easing: 'easeInExpo',
        start: function(){
          transitioninprogress++;
          $(this).get()[0].play();
        },
        done: function(){
          transitioninprogress--;
        }
      });
  }
}

function togglePlayPause(){
  nt = transitions[currentTransition];
  if(!nt) return console.log("  Err: Can't Pause, Not Started");

  if(playing){
    console.log('PAUSE Transition '+(currentTransition+1));
    $.each($('video,audio').get(), function(i, val){
      val.pause();
    });
  }

  else{
    console.log('PLAY Transition '+(currentTransition+1));
    if($('elements #'+nt.visual.id).length && $('elements #'+nt.visual.id).is('video'))
      $('elements #'+nt.visual.id).get()[0].play();
    if($('elements #'+nt.audio.id).length)
      $('elements #'+nt.audio.id).get()[0].play();
  }

  playing = !playing;
}

function rewindAll(){
  console.log('REWIND ALL');
  $.each($('video,audio').get(), function(i, val){
    val.currentTime = 0;
  });
}

// Cue up all media in a hidden state
function loadMedia(){
  idkey = 0;
  lastvisual = {id: false, fade: 0};
  lastaudio = {id: false, fade: 0};

  // For Each Transition
  $.each(transitions, function(key, value){

    // Add Visual
    if(typeof value.visual != "undefined"){
      file = value.visual.file;

      if(value.visual.type == "video"){
        $('elements').append('<video id='+idkey+' src="media/mp4/'+file+'" loop></video>');
        lastvisual.volume = value.visual.volume ? value.visual.volume : 0.0;
        lastvisual.id = idkey++;
      }

      else if(value.visual.type == "image"){
        $('elements').append('<img id='+idkey+' src="media/'+file+'">');
        lastvisual.id = idkey++;
      }

      else
        lastvisual.id = false;

      lastvisual.fade = value.visual.fade ? value.visual.fade : 0;
    }

    // Add Audio
    if(typeof value.audio != "undefined"){
      file = value.audio.file;

      if(file){
        $('elements').append('<audio id='+idkey+' src="media/mp3/'+file+'"></audio>');
        lastaudio.id = idkey++;
        lastaudio.volume = value.audio.volume ? value.audio.volume : 1.0;
      }
      
      else
        lastaudio.id = false;

      lastaudio.fade = value.audio.fade ? value.audio.fade : 0;
    }
    $('video,audio').animate({volume: 0.0}, 0);  // Set starting audio to 0 for all clips

    // Clone Objects into Transitions Array
    transitions[key]["visual"] = $.extend({}, lastvisual);
    transitions[key]["audio"] = $.extend({}, lastaudio);
    transitionCount++;
  });
}

$(document).ready(function(){
  loadMedia();

  $(document).keydown(function(e){
    if(e.which == 39) transition();
    if(e.which == 37) transition(true);
    if(e.which == 32) togglePlayPause();
    if(e.which == 38) rewindAll();
  });

  // Check when Loaded
  loadcheck = setInterval(function(){
    ready = true;
    $.each($('video,audio').get(), function(i, val){
      if(val.readyState != 4) ready = false;
    });
    if(ready){
      clearInterval(loadcheck);
      console.log('LOADED');
      $('body').addClass('ready');
    }
  }, 5);

  // Setup Indicators
  if(indicators)
    setInterval(updateIndicators, 5);
  else
    $('#indicators').hide();

});