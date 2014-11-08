/**
 * Created by Fathalian on 11/3/14.
 */
'use strict';

var app = angular.module('nestorApp.directives');

app.directive('plumbListeners', function () {
  return {
    //replace: true,
    //controller: 'PlumbCtrl',
    restrict: 'EA',
    scope: {
      onConnectionEstablished: '&',
      onConnectionDetached: '&',
      onConnectionMoved: '&'
    },
    link: function ($scope) {

      console.log('Listening for connections so that connections dont get depressed');

      jsPlumb.bind('connection', function (info) {
        console.log(info.source);
        var sourceName = info.source.attributes.getNamedItem('data-component-name').value;
        var targetName = info.target.attributes.getNamedItem('data-component-name').value;
        $scope.onConnectionEstablished({
          sourceName: sourceName,
          targetName: targetName
        });
      });

      jsPlumb.bind('connectionDetached', function(info) {

        var sourceName = info.source.attributes.getNamedItem('data-component-name').value;
        var targetName = info.target.attributes.getNamedItem('data-component-name').value;

        $scope.onConnectionDetached({
          sourceName: sourceName,
          targetName: targetName
        });
      });

      jsPlumb.bind('connectionMoved', function(info) {

        var sourceName = info.source.attributes.getNamedItem('data-component-name').value;
        var targetName = info.target.attributes.getNamedItem('data-component-name').value;

        $scope.onConnectionMoved({
          sourceName: sourceName,
          targetName: targetName
        });
      });


    }
  };
});

app.directive('plumbItem', function () {
  return {
    //replace: true,
    //controller: 'PlumbCtrl',
    restrict: 'EA',
    link: function ($scope, element) {
      console.log('Add plumbing for the item element');


      jsPlumb.makeTarget(element, {
        anchor: 'Continuous',
        paintStyle: {
          strokeStyle: '#225588',
          fillStyle: 'transparent',
          radius: 4,
          lineWidth: 1
        }
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
    link: function (scope, element) {
      console.log('Add plumbing for the connect element');

      jsPlumb.makeSource(element, {
        parent: $(element).parent(),
        anchor: ['Continuous', {faces: ['right', 'left', 'top']}],
        paintStyle: {
          strokeStyle: '#225588',
          fillStyle: 'transparent',
          radius: 4,
          lineWidth: 1
        }

      });

    }
  };
});
