/**
 * Created by Fathalian on 12/9/14.
 */

var app = angular.module('nestorApp');

app.controller('LandingCtrl', ['$scope', '$analytics', function ($scope, $analytics) {
  $scope.info = {};
  $scope.signupText = 'Sign me up';
  $scope.hasSignedUp = false;
  $scope.signUpPressed = function() {
    $scope.signupText = 'Thank You!';
    $analytics.eventTrack('DidSignUp', {
      email : $scope.info.email
    });
    $scope.hasSignedUp = true;
  }
}]);
