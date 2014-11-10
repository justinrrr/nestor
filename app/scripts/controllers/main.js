'use strict';

angular.module('nestorApp')
  .controller('MainCtrl', ['$scope', '$modal', 'AWSComponents', 'UIComponents',
    function ($scope, $modal, AWSComponents, UIComponents) {


      //set up jsPlumb
      $scope.init = function () {
        UIComponents.setupJSPlumb($scope);
      };

      //create initial template
      $scope.template = AWSComponents.createInitialTemplate();
      $scope.templateString= angular.toJson($scope.template, true);
      //$scope.templateString = JSON.stringify($scope.template, null, 4);

      $scope.addedComponents = {};

      //add initial DS
      $scope.componentNameCounters = {};
      $scope.components = AWSComponents.components;
      $scope.componentMetadata = AWSComponents.componentMetadata;
      $scope.types = AWSComponents.propertyTypes;
      $scope.tasks = AWSComponents.tasks;

      //--------------------------------------
      // Helpers functions
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

        $scope.templateString = angular.toJson($scope.template, true);
        //$scope.templateString = JSON.stringify($scope.template, null, 4);
      }

      function itemSelected(component) {
        $scope.selectedComponent = component;
      }

      function addComponent(blueprint, posX, posY) {

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
      }

      // adds 'val' to a list called 'listProp' on object 'obj'
      function addValueToListPropertyOfObject(obj, listProp, val) {
        if (obj.hasOwnProperty(listProp)) {
          obj[listProp].push(val);
        }
        else {
          obj[listProp] = [val];
        }
      }

      // removes 'val' from a list called 'listProp' on object 'obj'
      function removeValueFromListPropertyOfObject(obj, listProp, val) {
        var idx = obj[listProp].indexOf(val);
        if (idx > -1) {
          obj[listProp].splice(idx, 1);
        }
      }

      function connectObjectsThroughProps(propName, propValue, propValueMethod, updatePolicy, targetObj, sourceObj, resourceName) {

        // return immediate if any of the incoming arguments are not defined
        if (propName === undefined ||
          propValue === undefined ||
          propValueMethod === undefined ||
          updatePolicy === undefined) {
          return false;
        }


        if (propValueMethod === 'pure') {
          if (updatePolicy === 'append') {
            addValueToListPropertyOfObject(targetObj, propName, sourceObj[propValue]);
          } else { //assign
            //edge case:
            if (propValue === 'Name') {
              targetObj[propName] = resourceName;
            }
            else {
              targetObj[propName] = sourceObj[propValue];
            }
          }
        }
        else if (propValueMethod === 'ref') {
          if (updatePolicy === 'append') {
            addValueToListPropertyOfObject(targetObj, propName, { Ref: resourceName});
          } else { //assign
            targetObj[propName] = { Ref: resourceName};
          }
        }
        else if (propValueMethod === 'attribute') {

          if (updatePolicy === 'append') {
            addValueToListPropertyOfObject(targetObj, propName, { 'Fn::GetAtt': [resourceName, propValue] });
          } else { //assign
            targetObj[propName] = { Ref: resourceName};
          }

        }

        return true;
      }

      function deleteBinding(propName, propValue, propValueMethod, updatePolicy, targetObj, sourceObj, resourceName) {

        // return immediate if any of the incoming arguments are not defined
        if (propName === undefined ||
          propValue === undefined ||
          propValueMethod === undefined ||
          updatePolicy === undefined) {
          return;
        }


        if (updatePolicy === 'append') {
          if (propValueMethod === 'pure') {
            removeValueFromListPropertyOfObject(targetObj, propName, sourceObj[propValue]);
          }
          else if (propValueMethod === 'ref') {
            removeValueFromListPropertyOfObject(targetObj, propName, { Ref: resourceName});
          }
          else if (propValueMethod === 'attribute') {
            removeValueFromListPropertyOfObject(targetObj, propName, { 'Fn::GetAtt': [resourceName, propValue] });
          }
        } else {
          delete targetObj[propName];
        }


      }

      //--------------------------------------
      // UI Events
      //--------------------------------------
      $scope.onDragComplete = function ($data, $event) {

        //because of the fucking directive for ui layout
        //I need to use jquery here to compensate for the extra offset
        //caused by the editor
        var leftPanelWidth = angular.element('#left-column')[0].clientWidth;

        //HACK: These numbers are used to align some shit. We have to read it dynamically
        addComponent($data, $event.x - leftPanelWidth-85, $event.y-50);
      };

      $scope.showModal = function() {
        $modal.open({
          templateUrl: '../templates/modal_view.html',
          controller: 'CodeGenCtrl',
          size: 'lg'
        });
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

        var finalTarget;
        var connectionHappened;

        // If this connection needs to update Target
        if (incomingProperies.isProperty === 'true') {
          finalTarget = targetObject['Properties'];
        }
        else {
          finalTarget = targetObject;
        }

        connectionHappened = connectObjectsThroughProps(incomingProperies.targetPropName, incomingProperies.targetPropValue,
          incomingProperies.targetPropValueMethod, incomingProperies.targetPolicy,
          finalTarget, sourceObject, sourceName);


        // If this connection needs to update Source
        if (incomingProperies.isProperty === 'true') {
          finalTarget = sourceObject['Properties'];
        }
        else {
          finalTarget = sourceObject;
        }

        connectionHappened = connectionHappened || connectObjectsThroughProps(incomingProperies.sourcePropName, incomingProperies.sourcePropValue,
          incomingProperies.sourcePropValueMethod, incomingProperies.sourcePolicy,
          finalTarget, targetObject, targetName);


        if (connectionHappened) {
          $scope.$digest();
          return incomingProperies.overlays;
        }

        return [];
      };


      $scope.connectionDetached = function (sourceName, targetName) {
        /*

         if (!incomingConnectionProperies.isProperty) {
         if (incomingConnectionProperies.value === 'Name') {
         delete $scope.template.Resources[targetName][incomingConnectionProperies.name];
         $scope.$digest();
         }
         }
         */
        var sourceObject = $scope.template.Resources[sourceName];
        var sourceType = AWSComponents.typeMappings[sourceObject.Type];

        var targetObject = $scope.template.Resources[targetName];
        var targetType = AWSComponents.typeMappings[targetObject.Type];

        var incomingProperies = $scope.componentMetadata[targetType].IncomingConnection[sourceType];

        var finalTarget;

        // If this connection needs to update Target
        if (incomingProperies.isProperty === 'true') {
          finalTarget = targetObject['Properties'];
        }
        else {
          finalTarget = targetObject;
        }

        deleteBinding(incomingProperies.targetPropName, incomingProperies.targetPropValue,
          incomingProperies.targetPropValueMethod, incomingProperies.targetPolicy,
          finalTarget, sourceObject, sourceName);


        // If this connection needs to update Source
        if (incomingProperies.isProperty === 'true') {
          finalTarget = sourceObject['Properties'];
        }
        else {
          finalTarget = sourceObject;
        }

        deleteBinding(incomingProperies.sourcePropName, incomingProperies.sourcePropValue,
          incomingProperies.sourcePropValueMethod, incomingProperies.sourcePolicy,
          finalTarget, targetObject, targetName);


        $scope.$digest();

      };

      $scope.connectionMovedFromSource = function (/*originalSourceName, newSourceName, targetName*/) {
        //in this case we need to change the name of the property on the target to
        //the new source
      };

      $scope.connectionMovedFromTarget = function (sourceName, originalTargetName) {
        //in ths case we need to remove the connection from target
        $scope.connectionDetached(sourceName, originalTargetName);
      };

      $scope.propertyDidDrag = function (data, event) {

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

        //determines whether the component is standalone or derived
        c.isDerived = true;

        $scope.addedComponents[c.name] = c;

        var parentName = data.parent;

        if (!$scope.template.Resources[parentName].Properties[data.name]) {
          $scope.template.Resources[parentName].Properties[data.name] = [];
        }

        var newEntry = {};
        $scope.template.Resources[parentName].Properties[data.name].push(newEntry);

        UIComponents.connectComponents(parentName, c.name);
        itemSelected(c);
      };

      //-----------------------------------------------------
      // Synchrnoization between editor json and object model
      //-----------------------------------------------------
      $scope.$watch('template', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            var test = angular.toJson($scope.template, true);

          $scope.templateString = test;
          //$scope.templateString = JSON.stringify($scope.template, null, 4);
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
