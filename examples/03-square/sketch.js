/*
 * p5.js animation template
 */

//== animation timing ==
var framesPerSecond = 30;
var numFrames = 4 * framesPerSecond;

//== animation tuning params ==
var backColor = "#ffffff";
var foreColor = "#222222";
var rows = 12;
var side;
var space = 2;

//== Animation Setup ==
function prepare() {
  noStroke();
  fill(foreColor);
  rectMode(CENTER);

  // make cell size relative to frame width
  side = (int)(width*0.0666);
}

//== Single Animation Frame ==
function drawFrame(perc) {
  background(backColor);

  var cell = side + space; // a cell considers its padding
  // determine amount needed to inset animation (nice border)
  var offset = width - ((rows - 1) * side + (rows - 1) * space);
  translate(offset/2, offset/2);

  var off = perc * TWO_PI;
  for (var row = 0; row < rows; row++) {

    // so that all rows don't behave the same - offset animation per row
    var off2 = cos(off + row*PI/rows);

    for (var col = 0; col < rows; col++) {
      var step = map(col, 0, rows, 0, PI);
      var mult = sin(off2+step);

      rect(cell*row, cell*col, side*mult, side*mult, 24-22*abs(mult));
    }
  }
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
