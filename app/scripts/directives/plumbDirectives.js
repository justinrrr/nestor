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
        _.each(overlays, function (overlay) {
          connection.addOverlay(overlay);
        });
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

app.directive('plumbItem', ['PlumbStyles', function (PlumbStyles) {
  return {
    //replace: true,
    //controller: 'PlumbCtrl',
    restrict: 'EA',
    link: function ($scope, element, $attrs) {
      console.log('Add plumbing for the item element');


      //containers are only targets when something is droped so from the plumb sense
      //they can never be targets
      if ($attrs.componentBlockType !== 'container') {

        jsPlumb.makeTarget(element, {
          anchor: PlumbStyles.targetAnchors,
          connector: PlumbStyles.normalConnectorStyle,
          paintStyle: PlumbStyles.normalPaintStyle
        });

        jsPlumb.draggable(element, {
          containment: 'parent'
        });
      }
    }
  };
}]);


app.directive('plumbConnect', ['PlumbStyles', function (PlumbStyles) {
  return {
    replace: true,
    link: function (scope, element) {
      console.log('Add plumbing for the connect element');

      jsPlumb.makeSource(element, {
        parent: $(element).parent(),
        anchor: PlumbStyles.sourceAnchors,
        connector: PlumbStyles.normalConnectorStyle,
        paintStyle: PlumbStyles.normalPaintStyle
      });
    }
  };
}]);
