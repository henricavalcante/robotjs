var five = require('johnny-five');
var _ = require('lodash');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var routes = require('./routes');
var socket = require('./routes/socket');
var board = new five.Board();

var motors = [
  {
    side: 'right',
    pins: {
      pwm: 6,
      dir: 4,
      cdir: 7
    }
  },
  {
    side: 'left',
    pins: {
      pwm: 5,
      dir: 2,
      cdir: 3
    }
  }
];

board.on('ready', function() {
  var led = new five.Led(13);
  led.strobe();

  _.each(motors, function(motor) {

    motor.five = five.Motor({
      pins: motor.pins
    });
    board.repl.inject({
      motor: motor.five
    });

  });

  init();
});

function init() {

  var update = function() {

    var sensor = { direction: 'front' }

    var m = {};
    m.l = _.find(motors, { side: 'left' }).five;
    m.r = _.find(motors, { side: 'right' }).five;

    var power = 128;

    if (true) {
      switch(sensor.direction) {
          case 'front':
              console.log('Moving front');
              m.r.forward(power);
              m.l.forward(power);
              break;
          case 'left':
              console.log('Moving left');
              m.r.forward(power);
              m.l.reverse(power);
              break;
          case 'right':
              console.log('Moving right');
              m.r.reverse(power);
              m.l.forward(power);
              break;
          default:
              break;
      }
    } else {
      m.r.stop();
      m.l.stop();
    }
  };

  //setInterval(update, 300);

}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {
  layout: false
});
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(methodOverride());
app.use(express.static(__dirname + '/public'));

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

app.get('*', routes.index);

io.sockets.on('connection', socket);

http.listen(8000);
