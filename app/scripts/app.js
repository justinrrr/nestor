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
  .module('nestorApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'pageslide-directive',
    'ngDraggable',
    'nestorApp.services'
  ])

  .config(function ($routeProvider) {
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
