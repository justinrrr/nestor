'use strict';

angular.module('nestorApp')
  .controller('MainCtrl', ['$scope', 'AWSComponents', 'UIComponents',
    function ($scope, AWSComponents, UIComponents) {


      //set up jsPlumb
      $scope.init = function () {
        UIComponents.setupJSPlumb($scope);
      };

      //create initial template
      $scope.template = AWSComponents.createInitialTemplate();
      $scope.templateString = JSON.stringify($scope.template, null, 4);

      $scope.addedComponents = {};

      //add initial DS
      $scope.componentNameCounters = {};
      $scope.components = AWSComponents.components;
      $scope.componentMetadata = AWSComponents.componentMetadata;
      $scope.types = AWSComponents.propertyTypes;
      $scope.tasks = AWSComponents.tasks;

      //--------------------------------------
      // Helpers
      //--------------------------------------
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

      var addComponent = function (blueprint, posX, posY) {

        var uniqueId = _.uniqueId(blueprint.name + '-');
        var c = new UIComponents.Component(
          uniqueId,
          blueprint.name,
          generateComponentName(blueprint.name),
          blueprint.image,
          $scope.componentMetadata[blueprint.name].properties.required,
          $scope.componentMetadata[blueprint.name].properties.optional,
          blueprint.description,
          posX,
          posY);

        addComponentToTemplate(blueprint, c);

        itemSelected(c);
      };


      //--------------------------------------
      // UI Events
      //--------------------------------------
      $scope.onDragComplete = function ($data, $event) {

        //because of the fucking directive for ui layout
        //I need to use jquery here to compensate for the extra offset
        //caused by the editor
        var leftPanelWidth = angular.element('#left-column')[0].clientWidth;
        addComponent($data, $event.x - leftPanelWidth, $event.y);
      };

      $scope.clickCallback = function (component) {
        itemSelected(component);
      };

      $scope.connectionEstablished = function (sourceName, targetName) {
        var sourceObject = $scope.template.Resources[sourceName];
        var sourceType = AWSComponents.typeMappings[sourceObject.Type];

        var targetObject = $scope.template.Resources[targetName];
        var targetType = AWSComponents.typeMappings[targetObject.Type];

        var incomingProperies = $scope.componentMetadata[targetType].IncomingConnection[sourceType];


        //source: securitygroupd
        //target: ec2

        // If this connection needs to update Target
        if (incomingProperies.hasOwnProperty('targetPropName') &&
          incomingProperies.hasOwnProperty('targetPropValue') &&
          incomingProperies.hasOwnProperty('targetPropValueMethod') &&
          incomingProperies.hasOwnProperty('targetPolicy')) {

          if (incomingProperies.targetPropValueMethod === 'pure') {
            if (incomingProperies.targetPolicy === 'append') {

              if (targetObject.hasOwnProperty(incomingProperies.targetPropName)) {
                targetObject[incomingProperies.targetPropName].push(sourceObject[incomingProperies.targetPropValue]);
              }
              else {
                targetObject[incomingProperies.targetPropName] = [sourceObject[incomingProperies.targetPropValue]];
              }
            } else { //assign

              //edge case:
              if (incomingProperies.targetPropValue === 'Name') {
                targetObject[incomingProperies.targetPropName] = sourceName;
              }
              else {
                targetObject[incomingProperies.targetPropName] = sourceObject[incomingProperies.targetPropValue];
              }
            }
          }
          else if (incomingProperies.targetPropValueMethod === 'ref') {
            if (incomingProperies.targetPolicy === 'append') {

              if (targetObject.hasOwnProperty(incomingProperies.targetPropName)) {
                targetObject[incomingProperies.targetPropName].push({ Ref: sourceName});
              }
              else {
                targetObject[incomingProperies.targetPropName] = [
                  { Ref: sourceName}
                ];
              }

            } else { //assign
              targetObject[incomingProperies.targetPropName] = { Ref: sourceName};
            }
          }
          else if (incomingProperies.targetPropValueMethod === 'attribute') {
            //TODO: NYI
          }
          $scope.$digest();

        }


        // If this connection needs to update Source
        if (incomingProperies.hasOwnProperty('sourcePropName') &&
          incomingProperies.hasOwnProperty('sourcePropValue') &&
          incomingProperies.hasOwnProperty('sourcePropValueMethod') &&
          incomingProperies.hasOwnProperty('sourcePolicy')) {

          if (incomingProperies.sourcePropValueMethod === 'pure') {
            if (incomingProperies.sourcePolicy === 'append') {

              if (sourceObject.hasOwnProperty(incomingProperies.sourcePropName)) {
                sourceObject[incomingProperies.sourcePropName].push(targetObject[incomingProperies.sourcePropValue]);
              }
              else {
                sourceObject[incomingProperies.sourcePropName] = [targetObject[incomingProperies.sourcePropValue]];
              }
            } else { //assign
              if (incomingProperies.sourcePropValue === 'Name') {
                sourceObject[incomingProperies.sourcePropName] = targetName;
              } else {
                sourceObject[incomingProperies.sourcePropName] = targetObject[incomingProperies.sourcePropValue];
              }
            }
          }
          else if (incomingProperies.sourcePropValueMethod === 'ref') {
            if (incomingProperies.sourcePolicy === 'append') {

              if (sourceObject.hasOwnProperty(incomingProperies.sourcePropName)) {
                sourceObject[incomingProperies.sourcePropName].push({ Ref: targetName});
              }
              else {
                sourceObject[incomingProperies.sourcePropName] = [
                  { Ref: targetName}
                ];
              }
            } else { //assign
              sourceObject[incomingProperies.sourcePropName] = { Ref: targetName};
            }
          }
          else if (incomingProperies.sourcePropValueMethod === 'attribute') {
            //TODO: NYI
          }
          $scope.$digest();

        }


//            $scope.template.Resources[targetName][incomingConnectionProperies.name] = sourceName;
        return incomingProperies.overlays;
      };

      $scope.connectionDetached = function (sourceName, targetName) {
        /*
         var sourceType = AWSComponents.typeMappings[$scope.template.Resources[sourceName].Type];
         var targetType = AWSComponents.typeMappings[$scope.template.Resources[targetName].Type];
         var incomingConnectionProperies = $scope.componentMetadata[targetType].IncomingConnection[sourceType];

         if (!incomingConnectionProperies.isProperty) {
         if (incomingConnectionProperies.value === 'Name') {
         delete $scope.template.Resources[targetName][incomingConnectionProperies.name];
         $scope.$digest();
         }
         }
         */
      };

      $scope.connectionMovedFromSource = function (/*originalSourceName, newSourceName, targetName*/) {
        //in this case we need to change the name of the property on the target to
        //the new source
      };

      $scope.connectionMovedFromTarget = function (sourceName, originalTargetName) {
        //in ths case we need to remove the connection from target
        $scope.connectionDetached(sourceName, originalTargetName);
      };

      $scope.propertyDidDrag = function(data, event) {

        var leftPanelWidth = angular.element('#left-column')[0].clientWidth;

        var uniqueId = _.uniqueId(data.name + '-');

        var c = new UIComponents.Component(
          uniqueId,
          data.name,
          generateComponentName(data.name),
          data.image,
          $scope.types.complex[data.name].types.required,
          $scope.types.complex[data.name].types.optional,
          data.description,
          event.x - leftPanelWidth,
          event.y,
          data.parent
        );

        $scope.addedComponents[c.name] = c;

        var parentName = data.parent;

        if (!$scope.template.Resources[parentName].Properties[data.name]) {
          $scope.template.Resources[parentName].Properties[data.name]  = [];
        }

        var newEntry = {};
        newEntry[c.name] = {};
        $scope.template.Resources[parentName].Properties[data.name].push(newEntry);

        UIComponents.connectComponents(parentName, c.name);
        itemSelected(c);
      };

      //-----------------------------------------------------
      // Synchrnoization between editor json and object model
      //-----------------------------------------------------
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
        _.each($scope.addedComponents, function (component, componentName) {

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
            _.each(AWSComponents.components, function (component) {
              if (component.name === blueprintName) {

                found = true;
                var blueprint = component;
                var uniqueId = _.uniqueId(blueprint.name + '-');
                var c = new UIComponents.Component(
                  uniqueId,
                  blueprint.name,
                  resourceName,
                  blueprint.image,
                  $scope.componentMetadata[blueprint.name].properties.required,
                  $scope.componentMetadata[blueprint.name].properties.optional,
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
    }]);
