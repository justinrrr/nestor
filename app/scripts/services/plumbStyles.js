/**
 * Created by Fathalian on 11/17/14.
 */
'use strict';

var app = angular.module('nestorApp.services');

app.service('PlumbStyles', function () {

  //this is just for the normal connection
  this.normalPaintStyle = {
    strokeStyle: '#D7B371',
    fillStyle: 'transparent',
    radius: 2,
    lineWidth:  1
  };

  this.dashedPaintStyle = {
    strokeStyle: '#225588',
    fillStyle: 'transparent',
    radius: 4,
    lineWidth: 1,
    dashstyle : '8 6'
  };

  this.normalConnectorStyle = [ 'StateMachine', { curviness:10 } ];

  this.sourceAnchors = ['Continuous', {faces: ['right', 'left', 'top', 'bottom']}];

  this.targetAnchors = 'Continuous';

  this.derivedConnectorStyle = [ 'StateMachine', { curviness: 10 } ];

});
