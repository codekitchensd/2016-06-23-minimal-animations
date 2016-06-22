/*
 * Live Coding example - Code Kitchen [2016-06-23]
 */

//== animation timing ==
var framesPerSecond = 30;
var numFrames = 2*framesPerSecond;

//== animation tuning params ==
// var backColor = "#262626";
var backColor = "rgba(38, 38, 38, 0.6)";
var foreColor = "#dcdcd2";
var cellCount = 5; // end cells count as 1/2
var cellCirc, cellRadius;

//== Animation Setup ==
function prepare() {
  // cell circumference related to count/width
  cellCirc = width / cellCount;
  cellRadius = cellCirc / 2.0;

  fill(foreColor); // fill the ball with this color
  noStroke(); // don't outline the shape
}

//== Single Animation Frame ==
function drawFrame(perc) {
  background(backColor);

  // determine rotation based on animation percentage
  // simple motion
  // var rot = map(perc, 0, 1, 0, TWO_PI);
  // more interesting motion - animation curve
  // 0 - PI/2 only want forward motion
  // var rot = PI/3.0 * -sin(map(perc, 0, 1, 0, PI/2.0));
  // advanced animation timing
  var rot;
  if (perc < 0.25) {
    rot = 0;
  } else if (perc < 0.5) {
    rot = PI/2.0 * -sin(map(perc, 0.25, 0.5, 0, PI/2.0));
  } else if (perc < 0.75) {
    rot = PI/2.0;
  } else {
    rot = PI/2.0 + PI/2.0 * -sin(map(perc, 0.75, 1, 0, PI/2.0));
  }

  // draw staggered grid
  var count = 6;
  translate(0, -0.25*cellRadius);
  for (var row = 0; row <= count; row++) {
    push();
    if (row % 2 == 0)
      translate(cellRadius, 0);
    for (var col = 0; col < count; col++) {
      drawHexagon(cellRadius, rot);
      translate(cellCirc, 0);
    }
    pop();
    translate(0, cellRadius*1.75);
  }
}

function drawHexagon(radius, rotation) {
  beginShape();
  // sweep evenly and set vertices
  for (var i = 0; i < 6; i++) {
    var angle = rotation + i * (TWO_PI/6.0);
    var x = radius * sin(angle);
    var y = radius * cos(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
}













//==========================================================
//== PAY NOT ATTENTION TO THE MAN BEHIND THE CURTAIN =======
// If you're interested, this code sets up animation scene
// and handles UI interaction of player. It also performs
// the GIF export. Stick to the above methods if you just
// want to make cool animations.
//==========================================================
// settings
var previewSize = 320;
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
  ctx = createCanvas(previewSize, previewSize);
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

  var size = renderSize / window.devicePixelRatio; // figure in retina displays
  resizeCanvas(size, size);

  frameRate(100); // blow through frames quickly
  rendering = true; // tell main animation loop to do renders instead
  prepare(); // let user code refigure its settings based on new canvas
  loop();
}
