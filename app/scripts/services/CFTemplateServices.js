/**
 * Created by CodeMaster(Farzad) on 11/22/14.
 */

'use strict';

var app = angular.module('nestorApp.services');

app.service('CFTemplate', function () {

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
      if (!propertyName || !resourceName){
        return;
      }
      return cfTemplate.Resources[resourceName].Properties[propertyName];
    };

    this.getPropertiesForResource = function (resourceName) {
      return cfTemplate.Resources[resourceName].Properties;
    };

    /* This method returns the string version of our Cloud Formation Template*/
    var getStringForm = function getStringForm() {
      if (cfTemplate === undefined) {
        cfTemplate = createInitialTemplate();
      }
      return angular.toJson(cfTemplate, true);
    };

    this.getStringFormat = getStringForm;


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

  }
);
