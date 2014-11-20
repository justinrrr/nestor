'use strict';
/**
 *
 * Created by Fathalian on 11/19/14.
 */

var app = angular.module('nestorApp.directives');

app.directive('resizer', function($document) {

  return function($scope, $element, $attrs) {

    $scope.$on('leftmostResizeRequest', function() {
      var openCloseDifference = parseInt($attrs.openCloseDifference);
      var currentPanelSize = (($(window).width() - angular.element('#left-panel')[0].clientWidth) /  $(window).width()) * 100;


      var currentWidth = (angular.element('#middle-panel')[0].clientWidth / $(window).width()) * 100;
      if ($scope.isLeftOpen) {

        currentPanelSize = currentPanelSize - openCloseDifference;
        angular.element('#left-panel')[0].style.right =  currentPanelSize+ '%';

        currentWidth = currentWidth - openCloseDifference;
        angular.element('#middle-panel')[0].style.width = currentWidth + '%';
      } else {
        currentPanelSize += openCloseDifference;
        angular.element('#left-panel')[0].style.right = currentPanelSize + '%';
        currentWidth = currentWidth + openCloseDifference;
        angular.element('#middle-panel')[0].style.width = currentWidth + '%';
      }
    });

    $element.on('mousedown', function(event) {
      event.preventDefault();

      $document.on('mousemove', mousemove);
      $document.on('mouseup', mouseup);
    });

    function mousemove(event) {

      if ($attrs.resizer === 'vertical') {
        // Handle vertical resizer
        var x = event.pageX;

        if ($attrs.resizerMax && x < $attrs.resizerMax) {
          x = parseInt($attrs.resizerMax);
        }

        $element.css({
          left: x + 'px'
        });

        $($attrs.resizerRight).css({
          left: (x + parseInt($attrs.resizerWidth)) + 'px'
        });
        var leftmostWidth = $($attrs.resizerLeftmost)[0].clientWidth;
        var finalLeftWidth = x - leftmostWidth;
        //$attrs.resizerLeftmost;
        $($attrs.resizerLeft).css({
          width: finalLeftWidth + 'px'
        });

      } else {
        // Handle horizontal resizer
        var y = window.innerHeight - event.pageY;

        $element.css({
          bottom: y + 'px'
        });

        $($attrs.resizerTop).css({
          bottom: (y + parseInt($attrs.resizerHeight)) + 'px'
        });
        $($attrs.resizerBottom).css({
          height: y + 'px'
        });
      }
    }

    function mouseup() {
      $document.unbind('mousemove', mousemove);
      $document.unbind('mouseup', mouseup);
    }
  };
});
