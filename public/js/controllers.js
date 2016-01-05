'use strict';

/* Controllers */
app.controller('RobotController', ['$scope', '$interval', 'socket',  function($scope, $interval,  socket) {
  $scope.temperature = 100;
  $interval(function() {
    $scope.temperature += 300;
  },1000);
}]);
