'use strict';

/**
 * @ngdoc function
 * @name cloakAndDaggerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cloakAndDaggerApp
 */
angular.module('cloakAndDaggerApp')
  .controller('MainCtrl', ['$scope', '$rootScope', '$http', '$anchorScroll', '$location',
              function ($scope, $rootScope, $http, $anchorScroll, $location) {
    var csvToCategory = {
            "Leaders": 'data/Politicians-processed.csv',
            "Corporate collaboration": 'data/CollaborationIAC-processed.csv',
            "Intelligence": 'data/CollaborationINT-processed.csv',
            "Corporations": 'data/Corporations-processed.csv',
            "Mass": 'data/PubMASS-processed.csv',
            "Targeted": 'data/PubTARGETED-processed.csv'
    },
        countryMapping = {};

    $scope.revelations = {};

    function loadCategoryData(category, cb) {
        if (typeof countryMapping[category] !== "undefined") {
            cb(countryMapping[category]);
        } else {
            countryMapping[category] = {};
            $scope.revelations[category] = [];
            $http.get(csvToCategory[category]).then(function(response) {
                angular.forEach(d3.csv.parse(response.data), function(row) {
                    $scope.revelations[category].push(row);
                    angular.forEach(row['Countries'].split(","), function(country) {
                        country = country.replace(/^\s+/g, '');
                        if (typeof countryMapping[category][country] === 'undefined') {
                            countryMapping[category][country] = [];
                        }
                        if (country.match(/^[A-Z]+$/)) {
                            countryMapping[category][country].push(row);
                        }
                    });
                });
                cb(countryMapping[category]);
            });
        }
    }

    function loadCategory(category, cb) {
        loadCategoryData(category, function(countryData) {
            var countryColors = {};
            if ($scope.selectedCountry !== undefined) {
                countryColors[$scope.selectedCountry.id] = {
                    'fillKey': 'SELECTED'
                }
            }
            for (var alpha3 in countryData) {
                if (!$scope.selectedCountry || alpha3 != $scope.selectedCountry.id) {
                    countryColors[alpha3] = {
                        'fillKey': 'EXISTS'
                    }
                }
                $scope.mapObject = {
                    scope: 'world',
                    options: {
                        height: 300,
                        legendHeight: 60
                    },
                    fills: {
                        'EXISTS': '#67C378',
                        'SELECTED': '#704279',
                        'defaultFill': '#DDDDDD'
                    },
                    data: countryColors
                };
            }
            if ($scope.selectedCountry) {
                $scope.selectedRevelations = countryData[$scope.selectedCountry.id];
            } else {
                 $scope.selectedRevelations = $scope.revelations[category];
            }
            if (cb !== undefined) {
                cb();
            }
        });
    }

    $scope.openPanel = function(category) {
        $scope.selectedCategory = category;
        loadCategory(category);
    };

    $scope.selectGlobal = function() {
        if ($scope.selectedCountry && $scope.selectedCountry.id == 'GLB') {
            delete $scope.selectedCountry;
        } else {
            $scope.selectedCountry = {
                 "id": "GLB",
                 "name": "Global"
            }
        }
        loadCategory($scope.selectedCategory, function(){
            $anchorScroll('details');
        });
    }

    $scope.updateActiveGeography = function(geo) {
        if ($scope.selectedCountry && geo.id === $scope.selectedCountry.id) {
             delete $scope.selectedCountry;
        } else {
            $scope.selectedCountry = {
                "name": geo.properties.name,
                "id": geo.id
            };
        }
        loadCategory($scope.selectedCategory, function(){
            $scope.$apply();
            $anchorScroll('details');
        });
    };
    $scope.openPanel("Leaders");
  }]);
