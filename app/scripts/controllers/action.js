'use strict';

var actionCtrl = angular.module('actionCtrl', []);

actionCtrl
    .controller('ActionCtrl', ['$scope', '$rootScope', 'API.Boats', 'API.Rowers', 'API.Leaders', '$location', '$filter', 
        function($scope, $rootScope, Boats, Rowers, Leaders, $location, $filter) {
            $rootScope.pageActive = 'inscription';
            if ($rootScope.checkInscription.check == 0) {
                $location.path('/linscription');
            }
            $scope.inscriptionTerminee = false;
            // Variables pour les formulaires
            $scope.categoriesBoat = $rootScope.categoriesBoat;
            $scope.categoriesType = $rootScope.categoriesType;
            $scope.boatsNames = Boats.getnames();
            $scope.isNewName = true;
            $scope.etape = 0;
            $scope.acceptConditionsCheck = false;
            $scope.boatId = 0;
            $scope.rowers = []; // tableau des rameurs autres que le leader
            $scope.leaderRowerId = 0;
            $scope.typeLicense = 'Aucune';
            $scope.computing = false;
            $scope.boat = {
                id: 0,
                name: '',
                category: ''
            };
            $scope.catType = '';
            $scope.rower = {
                lastname: '',
                firstname: '',
                boat: 0,
                license: '',
                birthdate: ''
            };
            $scope.leader = {
                lastname: '',
                firstname: '',
                rower: 0,
                boat: 0,
                email: '',
                phone: '',
                club: ''
            };
            $scope.rwr = { lastname: '', firstname: '', license: '', birthdate: '' };
            $scope.leaderRowerId = $scope.leader.rower.id;
            // Méthodes pour les formulaires
            // Etape 0
            $scope.acceptConditions = function(check) {
                if (check) {
                    $scope.etape = 1;
                    $scope.computing = false;
                } else {
                    alert("Vous devez accepter les conditions d'inscription pour continuer.");
                }
            }
            // Etape 1
            $scope.checkName = function(nom) {
                if ($filter('filter')($scope.boatsNames, nom, true).length == 0) {
                    $scope.isNewName = true;
                } else {
                    $scope.isNewName = false;
                }
            }
            $scope.addBoat = function(boat) {
                if (boat.name != '' && boat.category != '') {
                    $scope.computing = true;
                    Boats.add(boat).$promise.then(function(newboat) {
                        $scope.boatId = newboat.id;
                        $scope.leader.boat = newboat.id;
                        $scope.rowers.length = parseInt(newboat.category.slice(0,1)) - 1; // préparation du tableaux des rameurs (taille correspondant à la catégorie)
                        for (var i = 0; i < $scope.rowers.length; i++) {
                            $scope.rowers[i] = {lastname: '', firstname: '', boat: $scope.boatId, license: '', birthdate: ''};
                        }
                        $scope.computing = false;
                        $scope.etape = 2;
                    });
                }
            };
            // Etape 2
            $scope.addLeader = function(leader, catType, typeLicense) {
                $scope.computing = true;
                console.log(leader);
                console.log(catType);
                console.log(typeLicense);
                var license = (typeLicense == 'Aucune') ? 'Aucune' : typeLicense + leader.license;
                leader.birthdate = (leader.birthdate == '') ? '20141213' : leader.birthdate;
                leader.club = (leader.club == null) ? 'Aucun' : leader.club;
                var leaderRower = {
                    lastname: leader.lastname,
                    firstname: leader.firstname,
                    boat: leader.boat,
                    license: license,
                    birthdate: leader.birthdate.substr(4, 4) + "-" + leader.birthdate.substr(2, 2) + "-" + leader.birthdate.substr(0, 2)
                };
                 // précision de la catégorie de bateau
                Boats.catupdate({id: leaderRower.boat, category: catType}).$promise.then(function() {
                    // ajout du Rower associé au Leader
                    Rowers.add(leaderRower).$promise.then(function(rower) {
                        $scope.leader.rower = rower.id;
                        console.log(rower);
                        Leaders.add($scope.leader).$promise.then(function () {
                            // Distinction entre individuel et équipe
                            if ($scope.rowers.length > 0) {
                                $scope.etape = 3;
                                $scope.computing = false;
                            } else {
                                Boats.get({id: $scope.boatId}).$promise.then(function(boat) {
                                    $scope.finalBoat = boat;
                                    $scope.finalBoatE = angular.copy($scope.finalBoat);
                                    $scope.ldr = $scope.finalBoatE.leader;
                                    $scope.catType = $scope.finalBoat.category.split('-')[2];
                                    $scope.catTypeE = angular.copy($scope.catType);
                                    $scope.computing = false;
                                    $scope.etape = 4;
                                });
                            }
                        });
                    });
                });
            };
            // Etape 3
           $scope.addRowers = function(rwrs) {
                $scope.computing = true;
                var compte = rwrs.length;
                angular.forEach(rwrs, function(rower) {
                    var birthdate = rower.birthdate.substr(4, 4) + "-" + rower.birthdate.substr(2, 2) + "-" + rower.birthdate.substr(0, 2);
                    rower.birthdate = birthdate;
                    Rowers.add(rower).$promise.then(function(rwr) { 
                        if (compte == 1) {
                            Boats.get({id: $scope.boatId}).$promise.then(function(boat) {
                                $scope.finalBoat = boat;
                                $scope.finalBoatE = angular.copy($scope.finalBoat);
                                $scope.ldr = $scope.finalBoatE.leader;
                                $scope.catType = $scope.finalBoat.category.split('-')[2];
                                $scope.catTypeE = angular.copy($scope.catType);
                                $scope.computing = false;
                                $scope.etape = 4;
                            });
                        } else {
                            compte -= 1;
                        }
                    });
                });
            };

            // $scope.addRowersAux = function(rowers) {
            //     addRowersAux(rowers);
            //     Boats.get({id: $scope.boatId}).$promise.then(function(boat) {
            //                 $scope.finalBoat = boat;
            //                 $scope.finalBoatE = angular.copy($scope.finalBoat);
            //                 $scope.ldr = $scope.finalBoatE.leader;
            //                 $scope.catType = $scope.finalBoat.category.split('-')[2];
            //                 $scope.catTypeE = angular.copy($scope.catType);
            //                 $scope.etape = 4;
            //             });
            //             $scope.compte = -1;
            //         }
            //     }
            // };
            // Etape 4
            $scope.sendEmail = function(boat) {
                $scope.inscriptionTerminee = true;
                Boats.sendmail({id: boat.id, type: 'inscription'}).$promise.then(function(nb) {
                    $rootScope.message = 'inscription-success';
                    $scope.computing = false;
                    $location.path('/');
                });
                
            }
            $scope.removeBoat = function(boatId) {
                if (confirm('Êtes-vous sûr de vouloir annuler ? Les informations enregistrées seront perdues.')) {
                    Boats.softremove({id: boatId}).$promise.then(function() {
                        $scope.etape = 1;
                    });
                }
            };
            // Correction avant validation
            $scope.editBoat = function(boatId, catType) {
                Boats.catupdate({id: boatId, category: '-' + catType}).$promise.then(function() {
                    Boats.save({id: boatId, name: $scope.finalBoatE.name}).$promise.then(function(boat) {
                        $scope.finalBoat = boat;
                        $scope.finalBoatE = angular.copy($scope.finalBoat);
                        $scope.ldr = $scope.finalBoatE.leader;
                        $scope.catType = $scope.finalBoat.category.split('-')[2];
                        $scope.catTypeE = angular.copy($scope.catType);
                        $('#modal-boat-edit').modal('hide');
                    });
                });
            };
            $scope.editLeader = function(leader) {
                Leaders.save({id: leader.id, lastname: '', firstname: '', email: leader.email, phone: leader.phone, club: leader.club}).$promise.then(function() {
                    Boats.get({id: $scope.finalBoat.id}).$promise.then(function(boat) {
                        $scope.finalBoat = boat;
                        $scope.finalBoatE = angular.copy($scope.finalBoat);
                        $scope.ldr = $scope.finalBoatE.leader;
                        $scope.catType = $scope.finalBoat.category.split('-')[2];
                        $scope.catTypeE = angular.copy($scope.catType);
                    });
                    $('#modal-leader-edit').modal('hide');
                });
            };
            $scope.loadRower = function(rowerId) {
                Rowers.get({id: rowerId}).$promise.then(function(r) {
                    $scope.rwr = r;
                    $scope.rower = angular.copy(r);
                    $scope.rwr.birthdate = $filter('date')($scope.rwr.birthdate, 'dd/MM/yyyy');
                    $scope.rower.birthdate = $filter('date')($scope.rower.birthdate, 'dd/MM/yyyy');
                    console.log($scope.rwr.birthdate);
                    $('#modal-rowers-edit').modal('show');
                });
                
            };
            $scope.editRower = function(rower) {
                if (/T/.test(rower.birthdate)) {
                    var birthdate = rower.birthdate.substr(0, 10);
                } else {
                    var birthdate = rower.birthdate.substr(4, 4) + '-' + rower.birthdate.substr(2, 2) + '-' + rower.birthdate.substr(0, 2);
                }
                Rowers.save({id: rower.id, lastname: rower.lastname, firstname: rower.firstname, license: rower.license, birthdate: birthdate}).$promise.then(function() {
                    Boats.get({id: $scope.finalBoat.id}).$promise.then(function(boat) {
                        $scope.finalBoat = boat;
                        $scope.finalBoatE = angular.copy($scope.finalBoat);
                        $scope.ldr = $scope.finalBoatE.leader;
                        $scope.catType = $scope.finalBoat.category.split('-')[2];
                        $scope.catTypeE = angular.copy($scope.catType);
                        $scope.rwr = { lastname: '', firstname: '', license: '', birthdate: '' };
                        $('#modal-rowers-edit').modal('hide');
                    }); 
                });
            };
            $scope.closeModal = function(modalId) {
                $(modalId).modal('hide');
            };
            // Actualisation de la page à l'étape 4
            $scope.updating = false;
            $scope.updateFinalBoat = function() {
                $scope.updating = true;
                Boats.get({id: $scope.finalBoat.id}).$promise.then(function(boat) {
                    $scope.finalBoat = boat;
                    $scope.finalBoatE = angular.copy($scope.finalBoat);
                    $scope.catType = $scope.finalBoat.category.split('-')[2];
                    $scope.catTypeE = angular.copy($scope.catType);
                    $scope.ldr = $scope.finalBoatE.leader;
                    $scope.updating = false;
                });
            };
        }
    ])
    .controller('LActionCtrl', ['$scope', '$rootScope', 'API.Boats', 'API.Rowers', 'API.Leaders', '$location', '$filter', 
        function($scope, $rootScope, Boats, Rowers, Leaders, $location, $filter) {
            $rootScope.pageActive = 'inscription';
            if ($rootScope.checkInscription.check == 1) {
                $location.path('/inscription');
            }
            $scope.inscriptionTerminee = false;
            // Variables pour les formulaires
            $scope.categoriesBoat = $rootScope.categoriesBoat;
            $scope.categoriesType = $rootScope.categoriesType;
            $scope.boatsNames = Boats.getnames();
            $scope.isNewName = true;
            $scope.etape = 'acces';
            $scope.acceptConditionsCheck = false;
            $scope.boatId = 0;
            $scope.rowers = []; // tableau des rameurs autres que le leader
            $scope.leaderRowerId = 0;
            $scope.typeLicense = 'Aucune';
            $scope.computing = false;
            $scope.boat = {
                id: 0,
                name: '',
                category: ''
            };
            $scope.catType = '';
            $scope.rower = {
                lastname: '',
                firstname: '',
                boat: 0,
                license: '',
                birthdate: ''
            };
            $scope.leader = {
                lastname: '',
                firstname: '',
                rower: 0,
                boat: 0,
                email: '',
                phone: '',
                club: ''
            };
            $scope.rwr = { lastname: '', firstname: '', license: '', birthdate: '' };
            $scope.leaderRowerId = $scope.leader.rower.id;
            // Méthodes pour les formulaires
            // Etape -1
            $scope.verifAccesInscription = function(code) {
                Boats.getCode({code: code}).$promise.then(function(check) {
                    if (check.valid == "1") {
                        $scope.etape = 0
                        $scope.computing = false;
                    } else {
                        $scope.computing = false;
                        $location.path('/');
                }
                });
                
            }
            // Etape 0
            $scope.acceptConditions = function(check) {
                if (check) {
                    $scope.etape = 1;
                    $scope.computing = false;
                } else {
                    alert("Vous devez accepter les conditions d'inscription pour continuer.");
                }
            }
            // Etape 1
            $scope.checkName = function(nom) {
                if ($filter('filter')($scope.boatsNames, nom, true).length == 0) {
                    $scope.isNewName = true;
                } else {
                    $scope.isNewName = false;
                }
            }
            $scope.addBoat = function(boat) {
                if (boat.name != '' && boat.category != '') {
                    $scope.computing = true;
                    Boats.add(boat).$promise.then(function(newboat) {
                        $scope.boatId = newboat.id;
                        $scope.leader.boat = newboat.id;
                        $scope.rowers.length = parseInt(newboat.category.slice(0,1)) - 1; // préparation du tableaux des rameurs (taille correspondant à la catégorie)
                        for (var i = 0; i < $scope.rowers.length; i++) {
                            $scope.rowers[i] = {lastname: '', firstname: '', boat: $scope.boatId, license: '', birthdate: ''};
                        }
                        $scope.computing = false;
                        $scope.etape = 2;
                    });
                }
            };
            // Etape 2
            $scope.addLeader = function(leader, catType, typeLicense) {
                $scope.computing = true;
                console.log(leader);
                console.log(catType);
                console.log(typeLicense);
                var license = (typeLicense == 'Aucune') ? 'Aucune' : typeLicense + leader.license;
                leader.birthdate = (leader.birthdate == '') ? '20141213' : leader.birthdate;
                leader.club = (leader.club == null) ? 'Aucun' : leader.club;
                var leaderRower = {
                    lastname: leader.lastname,
                    firstname: leader.firstname,
                    boat: leader.boat,
                    license: license,
                    birthdate: leader.birthdate.substr(4, 4) + "-" + leader.birthdate.substr(2, 2) + "-" + leader.birthdate.substr(0, 2)
                };
                 // précision de la catégorie de bateau
                Boats.catupdate({id: leaderRower.boat, category: catType}).$promise.then(function() {
                    // ajout du Rower associé au Leader
                    Rowers.add(leaderRower).$promise.then(function(rower) {
                        $scope.leader.rower = rower.id;
                        console.log(rower);
                        Leaders.add($scope.leader).$promise.then(function () {
                            // Distinction entre individuel et équipe
                            if ($scope.rowers.length > 0) {
                                $scope.etape = 3;
                                $scope.computing = false;
                            } else {
                                Boats.get({id: $scope.boatId}).$promise.then(function(boat) {
                                    $scope.finalBoat = boat;
                                    $scope.finalBoatE = angular.copy($scope.finalBoat);
                                    $scope.ldr = $scope.finalBoatE.leader;
                                    $scope.catType = $scope.finalBoat.category.split('-')[2];
                                    $scope.catTypeE = angular.copy($scope.catType);
                                    $scope.computing = false;
                                    $scope.etape = 4;
                                });
                            }
                        });
                    });
                });
            };
            // Etape 3
           $scope.addRowers = function(rwrs) {
                $scope.computing = true;
                var compte = rwrs.length;
                angular.forEach(rwrs, function(rower) {
                    var birthdate = rower.birthdate.substr(4, 4) + "-" + rower.birthdate.substr(2, 2) + "-" + rower.birthdate.substr(0, 2);
                    rower.birthdate = birthdate;
                    Rowers.add(rower).$promise.then(function(rwr) { 
                        if (compte == 1) {
                            Boats.get({id: $scope.boatId}).$promise.then(function(boat) {
                                $scope.finalBoat = boat;
                                $scope.finalBoatE = angular.copy($scope.finalBoat);
                                $scope.ldr = $scope.finalBoatE.leader;
                                $scope.catType = $scope.finalBoat.category.split('-')[2];
                                $scope.catTypeE = angular.copy($scope.catType);
                                $scope.computing = false;
                                $scope.etape = 4;
                            });
                        } else {
                            compte -= 1;
                        }
                    });
                });
            };

            // $scope.addRowersAux = function(rowers) {
            //     addRowersAux(rowers);
            //     Boats.get({id: $scope.boatId}).$promise.then(function(boat) {
            //                 $scope.finalBoat = boat;
            //                 $scope.finalBoatE = angular.copy($scope.finalBoat);
            //                 $scope.ldr = $scope.finalBoatE.leader;
            //                 $scope.catType = $scope.finalBoat.category.split('-')[2];
            //                 $scope.catTypeE = angular.copy($scope.catType);
            //                 $scope.etape = 4;
            //             });
            //             $scope.compte = -1;
            //         }
            //     }
            // };
            // Etape 4
            $scope.sendEmail = function(boat) {
                $scope.inscriptionTerminee = true;
                Boats.sendmail({id: boat.id, type: 'inscription'}).$promise.then(function(nb) {
                    $rootScope.message = 'inscription-success';
                    $scope.computing = false;
                    $location.path('/');
                });
                
            }
            $scope.removeBoat = function(boatId) {
                if (confirm('Êtes-vous sûr de vouloir annuler ? Les informations enregistrées seront perdues.')) {
                    Boats.softremove({id: boatId}).$promise.then(function() {
                        $scope.etape = 1;
                    });
                }
            };
            // Correction avant validation
            $scope.editBoat = function(boatId, catType) {
                Boats.catupdate({id: boatId, category: '-' + catType}).$promise.then(function() {
                    Boats.save({id: boatId, name: $scope.finalBoatE.name}).$promise.then(function(boat) {
                        $scope.finalBoat = boat;
                        $scope.finalBoatE = angular.copy($scope.finalBoat);
                        $scope.ldr = $scope.finalBoatE.leader;
                        $scope.catType = $scope.finalBoat.category.split('-')[2];
                        $scope.catTypeE = angular.copy($scope.catType);
                        $('#modal-boat-edit').modal('hide');
                    });
                });
            };
            $scope.editLeader = function(leader) {
                Leaders.save({id: leader.id, lastname: '', firstname: '', email: leader.email, phone: leader.phone, club: leader.club}).$promise.then(function() {
                    Boats.get({id: $scope.finalBoat.id}).$promise.then(function(boat) {
                        $scope.finalBoat = boat;
                        $scope.finalBoatE = angular.copy($scope.finalBoat);
                        $scope.ldr = $scope.finalBoatE.leader;
                        $scope.catType = $scope.finalBoat.category.split('-')[2];
                        $scope.catTypeE = angular.copy($scope.catType);
                    });
                    $('#modal-leader-edit').modal('hide');
                });
            };
            $scope.loadRower = function(rowerId) {
                Rowers.get({id: rowerId}).$promise.then(function(r) {
                    $scope.rwr = r;
                    $scope.rower = angular.copy(r);
                    $scope.rwr.birthdate = $filter('date')($scope.rwr.birthdate, 'dd/MM/yyyy');
                    $scope.rower.birthdate = $filter('date')($scope.rower.birthdate, 'dd/MM/yyyy');
                    console.log($scope.rwr.birthdate);
                    $('#modal-rowers-edit').modal('show');
                });
                
            };
            $scope.editRower = function(rower) {
                if (/T/.test(rower.birthdate)) {
                    var birthdate = rower.birthdate.substr(0, 10);
                } else {
                    var birthdate = rower.birthdate.substr(4, 4) + '-' + rower.birthdate.substr(2, 2) + '-' + rower.birthdate.substr(0, 2);
                }
                Rowers.save({id: rower.id, lastname: rower.lastname, firstname: rower.firstname, license: rower.license, birthdate: birthdate}).$promise.then(function() {
                    Boats.get({id: $scope.finalBoat.id}).$promise.then(function(boat) {
                        $scope.finalBoat = boat;
                        $scope.finalBoatE = angular.copy($scope.finalBoat);
                        $scope.ldr = $scope.finalBoatE.leader;
                        $scope.catType = $scope.finalBoat.category.split('-')[2];
                        $scope.catTypeE = angular.copy($scope.catType);
                        $scope.rwr = { lastname: '', firstname: '', license: '', birthdate: '' };
                        $('#modal-rowers-edit').modal('hide');
                    }); 
                });
            };
            $scope.closeModal = function(modalId) {
                $(modalId).modal('hide');
            };
            // Actualisation de la page à l'étape 4
            $scope.updating = false;
            $scope.updateFinalBoat = function() {
                $scope.updating = true;
                Boats.get({id: $scope.finalBoat.id}).$promise.then(function(boat) {
                    $scope.finalBoat = boat;
                    $scope.finalBoatE = angular.copy($scope.finalBoat);
                    $scope.catType = $scope.finalBoat.category.split('-')[2];
                    $scope.catTypeE = angular.copy($scope.catType);
                    $scope.ldr = $scope.finalBoatE.leader;
                    $scope.updating = false;
                });
            };
        }
    ])
;