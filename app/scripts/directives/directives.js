'use strict';

angular.module('ergo.directives', [])
.directive('ergoBoatslist', function() {
    return {
        restrict: 'E',
        $scope: {
            boats: '=boats'
        },
        templateUrl: 'scripts/directives/views/boats-list.html'
    }
})