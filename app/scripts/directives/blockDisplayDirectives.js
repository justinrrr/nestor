
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
      elem.draggable();
      elem.addClass('draggable');
      elem.addClass('ui-widget-content');
      if (scope.componentBlockType === 'container') {

        elem.resizable({ handles: "all" });
        elem.addClass('droppable');
        elem.addClass('ui-widget-header');
        elem.droppable({
          drop: function( event, ui ) {alert('fuck in');},
          out: function (event, ui) {alert('fuck out');},
          hoverClass : 'container-hover',
          tolerance: 'touch',
          accept : ".AWS-DynamoDB-Table",
          activeClass: 'container-not-accept-hover'
        });
        elem.addClass('block-style-container')
        //elem.on('resizestop', function (evt, ui) {
        //  if (scope.callback) { scope.callback(); }
        //});
      }
    }
  };
});
