# Minimal web animations with p5.js

# Inspiration

#### [FLRN GIF](http://gif.flrn.nl/)
<img src="http://67.media.tumblr.com/2b4d5b520db3b83d07562f06787c0752/tumblr_njoi3r7ERT1tcuj64o1_400.gif" width="350">
<img src="http://67.media.tumblr.com/50947c77e9591db6fa6e294540d817ef/tumblr_nmeoft9T0J1tcuj64o1_400.gif" width="350">
<img src="http://67.media.tumblr.com/707cc9caf3102e60812c93d16f7edc21/tumblr_o2te20nF431tcuj64o1_400.gif" width="350">
<img src="http://66.media.tumblr.com/59a4d74a0471d12d1b70537a47d20bdb/tumblr_o3fkjkwX1q1tcuj64o1_400.gif" width="350">
<img src="http://66.media.tumblr.com/4b009327da7d84262c957a58507ab051/tumblr_o34cbne19N1tcuj64o1_400.gif" width="350">
<img src="http://67.media.tumblr.com/126ab449368bfc6b53829e96ef4bab01/tumblr_o3boi6zeiD1tcuj64o1_400.gif" width="350">

#### [FLRN Minimal](http://art.flrn.nl/)
Not animations, but would be great as animations  
<img src="http://66.media.tumblr.com/701030dbd0fd45cfec5755c436de0e94/tumblr_o6wygd16Pe1u6950qo1_1280.png" width="350">
<img src="http://67.media.tumblr.com/0ea3e26d0f5da2b5831bb7ce72c47f10/tumblr_o63yqn3BQY1u6950qo1_1280.png" width="350">

#### [Echophon](http://echophon.tumblr.com/)
<img src="http://66.media.tumblr.com/ca9006b25d0c6d7a8d154034bf2c43c1/tumblr_nj4xh6mvyk1six59bo1_540.gif" width="350">
<img src="http://67.media.tumblr.com/795564c5236254a6f9573c337a13df1b/tumblr_o7yobcI1pJ1rlaql2o6_500.gif" width="350">

#### [Light Process](http://lightprocesses.tumblr.com/)
<img src="http://67.media.tumblr.com/432e1b5b304cd388442a7a869379bd46/tumblr_nj7pwdlGBr1tf7qzao1_500.gif" width="350">
<img src="http://67.media.tumblr.com/a1d28afa11ccdec6f26a7dc6558264c5/tumblr_nxq0ykwu8X1tf7qzao1_540.gif" width="350">

#### [Kyle Stewart](http://kylerstewart.tumblr.com/)
<img src="http://67.media.tumblr.com/7cb52d452d098403b3b8976b50f48be4/tumblr_o56i1mkf1i1rpxw1qo1_r1_400.gif" width="350">
<img src="http://66.media.tumblr.com/434bbc1ca0cdb7b74fafd17240ee4d46/tumblr_o5dyc6ftxf1rpxw1qo1_1280.gif" width="350">


## Getting Started

+ Copy template example `examples/00-template` into a new directory
+ Open terminal and `cd` into your new directory
+ Start a new server with `python -m SimpleHTTPServer` and point your browser to http://localhost:8000
  + or simply open `index.html` in your web browser (GIF export will not work in this case)
+ Fill out methods `prepare()` and `drawFrame()` with your custom animation
+ ...
+ Profit!

## Examples
Projects included in the `examples` folder (with hopefully enough comments to make sense)

![01-simple](examples/01-simple/output.gif)
![02-waves](examples/02-waves/output.gif)

![03-square](examples/03-square/output.gif)
![04-moons](examples/04-moons/output.gif)

![05-cubes](examples/05-cubes/output.gif)

### Code Kitchen Live Coding Example [June 23rd 2016]
Today we are going to create...

![demo](presentation/demo-finished/output.gif)

### A note on GIF output
We need to use a simple HTTP server in order for GIF export to work - web workers don't work from `file://` due to browser security.

    $ python -m SimpleHTTPServer

__Some issues exist with export on retina displays__  
Haven't quite solved these yet, sorry.
