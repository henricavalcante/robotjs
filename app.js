'use strict';

const five = require('johnny-five');
const board = new five.Board();

const mosca = require('mosca');
const moscaSettings = {
  http: {
    port: 3000
  }
};
const server = new mosca.Server(moscaSettings);

const actions = {
  move: function (data) {
    data = JSON.parse(data.toString());
    Object.keys(data).map((side) => {
      motors[side].five[data[side] > 0 ? 'forward': 'reverse'](Math.abs(data[side]));
    });
  }
}

server.on('published', function(packet, client) {
  const action = packet.topic.split('/')[0];
  if (actions[action]) {
    actions[action](packet.payload);
  }
});

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
    actions: actions
  })
});

