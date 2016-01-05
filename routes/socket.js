module.exports = function(socket) {
  socket.on('disconnect', function() {
    console.log('disconnected');
  });
};
