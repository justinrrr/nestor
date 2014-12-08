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

    //using an object to avoid ng-repeats scope creation of another variable
    $scope.activeReserved = {selectedIndex: 'none', selectedMonth: 12};
    $scope.shouldShowDiagram = false;
    $scope.componentName = component.name;
    $scope.labels = ['11/8', '11/9', '11/10', '11/11', '11/12', '11/13', '11/14', '11/15', '11/16', '11/17', '11/18', '11/19', '11/20', '11/21', '11/22', '11/23', '11/24', '11/25', '11/26', '11/27', '11/28', '11/29', '11/30', '12/1', '12/2', '12/3', '12/4', '12/5', '12/6', '12/7', '12/8'];
    $scope.monthsOfYear = ['12/14', '1/15', '2/15', '3/15', '4/15', '5/15', '6/15', '7/15', '8/15', '9/15', '10/15', '11/15'];

    $scope.series = ['current usage', 'suggested capacity'];
    $scope.dataCpu = [
      [25, 32, 50, 57, 66, 55, 40, 20, 19, 57, 67, 53, 65, 44, 15, 20, 60, 15, 16, 19, 40, 26, 20, 45, 54, 67, 55, 20, 17, 23],
      [50, 50, 55, 60, 70, 60, 50, 50, 50, 60, 70, 60, 70, 50, 50, 50, 65, 50, 50, 50, 50, 50, 50, 50, 60, 70, 60, 50, 50, 50]

    ];
    $scope.dataRam = [
      [0.128, 0.128, 0.510, 0.570, 0.660, 0.690, 0.690, 0.200, 0.200, 1.618, 1.718, 2.719, 2.700, 2.950, 3.253, 3.754, 3.85, 3.912, 1.512, 1.512, 1.512, 1.1, 1.2, 1.512, 1.512, 1.3, 1.5, 1.512, 1.500, 1.618],
      [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      [7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5]
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
      }
    ];

    $scope.ramSeries = ['current usage', 'suggested capacity', 'provisionedCapacity'];
    $scope.ramColours = [
      {
        fillColor: 'rgba(236, 240, 241,0.5)',
        pointColor: 'rgba(44, 62, 80,1.0)',
        pointHighlightStroke: '#34495e',
        strokeColor: 'rgba(44, 62, 80,1.0)'
      },
      {
        fillColor: 'rgba(23, 188, 184, 0.0)',
        strokeColor: '#17BCB8'
      },
      {
        fillColor: 'rgba(23, 188, 184, 0.0)',
        strokeColor: 'rgba(192, 57, 43,1.0)'
      }
    ]

    $scope.reservedInstances = [
      {
        type: 't2.medium',
        offering: 'Medium-Utilization',
        term: '12 Months',
        effective: 0.043,
        hourly: 0.024,
        upfront: 168,
        provider: 'Amazon'
      },
      {
        type: 't2.medium',
        offering: 'All Upfront',
        term: '12 Months',
        effective: 0.033,
        hourly: 0.0,
        upfront: 302,
        provider: 'Amazon'
      },
      {
        type: 't2.medium',
        offering: 'Partial Upfront',
        term: '3 Months',
        effective: 0.041,
        hourly: 0.015,
        upfront: 60,
        provider: 'Third Party'
      }
    ];
    //39
    var t2MediumPriceBase = 37.44;
    $scope.t2MediumPrices = _.map(_.range(1, 13), function (num) {
      return num * t2MediumPriceBase;
    });


    //12 months	$0.043	$0.024	$168.0	Amazon

    $scope.compareData = [$scope.t2MediumPrices, $scope.currentModelPrices];
    $scope.compareSeries = ['On-Demand', 'Reserved'];

    $scope.compareColors = [
      {
        fillColor: 'rgba(236, 240, 241,0.0)',
        pointColor: 'rgba(44, 62, 80,1.0)',
        pointHighlightStroke: '#34495e',
        strokeColor: 'rgba(44, 62, 80,1.0)'
      },
      {
        fillColor: 'rgba(23, 188, 184, 0.0)',
        strokeColor: '#17BCB8'
      }
    ];

    $scope.reservedSelected = function (instance) {

      //each month is around 730 hors
      var prepaid = instance.upfront;
      var currentModelPriceBase = instance.hourly * 730;
      $scope.currentModelPrices = _.map(_.range(1, 13), function (num) {
        return prepaid + num * currentModelPriceBase;
      });

      var intersection = findIntersection(0, 1, $scope.t2MediumPrices[0], $scope.t2MediumPrices[1],
        0,1, $scope.currentModelPrices[0],$scope.currentModelPrices[1]);

      $scope.intersectionPoint = Math.ceil(intersection * 30);

      $scope.compareData[1] = $scope.currentModelPrices;

      $scope.calculateSavings();
    };

    $scope.calculateSavings = function() {

      $scope.activeReserved.totalSavings = Math.ceil($scope.t2MediumPrices[$scope.activeReserved.selectedMonth - 1] - $scope.currentModelPrices[$scope.activeReserved.selectedMonth - 1]);
      $scope.activeReserved.saveLose = $scope.activeReserved.totalSavings >= 0 ? 'save' : 'lose';
      $scope.activeReserved.totalSavings = Math.abs( $scope.activeReserved.totalSavings);
    }

    //finds the x interestction of two lines given four points
    function findIntersection(x1, x2, y1, y2, xx1, xx2, yy1, yy2) {

      var m = (y2 - y1) / (x2 - x1);
      var mm = (yy2 - yy1) / (xx2 - xx1);
      //I did the math on the paper :D
      return ( (m * x1) - y1 - (mm * xx1) + yy1) / (m - mm);
    }

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
