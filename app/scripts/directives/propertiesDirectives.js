/**
 * Created by Fathalian on 11/8/14.
 */
'use strict';

var app = angular.module('nestorApp.directives');

app.directive('properties', [function () {
  return {
    replace: true,
    restrict: 'E',
    scope: {
      component: '=',
      template: '=',
      onPropertyDrag: '&'
    },
    templateUrl: 'templates/properties.html',
    link: function (scope) {

      //select the type of property
      if(scope.component.isDerived) {
        scope.componentModel = scope.template.Resources[scope.component.parent].Properties[scope.type];
      } else {
        scope.componentModel = scope.template.Resources[scope.component.name].Properties;
      }

      scope.propertyDragged = function($data, $event) {
        scope.onPropertyDrag({data: $data, event: $event});
      };
    }
  };
}]);

app.directive('componentProperties', ['AWSComponents', function (AWSComponents) {
  return {
    replace: true,
    restrict: 'E',
    scope: {
      componentName: '=',
      componentProperties: '=',
      componentModel: '=',
      onPropertyDrag: '&'
    },
    templateUrl: 'templates/component_properties.html',
    link: function (scope) {

      scope.types = AWSComponents.propertyTypes;


      scope.dragFinished = function ($data, $event) {
        $data.parent = scope.componentName;
        scope.onPropertyDrag({data: $data, event: $event});
      };

      scope.isTable = function(prop) {
        return scope.types.complex[prop.type] && scope.types.complex[prop.type].Display.type === 'table';
      };

      scope.isPrimitive = function(prop) {
        return prop.type === 'String' || prop.type === 'Integer' || prop.type === 'Boolean';
      };

      scope.isDrager = function(prop) {
        return scope.types.complex[prop.type] && scope.types.complex[prop.type].Display.type === 'drag';
      };
    }
  };

}]);


app.directive('derivedProperties', ['AWSComponents',
  function (AWSComponents) {
  return {
    replace: true,
    restrict: 'E',
    scope: {
      component: '=',
      componentProperties: '=',
      componentModel: '='
    },
    templateUrl: 'templates/derived_properties.html',
    link: function (scope) {

      scope.types = AWSComponents.propertyTypes;

      scope.model = scope.componentModel[scope.component.type][scope.component.index];

      scope.isTable = function(prop) {
        return scope.types.complex[prop.type] &&
          scope.types.complex[prop.type].Display.type === 'table';
      };

      scope.isPrimitive = function(prop) {
        return prop.type === 'String' || prop.type === 'Integer' || prop.type === 'Boolean';
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
    templateUrl: '../../templates/primitive_properties.html',
    link: function(scope) {

      if (scope.property.type === 'Boolean') {
        scope.inputType = 'checkbox';
      } else if (scope.property.type === 'Integer') {
        scope.inputType = 'number';
      } else {
        scope.inputType = 'text';
      }
      if (!scope.model && scope.property.default) {
        scope.model = scope.property.default[0];
      }


      if (scope.property.allowableValues) {

        scope.showSelect = true;
        scope.allowableValues = [];
        _.each(scope.property.allowableValues, function( valueObj ) {
          _.each(valueObj, function(value, key) {
            if (scope.model === value) {
              scope.selectedItem = {name:key, value: value};
            }
            //scope.allowableValues.push(value);
            scope.allowableValues.push({name:value, value: key});
          });
        });

        scope.x = scope.allowableValues[0].name;
      } else {
        scope.showSimple = true;
      }


      scope.itemSelected = function(selectedItem) {
        scope.model = selectedItem;
      };
    }
  };
}]);

app.directive('tableProperty', [function () {
  return {
    replace: true,
    restrict: 'E',
    scope: {
      property: '=',
      propertyTypes: '=',
      propertyModel: '='
    },
    templateUrl: '../../templates/table_properties.html',
    link: function (scope) {

      scope.propertyHeadings = {
        required: scope.propertyTypes.types.required,
        optional: scope.propertyTypes.types.optional
      };
      scope.loadAllowableValues = function(item) {
        item.valueMap = [];
        _.each(item.allowableValues, function(valueObj){
          _.each(valueObj, function(value, key) {
            item.valueMap.push({name: value, value: key});
          });
        });
      };

      scope.AddToTable = function (listToAddTo, componentName, neededFields) {

        var allFields = neededFields.required || [];
        if (neededFields.optional) {
          allFields.concat(neededFields.optional);
        }
        var item = {};
        _.each(allFields, function (property) {
          item[property.name] = property.type;
        });

        if (!listToAddTo[componentName]) {
          listToAddTo[componentName] = [];
        }

        listToAddTo[componentName].push(item);
      };

      scope.saveEntry = function($data, $index) {
        var resourceProperties = scope.propertyModel[scope.property.name][$index];
        _.each($data, function(enteredValue, enteredName) {
          if (enteredValue && enteredValue.value) {
            enteredValue = enteredValue.value;
          }
          resourceProperties[enteredName] = enteredValue;
        });
      };

      scope.removeRow = function($index) {
        scope.propertyModel[scope.property.name].splice($index,1);
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
        image: scope.propertyTypes.Display.image
      };

      scope.dragCompleted = function ($data, $event) {
        scope.onDragComplete({$data: $data, $event: $event});
      };
    }
  };
}]);
