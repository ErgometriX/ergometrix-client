'use strict';

var boatCtrl = angular.module('boatCtrl', []);

boatCtrl
    .controller('BoatListCtrl', ['$scope', '$rootScope', 'API.Boats', '$filter',
        function($scope, $rootScope, Boats, $filter) {
            $rootScope.pageActive = 'boats';
            $scope.categoriesBoat = $rootScope.categoriesBoat;
            $scope.categoriesType = $rootScope.categoriesType;

            var boatsQ = Boats.query();
            $scope.boats = boatsQ;
            $scope.boatsView = 'allBoats';
            $scope.updateBoats = function(typeList) {
                switch(typeList) { 
                    case 'toPayBoats':
                        $scope.boatsView = 'toPayBoats';
                        $scope.boats = $filter('filter')(boatsQ, {payment:false});
                        break;
                    case 'toValidBoats':
                        $scope.boatsView = 'toValidBoats';
                        $scope.boats = $filter('filter')(boatsQ, {valid:false});
                        break;
                    case 'toRecordBoats':
                        $scope.boatsView = 'toRecordBoats';
                        $scope.boats = $filter('filter')(boatsQ, {record:0}, true);
                        break;
                    default:
                        $scope.boatsView = 'allBoats';
                        $scope.boats = boatsQ;
                }
            }
            $scope.realUpdateBoats = function() {
                Boats.query().$promise.then(function(b) {
                    boatsQ = b;
                    $scope.updateBoats($scope.boatsView);
                });
            }
            $scope.remove = function(boatId) {
                Boats.remove({id: boatId}).$promise.then(function() {
                    $scope.boats = Boats.query();
                });
            };
        }
    ])
    .controller('BoatResultCtrl', ['$scope', '$rootScope', 'API.Boats', 'API.Rankings', 
        function($scope, $rootScope, Boats, Rankings) {
            $rootScope.pageActive = 'resultats';
            $scope.rankings = Rankings.query();
            $scope.boats = Boats.query();
            $scope.categories = $rootScope.categories;
        }
    ])
    .controller('BoatDetailCtrl', ['$scope', '$rootScope', '$stateParams', 'API.Boats', '$location', 'API.Rowers', 'API.Leaders', 
        function($scope, $rootScope, $stateParams, Boats, $location, Rowers, Leaders) {
            $rootScope.pageActive = '';
            $scope.catType = '';
            function reverseDate(date) {
                date = date.split("T")[0];
                var dateElem = date.split('-');
                return dateElem[2] + '/' + dateElem[1] + '/' + dateElem[0];
            }
            Boats.get({id: $stateParams.id}).$promise.then(function(b) {
                $scope.catType = b.category.split('-')[2];
                $scope.boat = b;
                $scope.boatE = angular.copy($scope.boat);
                $scope.leader = $scope.boatE.leader;
            });
            $scope.record = "";
            $scope.rwr = { lastname: '', firstname: '', license: '', birthdate: '' };
            $scope.updating = false;
            $scope.updateBoat = function() {
                $scope.updating = true;
                Boats.get({id: $scope.boat.id}).$promise.then(function(boat) {
                    $scope.boat = boat;
                    angular.copy($scope.boat, $scope.boatE);
                    $scope.leader = $scope.boatE.leader;
                    $scope.catType = $scope.boat.category.split('-')[2];
                    $scope.updating = false;
                });
            };
            $scope.validBoat = function() {
                Boats.valid({id: $scope.boat.id}).$promise.then(function(boat) {
                    $scope.boat = boat;
                    angular.copy($scope.boat, $scope.boatE);
                    $scope.leader = $scope.boatE.leader;
                });
            };
            $scope.payBoat = function() {
                Boats.pay({id: $scope.boat.id}).$promise.then(function(boat) {
                    Boats.sendpaymail({id: boat.id});
                    $scope.boat = boat;
                    angular.copy($scope.boat, $scope.boatE);
                    $scope.leader = $scope.boatE.leader;
                });
            };
            $scope.recordBoat = function(record) {
                record = parseInt(record);
                var min = Math.floor(record / 100000);
                var sec = Math.floor((record - 100000 * min) / 1000);
                var milli = Math.floor((record - 100000 * min) - 1000 * sec);
                var recordNum = milli + 1000 * sec + 60000 * min;
                Boats.record({id: $scope.boat.id, temps: recordNum}).$promise.then(function(boat) {
                    $scope.boat = boat;
                    angular.copy($scope.boat, $scope.boatE);
                    $scope.leader = $scope.boatE.leader;
                    $scope.record = "";
                });
            };
            $scope.removeBoat = function() {
                if (confirm('Voulez-vous vraiment supprimer ce bateau ? Cette opération est irréversible.')) {
                    Boats.remove({id: $scope.boat.id}).$promise.then(function() {
                        $location.path('admin/boats');
                    });
                }
            };
            // Modification d'un bateau
            $scope.editBoat = function(boatId) {
                Boats.save({id: boatId, name: $scope.boatE.name}).$promise.then(function(boat) {
                    $scope.updateBoat();
                    $('#modal-boat-edit').modal('hide');
                });
            };
            $scope.closeModal = function(modalId) {
                $(modalId).modal('hide');
            };
        }
    ])
    .controller('BoatEditRowerCtrl', ['$scope', '$rootScope', '$stateParams', 'API.Rowers', '$location', '$state', 
        function($scope, $rootScope, $stateParams, Rowers, $location, $state) {
            $rootScope.pageActive = '';
            Rowers.get({id: $stateParams.id}).$promise.then(function(rwr) {
                $scope.rower = rwr;
                $scope.rwr = angular.copy($scope.rower);
                $scope.dispDate = angular.copy($scope.rower.birthdate).split('T')[0]
                var dispDateElts = $scope.dispDate.split('-');
                $scope.dispDate = dispDateElts[2] + dispDateElts[1] + dispDateElts[0];
            });
            $scope.boatId = $stateParams.boat;
            $scope.updateRower = function(rower) {
                if (/T/.test(rower.birthdate)) {
                    var birthdate = rower.birthdate.substr(0, 10);
                } else {
                    var birthdate = rower.birthdate.substr(4, 4) + '-' + rower.birthdate.substr(2, 2) + '-' + rower.birthdate.substr(0, 2);
                }
                Rowers.save({id: rower.id, lastname: rower.lastname, firstname: rower.firstname, license: rower.license, birthdate: birthdate}).$promise.then(function() {
                    $state.go('admin.boat', {id: $scope.boatId});
                });
            };
        }
    ])
    .controller('BoatEditLeaderCtrl', ['$scope', '$rootScope', '$stateParams', 'API.Leaders', '$location', '$state', 
        function($scope, $rootScope, $stateParams, Leaders, $location, $state) {
            $rootScope.pageActive = '';
            $scope.catType = $stateParams.cat;
            Leaders.get({id: $stateParams.id}).$promise.then(function(ldr) {
                $scope.leader = ldr;
                $scope.ldr = angular.copy($scope.leader);
            });
            $scope.boatId = $stateParams.boat;
            $scope.updateLeader = function(leader) {
                Leaders.save({id: leader.id, lastname: '', firstname: '', email: leader.email, phone: leader.phone, club: leader.club}).$promise.then(function() {
                    $state.go('admin.boat', {id: $scope.boatId});
                });
            };
        }
    ])
    .controller('MyBoatsCtrl', ['$scope', '$rootScope', '$stateParams', 'API.Boats', '$location',
        function($scope, $rootScope, $stateParams, Boats, $location) {
            $rootScope.pageActive = 'myBoats';

            $scope.email = '';
            $scope.res = false;
            $scope.pending = false;
            $scope.getMyBoats = function(mail) {
                $scope.pending = true;
                $scope.res = false;
                Boats.myboats({email: mail}).$promise.then(function(b) {
                    $scope.myBoats = b;
                    $scope.res = true;
                    $scope.pending = false;
                })
            }
        }
    ])
;