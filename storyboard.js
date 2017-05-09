// Global Settings
var indicators = false;

// Initialize Media (Last items initialized are on top)
image = new Image({file: '078-0045.jpg'});
mash = new Video({file: 'mash.mp4', volume: 0.01});
engine = new Video({file: 'engine.mp4', startTime: 1.0});
dp = new Video({file: 'dp.mp4'});
ski = new Video({file: 'ski.mp4'});
slide = new Video({file: 'slide.mp4'});
smetana = new Audio({file: 'smetana.mp3'});
md = new Markdown({file: 'markdown.md'});

transitions.push(function(){
	mash.in(1000);
	smetana.in();
	md.in(500);
});

transitions.push(function(){
	mash.out(1000);
	engine.in(1000);
});

transitions.push(function(){
	engine.out();
	slide.in();
	smetana.out();
});

transitions.push(function(){
	slide.out(1000);
	image.in(1000);
	md.out();
});

transitions.push(function(){
	image.out(1000);
});