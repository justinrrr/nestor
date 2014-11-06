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

      //The draggable component on the canvas
      function Component(name, image, description, x, y) {
        this.title = name;
        this.description = description;
        this.image = image;
        this.x = x;
        this.y = y;
      }

      //set up jsPlumb
      $scope.init = function () {
        jsPlumb.bind('ready', function () {
          console.log('Set up jsPlumb listeners (should be only done once)');
          jsPlumb.bind('connection', function () {
            $scope.$apply(function () {
              console.log('Possibility to push connection into array');
            });
          });
        });
      };

      $scope.addedComponents = [];
      //we use this to make sure that components are named
      //sequencially : Dynamo1, Dynamo2
      $scope.componentNameCounters = {};

      //available components in the library
      $scope.components = AWSComponents.components;
      $scope.componentMetadata = AWSComponents.componentMetadata;

      //tasks can be and together
      $scope.tasks = AWSComponents.tasks;

      //main CF template
      $scope.template = {
        AWSTemplateFormatVersion: '2010-09-09',
        Description: 'Created By Nestor',
        Parameters: {},
        Mappings: {},
        Conditions: {},
        Resources: {},
        Outputs: {}
      };

      $scope.templateString = JSON.stringify($scope.template, null, 4);

      //make sure each component has a unique name
      function generateComponentName(type) {
        if (!$scope.componentNameCounters.type) {
          $scope.componentNameCounters.type = 1;
          return type;
        } else {
          var counter = $scope.componentNameCounters.type;
          $scope.componentNameCounters.type++;
          return type + counter;
        }
      }

      function addComponentToTemplate(blueprint, c) {

        $scope.addedComponents.push(c);

        var componentName = generateComponentName(blueprint.name);

        var aMetadata = $scope.componentMetadata[blueprint.name];
        $scope.template.Resources[componentName] = {
          Type: aMetadata.type
        };
        $scope.template.Resources[componentName].Properties =
          aMetadata.properties.required;


        //add the possible outputs
        _.each(aMetadata.outputs, function(outputMetdata) {
          if (outputMetdata.type === 'Ref') {
            var outputObj = {
              Description : outputMetdata.description,
              Value : {Ref :  componentName }
            };
            $scope.template.Outputs[componentName + outputMetdata.name] = outputObj;
          }
        });

        $scope.templateString = JSON.stringify($scope.template, null, 4);
      }

      // add a module to the schema
      var addComponent = function (blueprint, posX, posY) {

        var c = new Component(
          blueprint.name,
          blueprint.image,
          blueprint.description,
          posX,
          posY);

        addComponentToTemplate(blueprint, c);

      };

      $scope.onDragComplete = function ($data, $event) {
        addComponent($data, $event.x, $event.y);
      };
    }]);
