/*
 * "Many Moons"
 * Originaly part of my #100DaysOfGenerativeArt project
 * https://www.instagram.com/p/BD6EUOXBBCp
 */

//== animation timing ==
var framesPerSecond = 30;
var numFrames = 2*framesPerSecond;

//== animation tuning params ==
var backColor = "#222222";
var foreColor = "#eeeeee";
var count = 5;
var rad;
var space;
var thick;
var pg;

//== Animation Setup ==
function prepare() {
  rad = width * 0.1;
  space = width * 0.05;
  thick = round(width * 0.005);

  // pre-create graphics context for moon cell drawing
  pg = createGraphics(rad*2+4, rad*2+4);

  fill(foreColor);
  noStroke();
}

//== Single Animation Frame ==
function drawFrame(perc) {
  background(backColor);

  // center grid of moons
  translate(width/2, height/2);
  var offset = space + rad; // spacing between cell centers (amount to translate)
  // move to position 0 (top left) in grid
  translate(-offset*(int)(count/2), -offset*(int)(count / 2.0));

  // determine animation offsets - cascade moon phases
  var step = rad/count;
  var off = rad - perc * 2*rad;

  for (var col = 0; col < count; ++col) {
    push();

    // step the offset of the animation so each column is in
    // a different phase
    var off2 = off;

    for (var row = 0; row < count; row++) {
      // use a graphics context to draw each moon isolated by itself
      // moon arcs were drawing over moons to their left otherwise
      image(thatsNoMoon(rad, off2), -rad, -rad);

      translate(offset, 0);
      off2 -= step; // each moon in the row should be in a different phase
    }
    pop();
    translate(0, offset);
    off -= step;
  }
}

function thatsNoMoon(rad, phase) {
  pg.background(backColor);

  var x = rad - 2.0;
  var y = rad - 2.0;

  // draw moon back layer
  pg.noStroke();
  pg.fill(foreColor);
  pg.ellipse(x, y, rad, rad);

  // draw phase
  // use ellipse to draw background color (knockout)
  pg.fill(backColor);
  var of = phase;
  while (of < -rad)
    of += rad*2;
  pg.ellipse(of+x, y, rad, rad);

  // outline
  pg.stroke(foreColor);
  pg.strokeWeight(thick);
  pg.noFill();
  pg.ellipse(x, y, rad, rad);

  return pg
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

  var size = renderSize / window.devicePixelRatio; // figure in retina displays
  resizeCanvas(size, size);
  
  frameRate(100); // blow through frames quickly
  rendering = true; // tell main animation loop to do renders instead
  prepare(); // let user code refigure its settings based on new canvas
  loop();
}
