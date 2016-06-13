/*
 * Simple animation with periodic motion
 */

//== animation timing ==
var framesPerSecond = 30;
var numFrames = 4*framesPerSecond; // 4 seconds
var fCount = 0; // base animation on frame count
var loops = true; // repeat animation?

//== animation tuning params ==
var backColor = "#000000";
var foreColor = "#ffffff";
var radius = 100;

//== Animation Frame ==
function animateFrame(perc) {
  // use animation percentage to determine radius: 0 - PI
  var rad = radius * sin(PI*perc);

  // clear frame - p5.js doesn't automatically do this for you
  background(backColor);

  // move to center
  translate(width/2, height/2);

  // select fill color for drawing
  fill(foreColor);
  noStroke(); // don't outline the shape

  // draw circle
  ellipse(0, 0, rad, rad);
}

//== Setup ==
var record = true;
var gif = new GIF({
  workers: 2,
  quality: 10,
});
var ctx;

function setup() {
  ctx = createCanvas(200, 200);
  frameRate(framesPerSecond);
}

function draw() {
  // animation loop control
  fCount++; // have to store our own frame count since we can't reset p5s :(
  if (fCount > numFrames) {
    fCount = 0; // restart animation

    if (!loops) noLoop(); // stop looping - if set

    if (record) {
      record = false; // stop recording
      gif.on('finished', function(blob) {
        window.open(URL.createObjectURL(blob));
      });
      gif.render();
    }
  }

  // animation timing is based on number of frames
  // map() is a great function to time animations
  // we use it here to determine the percentage of the animation we are at
  var perc = map(fCount, 0, numFrames, 0, 1.0);
  animateFrame(perc);

  // gif recording
  if (record) gif.addFrame(ctx.elt, {delay: 33, copy: true});
}
