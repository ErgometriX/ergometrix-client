'use strict';

// Declare app level module which depends on views, and components
var ergoApp = angular.module('ergo.app', [
  'ui.router',
  'ui.mask',
  'ergoServices',
  'ergoFilters',
  'ergoAuth',
  'userCtrl',
  'boatCtrl',
  'actionCtrl',
  'adminCtrl',
  'rankingCtrl',
  'ergo.directives'
]);

ergoApp.config(['$stateProvider', '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        var categoriesBoat = [
            {codeN: '8-m', label: 'Huit masculin (1000m slides)'},
            {codeN: '8-f', label: 'Huit féminin (1000m slides)'},
            {codeN: '8-f', label: 'Huit mixte (1000m slides)'},
            {codeN: '4-m', label: 'Quatre masculin (relais 4*500m)'},
            {codeN: '4-f', label: 'Quatre féminin (relais 4*500m)'},
            {codeN: '4-x', label: 'Quatre mixte (relais 4*500m)'},
            {codeN: '2-m', label: 'Double masculin (1000m slides)'},
            {codeN: '2-f', label: 'Double féminin (1000m slides)'},
            {codeN: '1-m', label: 'Individuel masculin (1000m)'},
            {codeN: '1-f', label: 'Individuel féminin (1000m)'}
            {codeN: '0-m', label: 'Individuel masculin (2000m)'},
            {codeN: '0-f', label: 'Individuel féminin (2000m)'}
        ];
        var categoriesType = [
            {codeT: '-U', label: 'Universitaire'},
            {codeT: '-C', label: 'Club'},
            {codeT: '-D', label: 'Défense'}
            {codeT: '-A', label: 'Autre'}
        ];
        var categories = [
            {code: '8-m-U', label: 'Huit masculin universitaire'},
            {code: '8-f-U', label: 'Huit féminin universitaire'},
            {code: '4-x-U', label: 'Quatre relais universitaire'},
            {code: '4-x-G', label: 'Quatre relais'},
            {code: '2-m-G', label: 'Double masculin'},
            {code: '2-f-G', label: 'Double féminin'},
            {code: '1-m-U', label: 'Individuel masculin'},
            {code: '1-f-U', label: 'Individuel féminin'}
            {code: '0-m-U', label: 'Individuel masculin'},
            {code: '0-f-U', label: 'Individuel féminin'}
        ];
        
        $stateProvider
        // partie publique
        .state('root', {
            templateUrl: 'views/layout.html',
            controller: ['$rootScope', 'API.Rankings', 'AuthService', 'API.Boats', 
                function($rootScope, Rankings, Auth, Boats) {
                    $rootScope.categoriesBoat = categoriesBoat;
                    $rootScope.categoriesType = categoriesType;
                    $rootScope.displayResults = Rankings.checkDisplay();
                    $rootScope.authCheck = Auth.isAuthenticated();
                    $rootScope.message = '';
                    $rootScope.checkInscription = Boats.checkInscription();
                }
            ]
        })
        .state('root.presentation', {
            url: '/',
            templateUrl: 'views/Static/presentation.html',
            controller: function($scope, $rootScope) {
                $rootScope.pageActive = 'presentation';
                $scope.message = $rootScope.message;
                $scope.checkInscription = $rootScope.checkInscription;
            }
        })
        .state('root.competition', {
            url: '/competition',
            templateUrl: 'views/Static/competition.html',
            controller: function($scope, $rootScope) {
                $rootScope.pageActive = 'competition';
            }
        })
        .state('root.infosPratiques', {
            url: '/infos-pratiques',
            templateUrl: 'views/Static/infosPratiques.html',
            controller: function($scope, $rootScope) {
                $rootScope.pageActive = 'infosPratiques';
            }
        })
        .state('root.filRouge', {
            url: '/fil-rouge',
            templateUrl: 'views/Static/fil-rouge.html',
            controller: function($scope, $rootScope) {
                $rootScope.pageActive = 'filRouge';
            }
        })
        .state('root.preparation', {
            url: '/preparation',
            templateUrl: 'views/Static/preparation.html',
            controller: function($scope, $rootScope) {
                $rootScope.pageActive = 'preparation';
            }
        })
        .state('root.objetstrouves', {
            url: '/objets-trouves',
            templateUrl: 'views/Static/objets-trouves.html',
            controller: function($scope, $rootScope) {
                $rootScope.pageActive = 'objets-trouves';
            }
        })
        .state('root.inscription', {
            url: '/inscription',
            templateUrl: 'views/Action/inscription.html',
            controller: 'ActionCtrl'
        })
        .state('root.lateInscription', {
            url: '/linscription',
            templateUrl: 'views/Action/linscription.html',
            controller: 'LActionCtrl'
        })
        .state('root.myBoats', {
            url: '/my-boats',
            templateUrl: 'views/Boat/my-boats.html',
            controller: 'MyBoatsCtrl'
        })
        .state('root.resultats', {
            url: '/resultats',
            templateUrl: 'views/Boat/boat-results.html',
            controller: 'BoatResultCtrl'
        })
        .state('root.galerie', {
            url: '/galerie/:cat',
            templateUrl: 'views/Static/galerie.html',
            controller: ['$rootScope', '$scope', '$stateParams', 
                function($rootScope, $scope, $stateParams) {
                    $rootScope.pageActive = 'galerie';
                    $scope.cat = $stateParams.cat;
                    $scope.maxis = [];
                    $scope.maxis['ambiance'] = 169;
                    $scope.maxis['cheerup'] = 35;
                    $scope.maxis['doubles'] = 48;
                    $scope.maxis['huits'] = 101;
                    $scope.maxis['podiums'] = 84;
                    $scope.maxis['portraits'] = 50;
                    $scope.maxis['relais'] = 298;
                    $scope.maxis['vendredi'] = 6;
                    $scope.labels = [];
                    $scope.labels['ambiance'] = 'Ambiance';
                    $scope.labels['cheerup'] = 'CheerUp';
                    $scope.labels['doubles'] = 'Doubles';
                    $scope.labels['huits'] = 'Huits';
                    $scope.labels['podiums'] = 'Podiums';
                    $scope.labels['portraits'] = 'Portraits';
                    $scope.labels['relais'] = 'Relais';
                    $scope.labels['vendredi'] = 'Vendredi';
                }
            ]
        })
        // partie admin
        .state('root.login', {
            templateUrl: 'views/login.html',
            url: '/login', 
            controller: 'UserCtrl'
        })
        .state('admin', {
            templateUrl: 'views/admin.html',
            url: '/admin',
            controller: ['$scope', '$rootScope', 'API.Rankings', 'API.Boats', 'AuthService', '$location', 
                function($scope, $rootScope, Rankings, Boats, AuthService, $location) {
                    $rootScope.categoriesBoat = categoriesBoat;
                    $rootScope.categoriesType = categoriesType;
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/login');
                    }
                    $rootScope.categories = categories;
                    $rootScope.displayResults = Rankings.checkDisplay();
                    $rootScope.checkInscription = Boats.checkInscription();
                    $rootScope.logout = function () {
                        AuthService.logout();
                        $location.path('/');
                    }
                }
            ]
        })
        .state('admin.dashboard', {
            url: '/',
            templateUrl: 'views/Admin/dashboard.html',
            controller: 'AdminBaseCtrl'
        })
        .state('admin.boats', {
            url: '/boats',
            templateUrl: 'views/Boat/boat-list.html',
            controller: 'BoatListCtrl'
        })
        .state('admin.boat', {
            url: '/boats/:id',
            templateUrl: 'views/Boat/boat-detail.html',
            controller: 'BoatDetailCtrl'
        })
        .state('admin.rower', {
            url: '/rowers/:boat/:id',
            templateUrl: 'views/Boat/boat-edit-rower.html',
            controller: 'BoatEditRowerCtrl'
        })
        .state('admin.leader', {
            url: '/leaders/:boat/:id/:cat',
            templateUrl: 'views/Boat/boat-edit-leader.html',
            controller: 'BoatEditLeaderCtrl'
        })
        .state('admin.users', {
            url: '/users',
            templateUrl: 'views/User/user-list.html',
            controller: 'UserListCtrl'
        })
        .state('admin.usersAdd', {
            url: '/users/add', 
            templateUrl: 'views/User/user-add.html',
            controller: 'UserActionCtrl'
        })
        .state('admin.userPwd', {
            url: '/users/:id', 
            templateUrl: 'views/User/user-pwd.html',
            controller: 'UserPwdCtrl'
        })
        .state('admin.rankings', {
            url: '/rankings',
            templateUrl: 'views/Ranking/ranking-list.html',
            controller: 'RankingListCtrl'
        })
        .state('admin.rankingAdd', {
            url: '/rankings/add', 
            templateUrl: 'views/Ranking/ranking-add.html',
            controller: 'RankingActionCtrl'
        })
        .state('admin.rankingEdit', {
            url: '/rankings/edit/:id',
            templateUrl: 'views/Ranking/ranking-edit.html',
            controller: 'RankingEditCtrl'
        });
    }
]);

ergoApp.config(['$httpProvider',
    function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
}]);
