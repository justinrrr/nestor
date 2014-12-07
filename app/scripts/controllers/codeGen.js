/**
 * Created by Fathalian on 11/10/14.
 */
'use strict';

var app = angular.module('nestorApp');
  app.controller('CodeGenCtrl', ['$scope', '$rootScope','$modalInstance', '$timeout',
    function ($scope, $rootScope, $modalInstance, $timeout) {

      $scope.downloadReady = false;
      $scope.ok = function () {

        if ($scope.downloadReady) {
          $modalInstance.close();
        }
        else {
          $timeout(function(){
            $scope.downloadReady = true;
          }, 1000);
        }
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }]);


app.controller('OptimizeCtrl', ['$scope', '$rootScope','$modalInstance', '$timeout',
  function ($scope, $rootScope, $modalInstance, $timeout) {
    $scope.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    $scope.downloadReady = false;
    $scope.ok = function () {

      if ($scope.downloadReady) {
        $modalInstance.close();
      }
      else {
        $timeout(function(){
          $scope.downloadReady = true;
        }, 1000);
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);
