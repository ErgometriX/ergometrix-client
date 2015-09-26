'use strict';

var rankingCtrl = angular.module('rankingCtrl', []);

rankingCtrl
    .controller('RankingListCtrl', ['$scope', '$rootScope', 'API.Rankings',
        function($scope, $rootScope, Rankings) {
            $rootScope.pageActive = 'rankings';
            $scope.rankings = Rankings.query();
            $scope.removeRanking = function(rId) {
                Rankings.remove({id: rId}).$promise.then(function() {
                    $scope.rankings = Rankings.query();
                })
            }
        }
    ])
    .controller('RankingActionCtrl', ['$scope', '$rootScope', 'API.Rankings', '$location', 
        function($scope, $rootScope, Rankings, $location) {
            $rootScope.pageActive = '';
            var catVideU = [];
            var catVideC = [];
            var catVideA = [];
            angular.forEach($rootScope.categoriesBoat, function(cat) {
                catVideU[cat.codeN] = 0;
                catVideC[cat.codeN] = 0;
                catVideA[cat.codeN] = 0;
            });
            $scope.catCheck = {
                univ: catVideU,
                club: catVideC,
                amat: catVideA
            };
            $scope.switchCat = function(type, cat) {
                switch(type) {
                    case 'univ':
                        if ($scope.catCheck.univ[cat] == 0) {
                            $scope.catCheck.univ[cat] = 1;
                        } else {
                            $scope.catCheck.univ[cat] = 0;
                        }
                        break;
                    case 'club':
                        if ($scope.catCheck.club[cat] == 0) {
                            $scope.catCheck.club[cat] = 1;
                        } else {
                            $scope.catCheck.club[cat] = 0;
                        }
                        break;
                    case 'amat':
                        if ($scope.catCheck.amat[cat] == 0) {
                            $scope.catCheck.amat[cat] = 1;
                        } else {
                            $scope.catCheck.amat[cat] = 0;
                        }
                        break;
                }
            };
            $scope.addRanking = function(name, catCheck) {
                var categories = "";
                angular.forEach(catCheck, function(type, key) {
                    angular.forEach($rootScope.categoriesBoat, function(cat) {
                        if (type[cat.codeN] == 1) {
                            categories = categories + "," + cat.codeN + "-" + key.slice(0, 1).toUpperCase();
                        }
                    });
                });
                categories = categories.substr(1);
                Rankings.add({name: name, categoriesString: categories}).$promise.then(function(r) {
                    $location.path('/admin/rankings');
                });
            };
        }
    ])
    .controller('RankingEditCtrl', ['$scope', '$rootScope', 'API.Rankings', '$stateParams', '$location', 
        function($scope, $rootScope, Rankings, $stateParams, $location) {
            $rootScope.pageActive = '';
            var catVideU = [];
            var catVideC = [];
            var catVideA = [];
            angular.forEach($rootScope.categoriesBoat, function(cat) {
                catVideU[cat.codeN] = 0;
                catVideC[cat.codeN] = 0;
                catVideA[cat.codeN] = 0;
            });
            $scope.catCheck = {
                univ: catVideU,
                club: catVideC,
                amat: catVideA
            };
            Rankings.get({id: $stateParams.id}).$promise.then(function(r) {
                $scope.ranking = r;
                angular.forEach(r.categories, function(cat) {
                    var type = cat.code.substr(cat.code.length-2,2);
                    console.log(type);
                    switch(type) {
                        case '-U':
                            $scope.catCheck.univ[cat.code.substr(0,3)] = 1;
                            break;
                        case '-C':
                            $scope.catCheck.club[cat.code.substr(0,3)] = 1;
                            break;
                        case '-A':
                            $scope.catCheck.amat[cat.code.substr(0,3)] = 1;
                            break;
                    }
                });
            });
            console.log($scope.catCheck);
            $scope.switchCat = function(type, cat) {
                switch(type) {
                    case 'univ':
                        if ($scope.catCheck.univ[cat] == 0) {
                            $scope.catCheck.univ[cat] = 1;
                        } else {
                            $scope.catCheck.univ[cat] = 0;
                        }
                        break;
                    case 'club':
                        if ($scope.catCheck.club[cat] == 0) {
                            $scope.catCheck.club[cat] = 1;
                        } else {
                            $scope.catCheck.club[cat] = 0;
                        }
                        break;
                    case 'amat':
                        if ($scope.catCheck.amat[cat] == 0) {
                            $scope.catCheck.amat[cat] = 1;
                        } else {
                            $scope.catCheck.amat[cat] = 0;
                        }
                        break;
                }
            };
            $scope.editRanking = function(name, catCheck) {
                var categories = "";
                angular.forEach(catCheck, function(type, key) {
                    angular.forEach($rootScope.categoriesBoat, function(cat) {
                        if (type[cat.codeN] == 1) {
                            categories = categories + "," + cat.codeN + "-" + key.slice(0, 1).toUpperCase();
                        }
                    });
                });
                categories = categories.substr(1);
                console.log(categories);
                Rankings.save({id: $stateParams.id, categoriesString: categories, name: name}).$promise.then(function(r) {
                    $location.path('/admin/rankings');
                });
            };
        }
    ])
;