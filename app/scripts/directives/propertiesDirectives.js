/**
 * Created by Fathalian on 11/8/14.
 */
'use strict';

var app = angular.module('nestorApp.directives');

app.directive('componentProperties', [function () {
  return {
    replace: true,
    restrict: 'E',
    scope: {
      propertyName: '=',
      componentProperties: '=',
      resourceProperties: '=',
      onPropertyDrag: '&',
      types: '='
    },
    templateUrl: 'templates/component_properties.html',
    link: function (scope) {
      scope.AddToTable = function (listToAddTo, propertyName, neededFields) {

        var item = {};
        _.each(neededFields, function (property) {
          item[property.name] = property.type;
        });

        if (!listToAddTo[propertyName]) {
          listToAddTo[propertyName] = [];
        }

        listToAddTo[propertyName].push(item);
      };

      scope.dragFinished = function ($data, $event) {
        $data.parent = scope.propertyName;
        scope.onPropertyDrag({data: $data, event: $event});
      };
    }
  };

}]);


app.directive('derivedProperties', [function () {
  return {
    replace: true,
    restrict: 'E',
    scope: {
      propertyName: '=',
      componentProperties: '=',
      resourceProperties: '=',
      types: '='
    },
    templateUrl: 'templates/derived_properties.html',
    link: function (scope) {
      scope.AddToTable = function (listToAddTo, propertyName, neededFields) {

        var item = {};
        _.each(neededFields, function (property) {
          item[property.name] = property.type;
        });

        if (!listToAddTo[propertyName]) {
          listToAddTo[propertyName] = [];
        }

        listToAddTo[propertyName].push(item);
      };
    }
  };

}]);

app.directive('primitiveProperty', [function () {
  return {
    replace: true,
    restrict: 'E',
    transclude: true,
    scope: {
      property: '=',
      model: '='
    },
    templateUrl: '../../templates/primitive_properties.html'
  };
}]);

app.directive('tableProperty', [function () {
  return {
    replace: true,
    restrict: 'E',
    scope: {
      property: '=',
      propertyTypes: '=',
      resourceProperties: '='
    },
    templateUrl: '../../templates/table_properties.html',
    link: function (scope) {
      scope.removeFromTable = function () {

      };

      scope.AddToTable = function (listToAddTo, propertyName, neededFields) {

        var allFields = neededFields.required;
        if (neededFields.optional) {
          allFields.concat(neededFields.optional);
        }
        var item = {};
        _.each(allFields, function (property) {
          item[property.name] = property.type;
        });

        if (!listToAddTo[propertyName]) {
          listToAddTo[propertyName] = [];
        }

        listToAddTo[propertyName].push(item);
      };

      scope.saveEntry = function($data, $index) {
        var resourceProperties = scope.resourceProperties[scope.property.name][$index];
        _.each($data, function(enteredValue, enteredName) {

          resourceProperties[enteredName] = enteredValue;
        });
      };

      scope.removeRow = function($index) {

        scope.resourceProperties[scope.property.name].splice($index,1);
      };



    }
  };
}]);

app.directive('dragProperty', [function () {
  return {
    replace: true,
    restrict: 'E',
    transclude: true,
    scope: {
      property: '=',
      propertyTypes: '=',
      onDragComplete: '&'
    },
    templateUrl: '../../templates/drag_properties.html',
    link: function (scope) {
      scope.dragData = {
        name: scope.property.name,
        image: scope.propertyTypes.Display.image,
        belongsTo: 'me'
        //description: scope.propertyTypes.Description
      };

      scope.dragCompleted = function ($data, $event) {
        scope.onDragComplete({$data: $data, $event: $event});
      };
    }
  };
}]);
