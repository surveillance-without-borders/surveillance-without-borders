'use strict';

/**
 * @ngdoc overview
 * @name cloakAndDaggerApp
 * @description
 * # cloakAndDaggerApp
 *
 * Main module of the application.
 */
angular
  .module('cloakAndDaggerApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'datamaps'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        activetab: 'home'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        activetab: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .controller('NavbarCtrl', function($scope, $route) {
      $scope.$route = $route;
  });
