/*
 * Simple bouncy ball animation
 */

//== animation timing ==
var framesPerSecond = 30;
var numFrames = 2*framesPerSecond; // 2 seconds

//== animation tuning params ==
var backColor = "#000000";
var foreColor = "#ffffff";
var radius;
var bounceHeight;

//== Animation Setup ==
function prepare() {
  // make animation parameters relative to frame size
  // this allows the frame size to change without having to update your
  // animation code
  // very important for GIF output, since it doesn't match visual output
  radius = width * 0.1; // bouncy ball is 20% size of frame

  // determine how high we want the ball to bounce
  // how does 80% of the frame sound?
  bounceHeight = (height - radius*2.0) * .80; // figure in size of ball

  // prep drawing commands
  fill(foreColor); // fill the ball with this color
  noStroke(); // don't outline the shape
}

//== Single Animation Frame ==
function drawFrame(perc) {
  // clear frame - p5.js doesn't automatically do this for you
  background(backColor);

  // determine position of bouncy ball
  // use animation percentage to determine radius: 0 - PI
  // remember upwards is backwards ;)
  var hOffset = -bounceHeight * sin(PI*perc);

  // move to bottom of screen
  translate(width/2, height-radius);

  // draw circle - width is diameter (2 x radius)
  ellipse(0, hOffset, radius*2.0, radius*2.0);
}






//==========================================================
//== PAY NOT ATTENTION TO THE MAN BEHIND THE CURTAIN =======
// If you're interested, this code sets up animation scene
// and handles UI interaction of player. It also performs
// the GIF export. Stick to the above methods if you just
// want to make cool animations.
//==========================================================
// settings
var previewSize = 640;
var renderSize = 320;

// state
var fCount = 0; // base animation on frame count
var rendering = false; // are we generating a GIF?
var rFCount = 0; // rendering frame count

// UI refs
var ctx;
var timeline;
var play, pause;

function setup() {
  ctx = createCanvas(640, 640);
  ctx.parent('renderView');

  // prep UI
  bindPlayerButtons();

  // custom animation setup
  frameRate(framesPerSecond);
  prepare();
}

function draw() {
  if (rendering) {

    // == GIF RENDERING ==
    // update timeline
    timeline.style.width = (rFCount/numFrames) * 100 + "%";

    // base animation on seperate frame count
    var perc = map(rFCount, 0, numFrames, 0, 1.0);
    drawFrame(perc);

    gif.addFrame(ctx.elt, {delay:(1.0/framesPerSecond)*1000, copy: true});

    rFCount++;
    if (rFCount > numFrames) {
      // complete
      noLoop(); // stop animation and wait for render to complete
      gif.render();
    }

  } else {

    // == MAIN ANIMATION LOOP ==
    // animation loop control
    fCount++; // have to store our own frame count since we can't reset p5s :(
    if (fCount > numFrames) fCount = 0; // loop animation

    // update timeline
    timeline.style.width = (fCount/numFrames) * 100 + "%";

    // animation timing is based on number of frames
    // map() is a great function to time animations
    // we use it here to determine the percentage of the animation we are at
    var perc = map(fCount, 0, numFrames, 0, 1.0);
    drawFrame(perc);

  }
}

function bindPlayerButtons() {
  // timeline track
  timeline = document.getElementById('timeline');
  var rewind = document.getElementById('rewind');
  rewind.onclick = function(e) {
    e.preventDefault();
    fCount = 0;
  };

  // pause
  pause = document.getElementById('pause');
  pause.onclick = function(e) {
    e.preventDefault();
    noLoop();
    play.style.display = 'inline';
    pause.style.display = 'none';
  };

  // play
  play = document.getElementById('play');
  play.style.display = 'none';
  play.onclick = function(e) {
    e.preventDefault();
    loop();
    play.style.display = 'none';
    pause.style.display = 'inline';
  };

  // export
  var exportButton = document.getElementById('export');
  var exportToast = document.getElementById('export-toast');
  exportButton.onclick = function(e) {
    e.preventDefault();
    exportButton.style.display = 'none';
    exportToast.style.display = 'block';
    noLoop();
    setTimeout(function() { // wait for animation to stop
      renderGIF(function() {
        exportButton.style.display = 'inline';
        exportToast.style.display = 'none';
      });
    }, 100);
  };
}

var gif;
function renderGIF(completion) {
  // trickiest part in the script
  // generates a gif by running through the animation code frame-by-frame
  // and saving to a GIF image.
  gif = new GIF({
    workers: 2,
    quality: 10,
    width: renderSize,
    height: renderSize,
  });
  gif.on('finished', function(blob) {
    window.open(URL.createObjectURL(blob));

    // reset and complete
    rendering = false;
    resizeCanvas(previewSize, previewSize);
    frameRate(framesPerSecond);
    prepare(); // let user code reconfigure back to original
    setTimeout(function() { // wait a bit to restart animation
      loop();
      completion();
    }, 100);
  });
  gif.on('progress', function(p) {
    timeline.style.width = p * 100 + "%";
  });

  // resize canvas and prep animation
  rFCount = 0;
  resizeCanvas(renderSize, renderSize);
  frameRate(100); // blow through frames quickly
  rendering = true; // tell main animation loop to do renders instead
  prepare(); // let user code refigure its settings based on new canvas
  loop();
}
