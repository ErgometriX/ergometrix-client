'use strict';

var adminCtrl = angular.module('adminCtrl', []);

adminCtrl
    .controller('AdminBaseCtrl', ['$scope', '$rootScope', 'API.Boats', 'API.Rankings', '$location', 'AuthService','$timeout',
        function($scope, $rootScope, Boats, Rankings, $location, Auth , $timeout) {
            if(!(Auth.isAuthenticated())) {
                $location.path('/login');
            }
            $rootScope.pageActive = 'dashboard';
            $scope.displayResults = $rootScope.displayResults;
            $scope.checkInscription = $rootScope.checkInscription;
            $timeout(function(){ //attend que lr pocessus d'athentification soit termine pour eviter des deconnections abusives
                $scope.nbBoats = Boats.count();
            },200);
            $scope.switchDisplayResults = function() {
                Rankings.switchDisplay().$promise.then(function() {
                    $scope.displayResults.check = ($scope.displayResults.check == 0) && 1 || 0;
                });
            };
        }
    ])
;