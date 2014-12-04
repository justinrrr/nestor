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
      inCaseOfDropOutsideContainer: '&',
      inCaseOfContainerDrag: '&',
      inCaseOfContainerCordinateChange: '&'
    },
    link: function postLink(scope, elem /*, attrs*/) {

      //the type is like aws::ec2::vpc. What we need to do is to strip the :: and replace with
      //-. And also add the component type to the class because of the stupid ng-class limitiations
      var componentType = scope.componentType.replace(/::/g, '-');
      elem.addClass(componentType);
      elem.addClass('draggable');
      elem.addClass('ui-widget-content');
      if (scope.componentBlockType === 'container') {

        //since the jqueryUI doesn't track the drag position since
        //the last drag event fired, we have to do it here manually
        var currentPosition = {left: 0, top: 0};
        var dragStarted = false;

        //If the item is a container we should listen to its drag options
        elem.draggable({

          //zero out the offset at each drag start. Also because
          //this drag is separate than the jsplumbs default drag
          //we need to update the coordinates in the controller
          stop: function () {

            dragStarted = false;
            var containerName = elem.attr('data-component-name');
            scope.inCaseOfContainerCordinateChange({containerName: containerName, newPosition : currentPosition});

            //now zero out the last known position for a fresh new drag event that may start
            currentPosition.left = 0;
            currentPosition.top = 0;
          },
          drag: function (event, ui) {
            var containerName = elem.attr('data-component-name');

            var offset = {dx: 0, dy: 0};
            if (!dragStarted) {
              dragStarted = true;
              currentPosition = ui.originalPosition;
            }
            offset.dx = ui.position.left - currentPosition.left;
            offset.dy = ui.position.top - currentPosition.top;

            //update the currentPosition to new position
            currentPosition = ui.position;
            scope.inCaseOfContainerDrag({containerName: containerName, offset: offset});
          }
        });

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
