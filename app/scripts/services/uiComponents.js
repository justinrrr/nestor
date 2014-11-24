/**
 * Created by Fathalian on 11/8/14.
 */
'use strict';

var app = angular.module('nestorApp.services');

app.service('UIComponents', ['PlumbStyles', 'AWSComponents' , function (PlumbStyles, AWSComponents) {
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

  var areTypesMatch = function (sourceType, targetType) {
    var targetObj =  AWSComponents.componentMetadata[targetType];
    if (targetObj && targetObj.IncomingConnection.hasOwnProperty(sourceType)) {
      return true;
    }
    return false;
  };

  var validateConnection = function (info) {
    if (info.sourceId === info.targetId) {
      return false;
    }

    var sourceType = info.source.attributes.getNamedItem('component-type').value

    var targetType = info.target.attributes.getNamedItem('component-type').value

    return areTypesMatch(sourceType, targetType);
  };

  this.validateConnection = validateConnection;

  this.setupJSPlumb = function ($scope) {

    jsPlumb.bind('ready', function () {
      console.log('Set up jsPlumb listeners (should be only done once)');
      jsPlumb.bind('connection', function () {
        $scope.$apply(function () {
          console.log('Possibility to push connection into array');
        });
      });
    });


    jsPlumb.bind('beforeDrop', function (info) {

      return validateConnection(info);

    });

    jsPlumb.bind('beforeDetach', function (info) {
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

      var paintStyle = isDashed ? PlumbStyles.dashedPaintStyle : PlumbStyles.normalPaintStyle;

      jsPlumb.connect({
        source: sourceElement.id,
        target: targetElement.id,
        connector: PlumbStyles.derivedConnectorStyle,
        paintStyle: paintStyle
      });
    }, 100);
  };
}]);
