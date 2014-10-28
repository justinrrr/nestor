'use strict';

/**
 * @ngdoc function
 * @name nestorApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the nestorApp
 */
angular.module('nestorApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
