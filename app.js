var five = require('johnny-five');
var board = new five.Board();

const motors = {
  'right': {
    pins: {
      pwm: 6,
      dir: 4,
      cdir: 7
    }
  },
  'left':{
    pins: {
      pwm: 5,
      dir: 2,
      cdir: 3
    }
  }
};

const move = function (direction, power) {

  const mr = motors['right'].five;
  const ml = motors['left'].five;

  switch(direction) {
      case 'forward':
          console.log('Moving front');
          mr.forward(power);
          ml.forward(power);
          break;
      case 'backward':
          mr.reverse(power);
          ml.reverse(power);
          break;
      case 'left':
          mr.stop();
          ml.forward(power);
          break;
      case 'right':
          mr.forward(power);
          ml.stop();
          break;
      default:
          mr.stop();
          ml.stop();
          break;
  }

}

board.on('ready', function() {

  Object.keys(motors).map((side) => {

    motors[side].five = five.Motor({
      pins: motors[side].pins
    });
    board.repl.inject({
      motor: motors[side].five
    });

  });

  board.repl.inject({
    move: move
  })
});

exports.move = move;
