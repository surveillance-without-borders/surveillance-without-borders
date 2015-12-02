'use strict';

/**
 * @ngdoc function
 * @name cloakAndDaggerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cloakAndDaggerApp
 */
angular.module('cloakAndDaggerApp')
  .controller('MainCtrl', ['$scope', '$rootScope', '$http',
              function ($scope, $rootScope, $http) {
    var csvToCategory = {
            "Leaders": 'data/Politicians-processed.csv',
            "Corporate collaboration": 'data/CollaborationIAC-processed.csv',
            "Intelligence": 'data/CollaborationINT-processed.csv',
            "Corporations": 'data/Corporations-processed.csv',
            "Mass": 'data/PubMASS-processed.csv',
            "Targeted": 'data/PubTARGETED-processed.csv'
    },
        countryMapping = {},
        loadedCategories = [];
    function loadMap(category) {
        $http.get(csvToCategory[category]).then(function(response) {
            var countryColors = {};
            angular.forEach(d3.csv.parse(response.data), function(row) {
                angular.forEach(row['Countries'].split(","), function(country) {
                    country = country.replace(/^\s+/g, '');
                    if (typeof countryMapping[country] === 'undefined') {
                        countryMapping[country] = {}
                    }
                    if (typeof countryMapping[country][category] === 'undefined') {
                        countryMapping[country][category] = [];
                    }
                    if (country.match(/^[A-Z]+$/)) {
                        // XXX This is super ghetto
                        if (loadedCategories.indexOf(category) == -1) {
                            countryMapping[country][category].push(row);
                        }
                        countryColors[country] = {
                            "fillKey": "EXISTS"
                        };
                    }
                });
            });
            $scope.mapObject = {
                scope: 'world',
                options: {
                    height: 300,
                    legendHeight: 60
                },
                fills: {
                    'EXISTS': '#CC4731',
                    'defaultFill': '#DDDDDD'
                },
                data: countryColors
            };
            loadedCategories.push(category);
        });
    }

    $scope.infoBox = false;

    $scope.openPanel = function(category) {
        $scope.selectedCategory = category;
        $scope.infoBox = false;
        loadMap(category);
    };

    $scope.updateActiveGeography = function(geo) {
        $scope.selectedCountry = geo.properties.name;
        $scope.infoBox = true;
        $scope.geoData = countryMapping[geo.id][$scope.selectedCategory];
        $scope.$apply();
    };
    $scope.openPanel("Leaders");
  }]);
