'use strict';

angular.module('nestorApp')
  .controller('MainCtrl', ['$scope', '$rootScope', '$modal', 'AWSComponents', 'UIComponents', 'ConnectionUtils', '$window',
    function ($scope, $rootScope, $modal, AWSComponents, UIComponents, ConnectionUtils, $window) {

      $scope.isBottomLeftOpen = false;
      $scope.isLeftOpen = false;
      $scope.isPropertiesShowing = false;

      //set up jsPlumb
      $scope.init = function () {
        UIComponents.setupJSPlumb($scope);
      };

      //create initial template
      $scope.template = AWSComponents.createInitialTemplate();
      $scope.templateString = angular.toJson($scope.template, true);
      //$scope.templateString = JSON.stringify($scope.template, null, 4);

      $scope.addedComponents = {};
      $scope.connections = [];

      //add initial DS
      $scope.componentNameCounters = {};
      $scope.components = AWSComponents.components;
      $scope.componentMetadata = AWSComponents.componentMetadata;
      $scope.types = AWSComponents.propertyTypes;
      $scope.tasks = AWSComponents.tasks;

      $scope.leftPanelOptions = [{name: 'Components', visible: true, image: 'images/component.png'}, {
        name: 'Tasks',
        visible: true,
        image: 'images/solutionstack.png'
      }, {name: 'Properties', visible: 'false', image: 'images/properties.png'}];
      //UI State
      $scope.isShowingTop = true;

      //--------------------------------------
      // Helpers functions
      //--------------------------------------
      function generateComponentName(type) {
        if (!$scope.componentNameCounters.type) {
          $scope.componentNameCounters.type = 1;
        }
        var counter = $scope.componentNameCounters.type;
        $scope.componentNameCounters.type++;
        return type + counter;
      }

      function addComponentToTemplate(blueprint, c) {

        $scope.addedComponents[c.name] = c;
        var componentName = c.name;
        var aMetadata = $scope.componentMetadata[blueprint.type];
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
            $scope.template.Outputs[componentName + outputMetdata.name] = outputObj;
          }
        });

        $scope.templateString = angular.toJson($scope.template, true);
        //$scope.templateString = JSON.stringify($scope.template, null, 4);
      }

      function itemSelected(component) {
        $scope.selectedComponent = component;
        $scope.isPropertiesShowing = true;
        selectElementInEditor(component.name);
      }

      function addComponent(blueprint, posX, posY) {

        var uniqueId = generateComponentName(blueprint.name);
        var c = new UIComponents.Component(
          uniqueId,
          blueprint.type,
          uniqueId,
          blueprint.image,
          $scope.componentMetadata[blueprint.type].properties.required,
          $scope.componentMetadata[blueprint.type].properties.optional,
          blueprint.description,
          posX,
          posY);

        addComponentToTemplate(blueprint, c);

        itemSelected(c);
      }


      //--------------------------------------
      // UI Events
      //--------------------------------------

      $scope.closeLeft = function () {

        $scope.isLeftOpen = !$scope.isLeftOpen;
        $rootScope.$broadcast('leftmostResizeRequest');
      };

      $scope.optionPressed = function (option) {

        switch (option.name) {
          case 'Components':
            $scope.showTasks = false;
            $scope.showProperties = false;
            $scope.showComponents = true;
            break;
          case 'Tasks' :
            $scope.showTasks = true;
            $scope.showProperties = false;
            $scope.showComponents = false;
            break;
          case 'Properties' :
            $scope.showTasks = false;
            $scope.showProperties = true;
            $scope.showComponents = false;
            break;
          default:
            break;
        }

        if (!$scope.isLeftOpen) {
          $scope.isLeftOpen = true;
          $rootScope.$broadcast('leftmostResizeRequest');
        }
      };

      $scope.componentPressed = function (component) {
        $scope.isShowingTop = false;
        $scope.nestedComponent = component;
      };

      $scope.componentBackPressed = function () {
        $scope.isShowingTop = true;
      };

      $scope.onDragComplete = function ($data, $event) {

        //because of the fucking directive for ui layout
        //I need to use jquery here to compensate for the extra offset
        //caused by the editor
        var rightPanelWidth = angular.element('#left-panel')[0].clientWidth;

        addComponent($data, $event.x - rightPanelWidth - 85, $event.y - 50);

      };
      $scope.taskSelected = function (task) {
        $scope.template = task.template;
        $scope.addedComponents = task.components;
        $scope.connections = task.connections;

        _.each($scope.connections, function (connection) {
          UIComponents.connectComponents(connection.source, connection.target, false);
        });
      };


      $scope.showModal = function () {
        $modal.open({
          templateUrl: '../templates/modal_view.html',
          controller: 'CodeGenCtrl',
          size: 'lg'
        });
      };

      $scope.clickCallback = function (component) {
        itemSelected(component);
      };

      $scope.propertiesClicked = function () {
        $scope.showTasks = false;
        $scope.showProperties = true;
        $scope.showComponents = false;
        if (!$scope.isLeftOpen) {
          $scope.isLeftOpen = true;
          $rootScope.$broadcast('leftmostResizeRequest');
        }
      };
      /* this function is available on the scope so the UI (i.e. html) can call
       to completely delete a component:
       1) remove all the connections from UI
       2) remove the component from the UI
       3) update model to remove the component's data and all the references to the deleted component
       4) update the final CloudFormation Template */
      $scope.deleteClicked = function (component) {
        // find the UI element
        var toBeDeletedElem = angular.element('[data-identifier =' + component.id + ']')[0];

        // call "detach" on all the connections to/from this element to safely drop them (update the model)
        jsPlumb.detachAllConnections(toBeDeletedElem.id);

        // now remove all the connections to/from this element on the UI
        jsPlumb.removeAllEndpoints(toBeDeletedElem.id);

        // remove the component's data from the list of all components
        delete $scope.addedComponents[component.name];

        // update the actual template: remove from the components
        // TODO: what if the to-be-deleted component wasn't a "resource"?
        delete $scope.template.Resources[component.name];

        // update the "Output" secion in our CloudFormation template
        var allOutputs = Object.keys($scope.template.Outputs);
        for (var i = 0; i < allOutputs.length; i += 1) {
          if ($scope.template.Outputs[allOutputs[i]].Value.Ref === component.name) {
            delete $scope.template.Outputs[allOutputs[i]];
            break;
          }
        }

      };

      $scope.connectionEstablished = function (sourceName, targetName) {

        $scope.connections.push({source: sourceName, target: targetName});

        var sourceObject = $scope.template.Resources[sourceName];
        var targetObject = $scope.template.Resources[targetName];

        var incomingProperies = $scope.componentMetadata[targetObject.Type].IncomingConnection[sourceObject.Type];

        var finalTarget;
        var connectionHappened;

        // If this connection needs to update Target
        if (incomingProperies.isProperty === 'true') {
          finalTarget = targetObject.Properties;
        }
        else {
          finalTarget = targetObject;
        }

        connectionHappened = ConnectionUtils.connectObjectsThroughProps(incomingProperies.targetPropName, incomingProperies.targetPropValue,
          incomingProperies.targetPropValueMethod, incomingProperies.targetPolicy,
          finalTarget, sourceObject, sourceName);


        // If this connection needs to update Source
        if (incomingProperies.isProperty === 'true') {
          finalTarget = sourceObject.Properties;
        }
        else {
          finalTarget = sourceObject;
        }

        connectionHappened = connectionHappened || ConnectionUtils.connectObjectsThroughProps(incomingProperies.sourcePropName, incomingProperies.sourcePropValue,
          incomingProperies.sourcePropValueMethod, incomingProperies.sourcePolicy,
          finalTarget, targetObject, targetName);


        if (connectionHappened) {
          $scope.$digest();
          return incomingProperies.overlays;
        }

        return [];
      };


      $scope.connectionDetached = function (sourceName, targetName) {
        var sourceObject = $scope.template.Resources[sourceName];
        var targetObject = $scope.template.Resources[targetName];

        var incomingProperies = $scope.componentMetadata[targetObject.Type].IncomingConnection[sourceObject.Type];

        var finalTarget;

        // If this connection needs to update Target
        if (incomingProperies.isProperty === 'true') {
          finalTarget = targetObject.Properties;
        }
        else {
          finalTarget = targetObject;
        }

        ConnectionUtils.deleteBinding(incomingProperies.targetPropName, incomingProperies.targetPropValue,
          incomingProperies.targetPropValueMethod, incomingProperies.targetPolicy,
          finalTarget, sourceObject, sourceName);


        // If this connection needs to update Source
        if (incomingProperies.isProperty === 'true') {
          finalTarget = sourceObject.Properties;
        }
        else {
          finalTarget = sourceObject;
        }

        ConnectionUtils.deleteBinding(incomingProperies.sourcePropName, incomingProperies.sourcePropValue,
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

        var leftPanelWidth = angular.element('#left-panel')[0].clientWidth;

        var uniqueId = generateComponentName(data.name);

        var c = new UIComponents.Component(
          uniqueId,
          data.name,
          uniqueId,
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
        c.index = $scope.template.Resources[parentName].Properties[data.name].length;
        $scope.template.Resources[parentName].Properties[data.name].push(newEntry);

        UIComponents.connectComponents(parentName, c.name, true);
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
          if ($scope.templateString === '') {

            $scope.template = AWSComponents.createInitialTemplate();
            $scope.templateString = angular.toJson($scope.template, true);
            //$scope.templateString = JSON.stringify($scope.template, null, 4);

            $scope.addedComponents = {};
            $scope.connections = [];

          }
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

      $scope.download = function () {
        $window.open('data:text/text;charset=utf-8,' + encodeURIComponent($scope.templateString));
      };


      //======================== Text Editor stuff
      var editor;
      $scope.aceEditorLoaded = function (_editor) {
        editor = _editor;
      };

      function selectElementInEditor(elementName) {
        window.setTimeout(function () {
          //get some of the regex magic going on to detect the correct part
          var regex = '"' + elementName + '"(\\s)*:(\\s)*';
          editor.find(regex, {regExp: true}, true);
          //editor.addSelectionMarker(range);
          editor.focus();
          editor.setHighlightGutterLine(true);
          editor.centerSelection();
        }, 100);
      }
    }]);
