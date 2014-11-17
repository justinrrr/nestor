/**
 * Created by codemaster on 11/16/14.
 */

'use strict';

var app = angular.module('nestorApp.services');

app.service('ConnectionUtils', function () {

  // adds 'val' to a list called 'listProp' on object 'obj'
  var addValueToListPropertyOfObject = function (obj, listProp, val) {
    if (obj.hasOwnProperty(listProp)) {
      obj[listProp].push(val);
    }
    else {
      obj[listProp] = [val];
    }
  };

  // removes 'val' from a list called 'listProp' on object 'obj'
  var removeValueFromListPropertyOfObject = function (obj, listProp, val) {
    var idx = obj[listProp].indexOf(val);
    if (idx > -1) {
      obj[listProp].splice(idx, 1);
    }
  };

  this.connectObjectsThroughProps = function (propName, propValue, propValueMethod, updatePolicy, targetObj, sourceObj, resourceName) {

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
  };

  this.deleteBinding = function (propName, propValue, propValueMethod, updatePolicy, targetObj, sourceObj, resourceName) {

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


  };


});

