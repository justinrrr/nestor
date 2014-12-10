/**
 * Created by Fathalian on 12/9/14.
 */

var app = angular.module('nestorApp');

app.controller('LandingCtrl', ['$scope', '$analytics', function ($scope, $analytics) {
  $scope.info = {};
  $scope.signupText = 'Sign me up';
  $scope.hasSignedUp = false;

  var iframe = $('#pPlayer')[0];
  var player = $f(iframe);

  player.addEvent('ready', function() {
    player.addEvent('play', onPlay);
    player.addEvent('finish', onFinish);
  });

  function onPlay(id) {

    $analytics.eventTrack('StartedVideo');
  }

  function onFinish(id) {
    $analytics.eventTrack('FinishedVideo');
  }

  $scope.signUpPressed = function() {
    $scope.signupText = 'Thank You!';
    $analytics.eventTrack('DidSignUp', {
      email : $scope.info.email
    });
    $scope.hasSignedUp = true;
  }
}]);
