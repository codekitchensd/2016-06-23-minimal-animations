/*
 * "Sine Waves"
 * Originaly part of my #100DaysOfGenerativeArt project
 * https://www.instagram.com/p/BD_UcWKBBJ1
 */

//== animation timing ==
var framesPerSecond = 30;
var numFrames = 3*30; // 3 seconds

//== animation tuning params ==
var backColor = "#eeeeee";
var foreColor = "#000000";
var lines = 12;
var weight = 42;

var maxHeight = 200;

function setup() {
  createCanvas(640, 640);
  frameRate(framesPerSecond);
  smooth();
  noStroke();
}

function draw() {
  background(backColor);

  // draw lines
  fill(foreColor);
  translate(width/2, height/2); // move to center
  translate(-weight*((lines-1)/2.0)+weight/4.0, 0); // move to column 1 position - artfully frame with a border

  // animation timing: vary y-offset based on frame count - cycle from 0 to 2PI
  var yOff = map(frameCount, 0, numFrames, 0, TWO_PI);
  for (var i = 0; i < lines; i++) {
    // determine column height for position
    var y = maxHeight * sin(yOff);

    // var y = 200*sin(yOff+map(i,0,lines,0,PI/1.0));

    // rect: x, y, width, height
    // drawn as current position equal to center of line
    console.log(y);
    // rect(-weight/2, -y, weight/2, y);

    // rect(-weight/2, -80+y, weight/2, 160-y*2.0);


    // move to next horizontal column position
    translate(weight, 0);
  }
}
