'use strict';

/**
 * @ngdoc function
 * @name nestorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the nestorApp
 */
angular.module('nestorApp')
  .controller('MainCtrl', ['$scope', 'AWSComponents',
    function ($scope, AWSComponents) {

      // define a module with library id, schema id, etc.
      function Component(name, image, description, x, y) {
        this.title = name;
        this.description = description;
        this.image = image;
        this.x = x;
        this.y = y;
      }

      $scope.init = function() {
        jsPlumb.bind("ready", function() {
          console.log("Set up jsPlumb listeners (should be only done once)");
          jsPlumb.bind("connection", function (info) {
            $scope.$apply(function () {
              console.log("Possibility to push connection into array");
            });
          });
        });
      };

      $scope.addedComponenets = [];
      $scope.components = AWSComponents.components;
      //tasks can be and together
      $scope.tasks = AWSComponents.tasks;

      $scope.template = {};

      // add a module to the schema
      var addComponent = function(blueprint, posX, posY) {
        console.log("Add module " + blueprint.name + " to schema, at position " + posX + "," + posY);
        //for (var i = 0; i < $scope.library.length; i++) {
        //  if ($scope.library[i].library_id == library_id) {
        //    title = $scope.library[i].title;
        //    description = $scope.library[i].description;
        //  }
        //}
        var m = new Component(
          blueprint.name,
          blueprint.image,
          blueprint.description,
          posX,
          posY);

        $scope.addedComponenets.push(m);
        $scope.template[blueprint.name] = blueprint.description;
        $scope.templateString = JSON.stringify($scope.template);
      };

       $scope.onDragComplete = function($data,$event) {
         addComponent($data, $event.x, $event.y);
      };
    }]);
