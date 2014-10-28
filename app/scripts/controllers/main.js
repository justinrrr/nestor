'use strict';

/**
 * @ngdoc function
 * @name nestorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the nestorApp
 */
angular.module('nestorApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
