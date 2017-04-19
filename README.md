# Show and Tell

_Immersive multimedia presentations._

Show and Tell is a HTML & Javascript application designed to run in the web browser, locally on a computer. The application is optimized for instant transitions with no perceptible media latency when switching between media sources. Show and Tell _is not optimized to be hosted on the internet_ and may load very slowly & use tons of bandwidth if put online.

### Controls

* _Right Arrow_ - Activate the next transition
* _Left Arrow_ - Activate the previous transition
* _Up Arrow_ - Rewind all media to the beginning
* _Space Bar_ - Play / Pause

### Building a Presentation

As Show and Tell is an offline app, you must have all of your media locally. 

Everything you need to configure is in the `storyboard.js` file.

### Supported Media

```
Video
  supported formats: mp4
Image
  supported formats: jpg, png, gif
Audio
  supported formats: mp3
```

Note that other audio & video formats are supported in some browsers by the HTML5 media player, but these are the only one with true cross-browser compatibility.

### Transitions

The storyboard in Show and Tell is based on a series of transitions, as a list of Javascript objects. Transitions consist of either an audio component, a visual component, or both.


#### Putting it all together

An example storyboard.js file is as follows:

```
// Initialize Media (Last items initialized are on top)
image = new Image({file: '078-0045.jpg'});
mash = new Video({file: 'mash.mp4', volume: 1.0});
engine = new Video({file: 'engine.mp4', startTime: 1.0});
dp = new Video({file: 'dp.mp4'});
ski = new Video({file: 'ski.mp4'});
slide = new Video({file: 'slide.mp4'});
smetana = new Audio({file: 'smetana.mp3'});

transitions.push(function(){
  mash.in(1000);
  smetana.in();
});

transitions.push(function(){
  mash.out(1000);
  engine.in(1000);
});

transitions.push(function(){
  engine.out(0);
  slide.in(0);
  smetana.out(10000);
});

transitions.push(function(){
  slide.out(1000);
  image.in(1000);
});

transitions.push(function(){
  image.out(1000);
});
```