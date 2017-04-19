// Global Settings
var indicators = true;

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