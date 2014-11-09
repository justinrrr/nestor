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
      onConnectionMovedFromSource: '&',
      onConnectionMovedFromTarget: '&'
    },
    link: function ($scope) {

      console.log('Listening for connections so that connections dont get depressed');

      jsPlumb.bind('connection', function (info) {
        var sourceName = info.source.attributes.getNamedItem('data-component-name').value;
        var targetName = info.target.attributes.getNamedItem('data-component-name').value;
        var overlays = $scope.onConnectionEstablished({
          sourceName: sourceName,
          targetName: targetName
        });


        var connection = info.connection;
        _.each(overlays, function(overlay) {
          connection.addOverlay(overlay);
        });
        connection.addOverlay();
        //connection.addOverlay();
      });

      jsPlumb.bind('connectionDetached', function (info) {

        var sourceName = info.source.attributes.getNamedItem('data-component-name').value;
        var targetName = info.target.attributes.getNamedItem('data-component-name').value;

        $scope.onConnectionDetached({
          sourceName: sourceName,
          targetName: targetName
        });
      });

      jsPlumb.bind('connectionMoved', function (info) {

        console.log(info);

        var originalSource = angular.element('#' + info.originalSourceId)[0];
        var originalTarget = angular.element('#' + info.originalTargetId)[0];
        var newSource = angular.element('#' + info.newSourceId)[0];
        var newTarget = angular.element('#' + info.newTargetId)[0];
        //target has moved
        if (info.originalSourceId === info.newSourceId) {
          var sourceName = originalSource.attributes.getNamedItem('data-component-name').value;
          var originalTargetName = originalTarget.attributes.getNamedItem('data-component-name').value;
          var newTargetName = newTarget.attributes.getNamedItem('data-component-name').value;
          $scope.onConnectionMovedFromTarget(
            {
              sourceName: sourceName,
              originalTargetName: originalTargetName,
              newTargetName: newTargetName
            }
          );
        }

        //source has moved
        if (info.originalTargetId === info.newTargetId) {
          var originalSourceName = originalSource.attributes.getNamedItem('data-component-name').value;
          var newSourceName = newSource.attributes.getNamedItem('data-component-name').value;
          var targetName = originalTarget.attributes.getNamedItem('data-component-name').value;

          $scope.onConnectionMovedFromSource(
            {
              originalSourceName: originalSourceName,
              newSourceName: newSourceName,
              targetName: targetName
            }
          );
        }

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
          strokeStyle: '#D7B371',
          //fillStyle: 'transparent',
          radius: 2,
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
          strokeStyle: '#D7B371',
          fillStyle: 'transparent',
          radius: 2,
          lineWidth: 1
        }
      });


    }
  };
});
