
'use strict';
/**
 *
 * Created by Fathalian on 11/22/14.
 */

var app = angular.module('nestorApp.directives');

app.directive('blockDisplay', function () {
  return {
    restrict: 'A',
    scope : {
      componentBlockType: '@'
    },
    link: function postLink(scope, elem, attrs) {
      elem.resizable();
      alert(scope.componentBlockType);
      elem.on('resizestop', function (evt, ui) {
        if (scope.callback) { scope.callback(); }
      });
    }
  };
});
