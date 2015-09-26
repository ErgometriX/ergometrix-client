'use strict';

var mainCtrl = angular.module('mainCtrl', []);

mainCtrl
    .controller('MainBaseCtrl', ['$scope',
        function($scope, $stateParams) {
            $scope.pageActive = 'presentation';
        }
    ])
;