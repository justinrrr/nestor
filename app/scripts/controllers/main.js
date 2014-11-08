'use strict';

angular.module('nestorApp')
  .controller('MainCtrl', ['$scope', 'AWSComponents',
    function ($scope, AWSComponents) {

      //The draggable component on the canvas
      function Component(id, type, name, image, metadata,  description, x, y) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.description = description;
        this.image = image;
        this.x = x;
        this.y = y;
        //this.metadata = metadata;
        this.required = metadata.properties.required;
        this.optional = metadata.properties.optional;
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

      //accordion
      $scope.oneAtATime = true;
      $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
      };

      $scope.addedComponents = [];

      //we use this to make sure that components are named
      //sequencially : Dynamo1, Dynamo2
      $scope.componentNameCounters = {};

      //available components in the library
      $scope.components = AWSComponents.components;
      $scope.componentMetadata = AWSComponents.componentMetadata;
      $scope.types = AWSComponents.propertyTypes;

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
        }

        var counter = $scope.componentNameCounters.type;
        $scope.componentNameCounters.type++;
        return type + '-' + counter;
      }

      function addComponentToTemplate(blueprint, c) {

        $scope.addedComponents.push(c);

        var componentName = c.name;

        var aMetadata = $scope.componentMetadata[blueprint.name];
        $scope.template.Resources[componentName] = {
          Type: aMetadata.type
        };
        $scope.template.Resources[componentName].Properties = {};


        //add the possible outputs
        _.each(aMetadata.outputs, function (outputMetdata) {
          if (outputMetdata.type === 'Ref') {
            var outputObj = {
              Description: outputMetdata.description,
              Value: {Ref: componentName}
            };
            $scope.template.Outputs[componentName + '-' + outputMetdata.name] = outputObj;
          }
        });

        $scope.templateString = JSON.stringify($scope.template, null, 4);
      }

      function itemSelected(component) {
        $scope.selectedComponent = component;
      }

      // add a module to the schema
      var addComponent = function (blueprint, posX, posY) {

        var uniqueId = _.uniqueId(blueprint.name + '-');
        var c = new Component(
          uniqueId,
          blueprint.name,
          generateComponentName(blueprint.name),
          blueprint.image,
          $scope.componentMetadata[blueprint.name],
          blueprint.description,
          posX,
          posY);

        addComponentToTemplate(blueprint, c);

        itemSelected(c);
      };

      $scope.onDragComplete = function ($data, $event) {
        addComponent($data, $event.x, $event.y);
      };

      $scope.clickCallback = function (component) {
        itemSelected(component);
      };

      $scope.AddToTable = function(listToAddTo,  propertyName, neededFields) {

        var item = {};
        _.each(neededFields, function(property) {
          item[property.name] = property.type;
        });

        if (!listToAddTo[propertyName]) {
          listToAddTo[propertyName] = [];
        }

        listToAddTo[propertyName].push(item);
      };

      $scope.$watch('template', function(newValue, oldValue){
        if (newValue !== oldValue){
          $scope.templateString = JSON.stringify($scope.template, null, 4);
        }
      }, true);

      $scope.templateStringChanged = function() {
        $scope.template = JSON.parse($scope.templateString);
      }
    }]);
