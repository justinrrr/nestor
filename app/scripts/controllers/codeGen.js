/**
 * Created by Fathalian on 11/10/14.
 */
'use strict';

var app = angular.module('nestorApp');

app.controller('LoadInfrastructure', ['$scope', '$rootScope', '$modalInstance', '$timeout',
  function ($scope, $rootScope, $modalInstance, $timeout) {

    $scope.loadInfraFromAWS = function () {
      $timeout(function () {
        $modalInstance.close('load');
      }, 1500);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);


app.controller('CodeGenCtrl', ['$scope', '$rootScope', '$modalInstance', '$timeout',
  function ($scope, $rootScope, $modalInstance, $timeout) {

    $scope.downloadReady = false;
    $scope.ok = function () {

      if ($scope.downloadReady) {
        $modalInstance.close();
      }
      else {
        $timeout(function () {
          $scope.downloadReady = true;
        }, 1000);
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);


app.controller('OptimizeCtrl', ['$scope', '$rootScope', '$modalInstance', '$timeout', 'component',
  function ($scope, $rootScope, $modalInstance, $timeout, component) {
    $scope.componenetName = component.name;
    $scope.labels = ['11/8', '11/9', '11/10', '11/11', '11/12', '11/13', '11/14', '11/15', '11/16', '11/17', '11/18', '11/19', '11/20', '11/21', '11/22', '11/23', '11/24', '11/25', '11/26', '11/27', '11/28', '11/29', '11/30', '12/1', '12/2', '12/3', '12/4', '12/5', '12/6', '12/7', '12/8'];
    $scope.series = ['current usage', 'suggested capacity'];
    $scope.data = [
      [25, 32, 50, 57, 66, 55, 40, 20, 19, 57, 67, 53, 65, 44, 15, 20, 60, 15, 16, 19, 40, 26, 20, 45, 54, 67, 55, 20, 17, 23],
      [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60]
    ];
    $scope.colours = [
      {
        fillColor: 'rgba(236, 240, 241,0.5)',
        pointColor: 'rgba(44, 62, 80,1.0)',
        pointHighlightStroke: '#34495e',
        strokeColor: 'rgba(44, 62, 80,1.0)'
      },
      {
        fillColor: 'rgba(23, 188, 184, 0.1)',
        strokeColor: '#17BCB8'
      },
    ]

    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    $scope.downloadReady = false;
    $scope.ok = function () {

      if ($scope.downloadReady) {
        $modalInstance.close();
      }
      else {
        $timeout(function () {
          $scope.downloadReady = true;
        }, 1000);
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);
