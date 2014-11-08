/**
 * Created by Fathalian on 11/8/14.
 */
'use strict';

var app = angular.module('nestorApp.directives');

app.directive('componentProperties', [function () {
  return {
    replace: true,
    restrict: 'E',
    transclude: true,
    scope: {
      componentProperties: '=',
      resourceProperties: '=',
      types: '='
    },
    templateUrl: 'templates/component_properties.html'
  };

}]);


app.directive('primitiveProperty', [function () {
  return {
    replace: true,
    restrict: 'E',
    transclude: true,
    scope: {
      property: '=',
      model: '='
    },
    templateUrl: '../../templates/primitive_inputs.html'
  };
}]);
