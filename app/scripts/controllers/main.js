'use strict';

/**
 * @ngdoc function
 * @name cloakAndDaggerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cloakAndDaggerApp
 */
angular.module('cloakAndDaggerApp')
  .controller('MainCtrl', ['$scope', function ($scope) {
    $scope.mapObject = {
        scope: 'world',
        options: {
            height: 400,
            legendHeight: 60 // optionally set the padding for the legend
        },
    }
  }]);
