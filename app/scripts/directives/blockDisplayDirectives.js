'use strict';
/**
 *
 * Created by Fathalian on 11/22/14.
 */

var app = angular.module('nestorApp.directives');

app.directive('blockDisplay', ['UIComponents', function (UIComponents) {
  return {
    restrict: 'A',
    scope: {
      componentBlockType: '@',
      componentType: '@',
      inCaseOfDropInsideContainer: '&',
      inCaseOfDropOutsideContainer: '&'
    },
    link: function postLink(scope, elem /*, attrs*/) {

      //the type is like aws::ec2::vpc. What we need to do is to strip the :: and replace with
      //-. And also add the component type to the class because of the stupid ng-class limitiations
      var componentType = scope.componentType.replace(/::/g, '-');
      elem.addClass(componentType);
      elem.draggable();
      elem.addClass('draggable');
      elem.addClass('ui-widget-content');
      if (scope.componentBlockType === 'container') {

        elem.resizable({handles: 'all'});
        elem.addClass('droppable');
        elem.addClass('ui-widget-header');
        elem.droppable({
          drop: function (event, ui) {
            //when something is dropped to a droppable. The dragged object is source and the
            //dropped place is the target
            var itemName = ui.draggable.attr('data-component-name');
            var containerName = elem.attr('data-component-name');
            scope.inCaseOfDropInsideContainer({itemName: itemName, containerName: containerName});
          },
          out: function (event, ui) {
            var itemName = ui.draggable.attr('data-component-name');
            var containerName = elem.attr('data-component-name');
            scope.inCaseOfDropOutsideContainer({itemName: itemName, containerName: containerName});
          },
          hoverClass: 'container-hover',
          tolerance: 'touch',
          accept: function (draggable) {
            var sourceId = draggable.attr('id');
            var targetId = elem.attr('id');
            var info = {
              source: draggable[0],
              sourceId: sourceId,
              target: elem[0],
              targetId: targetId
            };

            return UIComponents.validateConnection(info);
          },
          activeClass: 'container-not-accept-hover'
        });
        elem.addClass('block-style-container');
        //elem.on('resizestop', function (evt, ui) {
        //  if (scope.callback) { scope.callback(); }
        //});
      }
    }
  };
}]);
