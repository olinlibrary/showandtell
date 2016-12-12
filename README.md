# Live Cinema

_Immersive multimedia presentations._

Live Cinema is a HTML & Javascript application designed to run in the web browser, locally on a computer. The application is optimized for instant transitions with no perceptible media latency when switching between media sources. Live Cinema _is not optimized to be hosted on the internet_ and may load very slowly & use tons of bandwidth if put online.

### Controls

* _Right Arrow_ - Activate the next transition
* _Left Arrow_ - Activate the previous transition
* _Up Arrow_ - Rewind all media to the beginning
* _Space Bar_ - Play / Pause

### Building a Presentation

As Live Cinema is an offline app, you must have all of your media locally. 

Everything you need to configure is in the `storyboard.js` file.

### Supported Media

```
visual
   type: video
     supported formats: mp4
   type: image
     supported formats: jpg, png, gif
audio
   supported formats: mp3
```

Note that other audio & video formats are supported in some browsers by the HTML5 media player, but these are the only one with true cross-browser compatibility.

### Transitions

The storyboard in live cinema is based on a series of transitions, as a list of Javascript objects. Transitions consist of either an audio component, a visual component, or both.

#### Example Transitions

Switch the visual to the video clip `atrium.mp4` with a 1000 ms (1 sec) fade. Do nothing to the current audio track.
```
visual: {type: "video", file: "atrium.mp4", fade: 1000}
```

Switch the visual to the video clip `atrium.mp4` and play the audio from the video clip at 75% volume. Do nothing to the current audio track.
```
visual: {type: "video", file: "atrium.mp4", volume: 0.75}
```

Switch the visual to the image `atrium.jpg`. Do nothing to the current audio track.
```
visual: {type: "image", file: "atrium.jpg"}
```

Switch the audio clip to `hello.mp3`. Do nothing to the current visual.
```
audio: {file: "hello.mp3"}
```

Hide the current visual. Do nothing to the current audio track.
```
visual: false
```

Fade out and stop the current audio clip over 5 sec. Do nothing to the current visual.
```
audio: {file: false, fade: 5000}
```

#### Combining Audio & Video Transitions

Switch the visual to the video `360.mp4` & switch the audio clip to `lcd.mp3`.
```
visual: {type: "video", file: "360.mp4"},
audio: {file: "lcd.mp3"}
```

Switch the visual to the video `360.mp4`, play the audio from the video clip at 100% volume & stop the current audio clip.
```
visual: {type: "video", file: "360.mp4", volume: 1.0},
audio: false
```

Switch the audio clip to `lcd.mp3` & hide the current visual.
```
audio: {file: "lcd.mp3"},
visual: false
```

#### Putting it all together

An example storyboard.js file is as follows:

```
var transitions = [
	{
		visual: {type: "image", file: "everything-but-books.jpg", fade: 5000}
	},{
		visual: {type: "video", file: "drive-up.mp4", volume: 0.5}
	},{
		visual: {type: "video", file: "360.mp4"},
		audio: {file: "lcd-dyc.mp3"}
	},{
		visual: {type: "video", file: "atrium.mp4"}
	},{
		visual: {type: "video", file: "leaving-emerald-cove.mp4"}
	},{
		audio: {file: "lcd-sg.mp3"},
		visual: false
	},{
		audio: {file: "lcd-icc.mp3"}
	},{
		audio: {file: false, fade: 5000}
	},{
		visual: {type: "video", file: "utility-wall-2.mp4"}
	},{
		visual: {type: "video", file: "utility-wall-3.mp4"}
	}
];
```