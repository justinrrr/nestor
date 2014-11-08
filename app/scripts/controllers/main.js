'use strict';

angular.module('nestorApp')
  .controller('MainCtrl', ['$scope', 'AWSComponents',
    function ($scope, AWSComponents) {

      //The draggable component on the canvas
      function Component(id, type, name, image, metadata, description, x, y) {
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


      $scope.addedComponents = {};

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

        $scope.addedComponents[c.name] = c;

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

      $scope.AddToTable = function (listToAddTo, propertyName, neededFields) {

        var item = {};
        _.each(neededFields, function (property) {
          item[property.name] = property.type;
        });

        if (!listToAddTo[propertyName]) {
          listToAddTo[propertyName] = [];
        }

        listToAddTo[propertyName].push(item);
      };

      $scope.$watch('template', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          $scope.templateString = JSON.stringify($scope.template, null, 4);
        }
      }, true);


      $scope.templateStringChanged = function () {
        try {
          $scope.template = JSON.parse($scope.templateString);
        } catch (err) {
          console.log(err);
        }

        //in the rest of this function we are going to consolidate the json string
        //and the components on the screen

        //remove each component that is in the addedComponent but is not in the json string
        _.each($scope.addedComponents, function(component, componentName){

          if (!$scope.template.Resources[componentName]) {
            delete $scope.addedComponents[componentName];
          }
        });

        //add any component that is in the json string but not in the addedComponents
        _.each($scope.template.Resources, function (resourceObj, resourceName) {
          if (!$scope.addedComponents[resourceName]) {
            var blueprintName = AWSComponents.typeMappings[resourceObj.Type];
            if (!blueprintName) {
              return;
            }

            var found = false;
            _.each(AWSComponents.components, function(component) {
              if (component.name === blueprintName) {

                found = true;

                var blueprint = component;
                var uniqueId = _.uniqueId(blueprint.name + '-');
                var c = new Component(
                  uniqueId,
                  blueprint.name,
                  resourceName,
                  blueprint.image,
                  $scope.componentMetadata[blueprint.name],
                  blueprint.description,
                  100,
                  100);

                itemSelected(c);

                $scope.addedComponents[c.name] = c;
              }
            });
          }

        });

      };

      $scope.connectionEstablished = function(sourceName, targetName) {
        var sourceType = AWSComponents.typeMappings[$scope.template.Resources[sourceName].Type];
        var targetType = AWSComponents.typeMappings[$scope.template.Resources[targetName].Type];
        var incomingConnectionProperies = $scope.componentMetadata[targetType].IncomingConnection[sourceType];
        if (!incomingConnectionProperies.isProperty) {
          if (incomingConnectionProperies.value === 'Name') {
            $scope.template.Resources[targetName][incomingConnectionProperies.name] = sourceName;
            $scope.$digest();
          }
        }

        return incomingConnectionProperies.overlays;
      };

      $scope.connectionDetached = function(sourceName, targetName) {

        var sourceType = AWSComponents.typeMappings[$scope.template.Resources[sourceName].Type];
        var targetType = AWSComponents.typeMappings[$scope.template.Resources[targetName].Type];
        var incomingConnectionProperies = $scope.componentMetadata[targetType].IncomingConnection[sourceType];

        if (!incomingConnectionProperies.isProperty) {
          if (incomingConnectionProperies.value === 'Name') {
            delete $scope.template.Resources[targetName][incomingConnectionProperies.name];
            $scope.$digest();
          }
        }

      };

      $scope.connectionMovedFromSource = function(/*originalSourceName, newSourceName, targetName*/) {

        //in this case we need to change the name of the property on the target to
        //the new source
        //alert('moved source from ' + originalSourceName + ' to ' + newSourceName);
      };

      $scope.connectionMovedFromTarget = function(sourceName, originalTargetName) {

        //in ths case we need to remove the connection from target
        $scope.connectionDetached(sourceName, originalTargetName);

      };
    }]);
