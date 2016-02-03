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
        controller: 'PageCtrl',
        activetab: 'about'
      })
      .when('/what-now', {
        templateUrl: 'views/what-now.html',
        controller: 'PageCtrl',
        activetab: 'what-now'
      })
      .when('/contribute', {
        templateUrl: 'views/contribute.html',
        controller: 'PageCtrl',
        activetab: 'contribute'
      })
      .when('/art', {
        templateUrl: 'views/art.html',
        controller: 'PageCtrl',
        activetab: 'art'
     })   
      .otherwise({
        redirectTo: '/'
      });
  })
  .controller('NavbarCtrl', function($scope, $route) {
      $scope.$route = $route;
  });
