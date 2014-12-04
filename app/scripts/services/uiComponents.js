/**
 * Created by Fathalian on 11/8/14.
 */
'use strict';

var app = angular.module('nestorApp.services');

app.service('UIComponents', ['PlumbStyles', 'AWSComponents' , 'CanvasModel', function (PlumbStyles, AWSComponents, CanvasModel) {
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

  var isNewConnection = function(sourceName, targetName) {
    if (CanvasModel.connections[sourceName] && CanvasModel.connections[sourceName][targetName]) {
      return false;
    }
    if (CanvasModel.connections[targetName] && CanvasModel.connections[targetName][sourceName]) {
      return false;
    }
    return true;
  };

  var areTypesMatch = function (sourceType, targetType) {

    //in case of
    var targetObj =  AWSComponents.componentMetadata[targetType];
    if(targetObj && targetObj.IncomingConnection.hasOwnProperty(sourceType)) {
      return true;
    }
    return false;
  };

  var validateConnection = function (info) {

    if (info.sourceId === info.targetId) {
      return false;
    }

    var sourceType = info.source.attributes.getNamedItem('component-type').value;

    var targetType = info.target.attributes.getNamedItem('component-type').value;

    var targetBlockType = info.target.attributes.getNamedItem('component-block-type').value;

    //if we have a container block only the connection from source to target should be matched
    //i.e you can't drop a container on top of the containee
    var result = areTypesMatch(sourceType, targetType);
    if (targetBlockType === 'container') {
      return result;
    }
    //if we have a normal connection then both the action of source attaching to target
    //and the target attaching to the source has the same meaning
    //also we should only make connection on new connections not existing ones (so we dont have
    //duplicate connections)
    else {

      var sourceName =  info.source.attributes['data-component-name'].value;
      var targetName = info.target.attributes['data-component-name'].value;
      return (isNewConnection(sourceName, targetName)) && (result ||  areTypesMatch(targetType, sourceType));
    }
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
      var sourceNominalName = info.source.attributes['data-identifier'].value;
      var targetNominalName = info.target.attributes['data-identifier'].value;

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
