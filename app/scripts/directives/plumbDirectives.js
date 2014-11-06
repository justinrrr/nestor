/**
 * Created by Fathalian on 11/3/14.
 */
'use strict';

var app = angular.module('nestorApp.directives');

app.directive('plumbItem', function () {
  return {
    replace: true,
    //controller: 'PlumbCtrl',
    link: function (scope, element ) {
      console.log('Add plumbing for the item element');

      jsPlumb.makeTarget(element, {
        anchor: 'Continuous'
      });
      jsPlumb.draggable(element, {
        containment: 'parent'
      });
    }
  };
});


app.directive('plumbConnect', function () {
  return {
    replace: true,
    link: function (scope, element ) {
      console.log('Add plumbing for the connect element');

      jsPlumb.makeSource(element, {
        parent: $(element).parent(),
        anchor: ['Continuous', {faces: ['right', 'left', 'top']}],
        paintStyle: {
          strokeStyle: '#225588',
          fillStyle: 'transparent',
          radius: 7,
          lineWidth: 2
        }
      });
    }
  };
});
