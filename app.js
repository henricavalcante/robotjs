var five = require('johnny-five');
var _ = require('lodash');
var board = new five.Board();

var phrSensors = [
  { direction: 'right', value: 0, pin: 'A0' },
  { direction: 'front', value: 0, pin: 'A1' },
  { direction: 'left', value: 0, pin: 'A2' },
];

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

  _.each(phrSensors, function(sensor) {

    var phr = new five.Sensor({ pin: sensor.pin, freq: 250 });

    board.repl.inject({ pot: phr });

    phr.on('data', function() {
      _.find(phrSensors, sensor).value = this.value;
    });

  });

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
    console.log(phrSensors);

    var sensor = _.min(phrSensors, 'value');

    var m = {};
    m.l = _.find(motors, { side: 'left' }).five;
    m.r = _.find(motors, { side: 'right' }).five;

    var power = 255;

    if (sensor.value < 800) {
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

  setInterval(update, 300);
}
