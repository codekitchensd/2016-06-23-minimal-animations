/*
 * "Many Moons"
 * Originaly part of my #100DaysOfGenerativeArt project
 * https://www.instagram.com/p/BD6EUOXBBCp
 */

//== animation timing ==
var framesPerSecond = 30;
var numFrames = 2*30; // 2 seconds

//== animation tuning params ==
var backColor = "#222222";
var foreColor = "#eeeeee";
var rad = 60.0;
var space = 32.0;
var thick = 3.0;
var count = 5;

function setup() {
  createCanvas(640, 640);
  frameRate(framesPerSecond);

  noStroke();
  smooth();
}

function draw() {
  background(backColor);

  translate(width/2, height/2);
  var offset = space + rad;
  translate(-offset*(int)(count/2), -offset*(int)(count / 2.0));

  var step = rad/count;
  var off = rad-map(frameCount, 0, numFrames, 0, 2*rad);

  for (var i = 0; i < count; i++) {
    push();

    var off2 = off;
    for (var j = 0; j < count; j++) {
      // back
      noStroke();
      fill(foreColor);
      ellipse(0, 0, rad, rad);

/*
      // inner
      fill(backColor);
      var of = off2;
      while (of < -rad)
        of += rad*2;
      var reduce = map(of, 0, -rad, 0, PI/2.0);
      arc(of, 0, rad, rad, -PI+reduce, PI-reduce);
      if (of < 0)
        ellipse(of, 0, of+rad, of+rad);

      // outline
      stroke(foreColor);
      strokeWeight(thick);
      noFill();
      ellipse(0, 0, rad, rad);

      translate(offset, 0);
      off2 -= step;
      */
    }
    pop();
    translate(0, offset);
    off -= step;
  }
}
