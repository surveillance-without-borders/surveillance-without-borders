'use strict';

/**
 * @ngdoc function
 * @name cloakAndDaggerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cloakAndDaggerApp
 */
angular.module('cloakAndDaggerApp')
  .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
    console.log(d3);
    $http.get('data/Politicians.csv').then(function(response) {
        var country_mapping = {};
        angular.forEach(d3.csv.parse(response.data), function(row) {
            angular.forEach(row["Countries"].split(","), function(country) {
                country = country.replace(/^\s+/g, '');
                if (typeof country_mapping[country] == 'undefined') {
                    country_mapping[country] = [];
                }
                country_mapping[country].push(row);
            });
        });
        console.log(country_mapping);
        $scope.mapObject = {
            scope: 'world',
            options: {
                height: 400,
                legendHeight: 60 // optionally set the padding for the legend
            },
        }
    })
  }]);
