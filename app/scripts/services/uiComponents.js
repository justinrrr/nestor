/**
 * Created by Fathalian on 11/8/14.
 */
'use strict';

var app = angular.module('nestorApp.services');

app.service('UIComponents', function () {
  //The draggable component on the canvas
  this.Component = function (id, type, name, image, requiredMetadata, optionalMetadata, description, x, y) {
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
});
