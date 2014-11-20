/**
 * Created by Fathalian on 11/19/14.
 */

var app = angular.module('nestorApp.directives');

app.directive('resizer', function($document) {

  return function($scope, $element, $attrs) {

    $scope.$on('leftmostResizeRequest', function() {

      var leftPanelOpen = '85%';
      var leftPanelClose = '97%';

      var currentWidth = (angular.element('#middle-panel')[0].clientWidth / $(window).width()) * 100;
      if ($scope.isLeftOpen) {

        angular.element('#left-panel')[0].style.right = leftPanelOpen;
        currentWidth = currentWidth - 12;
        angular.element('#middle-panel')[0].style.width = currentWidth + '%';
      } else {
        angular.element('#left-panel')[0].style.right = leftPanelClose;
        currentWidth = currentWidth + 12;
        angular.element('#middle-panel')[0].style.width = currentWidth + '%';
      }
    });

    $element.on('mousedown', function(event) {
      event.preventDefault();

      $document.on('mousemove', mousemove);
      $document.on('mouseup', mouseup);
    });

    function mousemove(event) {

      if ($attrs.resizer == 'vertical') {
        // Handle vertical resizer
        var x = event.pageX;

        if ($attrs.resizerMax && x > $attrs.resizerMax) {
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
