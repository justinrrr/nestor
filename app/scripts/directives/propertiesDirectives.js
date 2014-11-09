/**
 * Created by Fathalian on 11/8/14.
 */
'use strict';

var app = angular.module('nestorApp.directives');

app.directive('componentProperties', [function () {
  return {
    replace: true,
    restrict: 'E',
    transclude: true,
    scope: {
      componentProperties: '=',
      resourceProperties: '=',
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
      propertyTypes: '='
    },
    templateUrl: '../../templates/drag_properties.html',
    link : function(scope) {
      scope.dragData = {
        name: scope.property.name,
        image: scope.propertyTypes.Display.image,
        belongsTo:  'me'
        //description: scope.propertyTypes.Description
      };
    }
  };
}]);
