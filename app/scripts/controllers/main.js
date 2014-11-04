'use strict';

/**
 * @ngdoc function
 * @name nestorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the nestorApp
 */
angular.module('nestorApp')
  .controller('MainCtrl', ['$scope', 'AWSComponents',
    function ($scope, AWSComponents) {

      $scope.checked = true;
      $scope.components = AWSComponents.components;
      //tasks can be and together
      $scope.tasks = AWSComponents.tasks;
    }]);
