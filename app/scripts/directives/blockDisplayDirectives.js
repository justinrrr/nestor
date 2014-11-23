
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
      componentBlockType: '@',
      componentType: '@'
    },
    link: function postLink(scope, elem, attrs) {

      //the type is like aws::ec2::vpc. What we need to do is to strip the :: and replace with
      //-. And also add the component type to the class because of the stupid ng-class limitiations
      var componentType = scope.componentType.replace(/::/g,'-');
      elem.addClass(componentType);
      if (scope.componentBlockType === 'container') {

        elem.resizable();
        elem.addClass('block-style-container')
        //elem.on('resizestop', function (evt, ui) {
        //  if (scope.callback) { scope.callback(); }
        //});
      }
    }
  };
});
