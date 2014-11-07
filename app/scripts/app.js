'use strict';

/**
 * @ngdoc overview
 * @name nestorApp
 * @description
 * # nestorApp
 *
 * Main module of the application.
 */

angular
  .module('nestorApp.services', []);

angular
  .module('nestorApp.directives', []);

var app = angular
  .module('nestorApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'pageslide-directive',
    'ngDraggable',
    'ui.bootstrap',
    'ui.layout',
    'ui.ace',
    'xeditable',
    'nestorApp.services',
    'nestorApp.directives'
  ]);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.run(function (editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
