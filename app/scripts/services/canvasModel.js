/**
 * Created by Fathalian on 12/4/14.
 */
'use strict';

/*
Holds the underlying data structures that support
what is on the jsplumb screen
 */
var app = angular.module('nestorApp.services');
app.service('CanvasModel', [function () {
  this.addedComponents = {};
  this.connections = {};
  this.containments = [];
  this.componentNameCounters = {};
}]);
