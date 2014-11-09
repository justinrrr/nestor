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

  this.setupJSPlumb = function($scope) {
    jsPlumb.bind('ready', function () {
      console.log('Set up jsPlumb listeners (should be only done once)');
      jsPlumb.bind('connection', function () {
        $scope.$apply(function () {
          console.log('Possibility to push connection into array');
        });
      });
    });
  };

  this.connectComponents = function(sourceName, targetName) {
    window.setTimeout(function() {
      var sourceElement = angular.element('[data-identifier =' + sourceName + ']')[0];
      var targetElement = angular.element('[data-identifier =' + targetName + ']')[0];

      jsPlumb.connect({
        source: sourceElement.id,
        target: targetElement.id,
        //anchors:["Bottom", [0.75,0,0,-1]],
        paintStyle: {
          strokeStyle: '#225588',
          fillStyle: 'transparent',
          radius: 4,
          lineWidth: 1,
          dashstyle:"2 6"
        }
        //paintStyle:{ }
        //endpointStyle:{fillStyle:'rgb(243,229,0)'}
      });
    }, 100);
  };
});
