/**
 * Created by CodeMaster(Farzad) on 11/22/14.
 */

'use strict';

var app = angular.module('nestorApp.services');

app.service('CFTemplate', ['UIComponents', 'ConnectionUtils', function (UIComponents, ConnectionUtils) {

    // the Cloud Formation Template
    var cfTemplate;
    var createInitialTemplate = function () {
      return {
        AWSTemplateFormatVersion: '2010-09-09',
        Description: 'Created By pdestal',
        Parameters: {},
        Mappings: {},
        Conditions: {},
        Resources: {},
        Outputs: {}
      };
    };


    /*
     * resourceName:  the name of the item to be retrieved from Resources in Cloud Formation Template
     * */
    this.getResource = function (resourceName) {
      // if the current template is not initialized we are done
      if (cfTemplate === undefined || resourceName === undefined) {
        return undefined;
      }

      return cfTemplate.Resources[resourceName];
    };

    this.getAllResources = function () {
      var resources = [];
      _.each(cfTemplate.Resources, function (resourceObj, resourceName) {
        resources.push({ name: resourceName, type: resourceObj.Type });
      });
      return resources;
    };

    this.getPropertyForResource = function (propertyName, resourceName) {
      if (!propertyName || !resourceName) {
        return;
      }
      return cfTemplate.Resources[resourceName].Properties[propertyName];
    };

    this.getPropertiesForResource = function (resourceName) {
      return cfTemplate.Resources[resourceName].Properties;
    };

    /* This method returns the string version of our Cloud Formation Template*/
    this.getStringFormat = function () {
      if (cfTemplate === undefined) {
        cfTemplate = createInitialTemplate();
      }
      return angular.toJson(cfTemplate, true);
    };

    this.getPrivateTemplate = function() {
      return cfTemplate;
    };

    /* this method replaces the internal Cloud Formation Template
     * this is especially useful when the user selects a preconfigured solution (i.e. task) */
    this.setTemplate = function (newTemplate) {
      if (newTemplate === undefined) {
        cfTemplate = createInitialTemplate();
      } else {
        cfTemplate = newTemplate;
      }

    };

    /*
     * resourceName:  the name of the item to be added under Resources in Cloud Formation Template
     * resourceType:  the type of the above Resource
     * list of Outputs for this Resource. each element of this list should be an object like
     * { name: 'someName' , description: 'some description', type: 'some type' }
     *
     * */
    this.addResource = function (resourceName, resourceType, outputs) {
      // create the template if it's not already initialized
      if (cfTemplate === undefined) {
        cfTemplate = createInitialTemplate();
      }

      // create the required Resource in our Template
      cfTemplate.Resources[resourceName] = {
        Type: resourceType
      };

      // this Resource doesn't have any properties yet
      cfTemplate.Resources[resourceName].Properties = {};

      // add the possible outputs
      _.each(outputs, function (outputMetdata) {
        if (outputMetdata.type === 'Ref') {
          var outputObj = {
            Description: outputMetdata.description,
            Value: {Ref: resourceName}
          };
          cfTemplate.Outputs[resourceName + outputMetdata.name] = outputObj;
        }
      });

    };

        // this function takes an object and a property name
        // returns true if the obj contains the property directly or indirectly (via its children)
        // otherwise, returns false
        var doesObjectContainProperty = function (obj, propName) {

            if (obj === undefined) {
                return false;
            }

            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (propName === prop) {
                        return true;
                    } else if ( doesObjectContainProperty(prop,propName) === true ) {
                        return true;
                    }
                }
            }


            return false;
        };


        /*
         * resourceName:  the name of the item to be removed from Resources in Cloud Formation Template
         * */
    this.removeResource = function (resourceName) {

      // if the current template is not initialized we are done
      if (cfTemplate === undefined) {
        return;
      }

      // TODO: what if the to-be-deleted component wasn't a "Resource"?
      delete cfTemplate.Resources[resourceName];

        for (var otherResourceName in cfTemplate.Resources) {
            if (cfTemplate.Resources.hasOwnProperty(otherResourceName)) {
                if (otherResourceName.properties !== undefined) {
                    if (doesObjectContainProperty(otherResourceName.properties),resourceName) {
                        delete cfTemplate.Resources[otherResourceName].Properties;
                    }
                }
            }
        }

        // update the "Output" secion in Cloud Formation Template
      var allOutputs = Object.keys(cfTemplate.Outputs);

      for (var i = 0; i < allOutputs.length; i += 1) {
        if (cfTemplate.Outputs[allOutputs[i]].Value.Ref === resourceName) {
          delete cfTemplate.Outputs[allOutputs[i]];
          break;
        }
      }

    };

    this.addComplexPropertyToResource = function (propertyName, resourceName) {
      var index;
      if (cfTemplate.Resources[resourceName].Properties[propertyName] === undefined) {
        cfTemplate.Resources[resourceName].Properties[propertyName] = [];
      }
      index = cfTemplate.Resources[resourceName].Properties[propertyName].length;
      cfTemplate.Resources[resourceName].Properties[propertyName].push({});

      return index;
    };

    this.establishConnection = function(sourceName, sourceObject, targetName, targetObject, incomingProperies) {
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


      if (connectionHappened && incomingProperies.overlays) {
        return incomingProperies.overlays;
      }

      return [];
    };
  }]
);
