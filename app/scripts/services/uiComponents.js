/**
 * Created by Fathalian on 11/8/14.
 */
'use strict';

var app = angular.module('nestorApp.services');

app.service('UIComponents', function () {
  //The draggable component on the canvas
  //only set parent name if its a draggable property
  this.Component = function (id, type, name, image, requiredMetadata, optionalMetadata, description, x, y, parentName) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.description = description;
    this.image = image;
    this.x = x;
    this.y = y;
    //this.metadata = metadata;
    this.required = requiredMetadata;
    this.optional = optionalMetadata;
    this.parent = parentName || '';
  };

  this.setupJSPlumb = function ($scope) {
    var getComponentTypeWithNominalName = function (nominalName) {
      if ($scope.addedComponents[nominalName]){
        return $scope.addedComponents[nominalName].type;
      }

      return '';
    };

    var areTypesMatch = function (sourceType, targetType) {
      var targetObj = $scope.componentMetadata[targetType];
      if (targetObj && targetObj.IncomingConnection.hasOwnProperty(sourceType)) {
        return true;
      }
      return false;
    };

    jsPlumb.bind('ready', function () {
      console.log('Set up jsPlumb listeners (should be only done once)');
      jsPlumb.bind('connection', function () {
        $scope.$apply(function () {
          console.log('Possibility to push connection into array');
        });
      });
    });

    jsPlumb.bind('beforeDrop', function (info) {

      if (info.sourceId === info.targetId) {
        return false;
      }

      var sourceNominalName = info.source.attributes['data-identifier'].nodeValue;
      var sourceType = getComponentTypeWithNominalName(sourceNominalName);

      var targetNominalName = info.target.attributes['data-identifier'].nodeValue;
      var targetType = getComponentTypeWithNominalName(targetNominalName);

      return areTypesMatch(sourceType, targetType);
    });

    jsPlumb.bind('beforeDetach', function(info){
      var sourceNominalName = info.source.attributes['data-identifier'].nodeValue;
      var targetNominalName = info.target.attributes['data-identifier'].nodeValue;

      $scope.onConnectionDetached({
        sourceName: sourceNominalName,
        targetName: targetNominalName
      });

    });

  };

  this.connectComponents = function (sourceName, targetName, isDashed) {
    window.setTimeout(function () {
      var sourceElement = angular.element('[data-identifier =' + sourceName + ']')[0];
      var targetElement = angular.element('[data-identifier =' + targetName + ']')[0];

      var paintStyleObj = {
        strokeStyle: '#225588',
        fillStyle: 'transparent',
        radius: 4,
        lineWidth: 1
      };

      if (isDashed) {
        paintStyleObj.dashstyle = '8 6';
      }

      jsPlumb.connect({
        source: sourceElement.id,
        target: targetElement.id,
        connector: [ 'StateMachine', { curviness: 10 } ],
        //anchors:["Bottom", [0.75,0,0,-1]],
        paintStyle: paintStyleObj
        //paintStyle:{ }
        //endpointStyle:{fillStyle:'rgb(243,229,0)'}
      });
    }, 100);
  };
});
