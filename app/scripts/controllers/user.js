'use strict';

var userCtrl = angular.module('userCtrl', []);

userCtrl
    .controller('UserCtrl', ['$scope', '$rootScope', '$stateParams', 'AuthService', 'API.Users', '$location', 
        function($scope, $rootScope, $stateParams, AuthService, Users, $location) {
            $rootScope.pageActive = 'login';

            $scope.user = {
                infos: {},
                isAuthenticated: AuthService.isAuthenticated,
                logout: AuthService.logout
            };
            $scope.login = {
                login: '',
                password: ''
            };

            $scope.connexion = function (login) {
                $scope.loginError = false;
                $scope.inLogin = true;
                AuthService.login(login).then(
                    function(user) {
                        $scope.user.infos = user;
                        $scope.login = {login: '', password: ''};
                        $scope.inLogin = false;
                    }, function() {
                        $scope.loginError = true;
                        $scope.login.password = '';
                        $scope.inLogin = false;
                    }
                );
                $location.path('/admin/');
            };
        }
    ])
    .controller('UserActionCtrl', ['$scope', '$rootScope', '$stateParams', 'API.Users', '$location', 
        function($scope, $rootScope, $stateParams, Users, $location) {
            $rootScope.pageActive = 'users';

            $scope.addUser = function(user) {
                if (user.password === user.passwordBis) {
                    Users.add(user).$promise.then(function(u) {
                        $location.path('admin/users');
                    });
                } 
            };
        }
    ])
    .controller('UserPwdCtrl', ['$scope', '$rootScope', '$stateParams', 'API.Users', '$location', 
        function($scope, $rootScope, $stateParams, Users, $location) {
            $rootScope.pageActive = 'users';
            $scope.user = Users.me();
            $scope.changePwd = function(userId, oldPwd, newPwd, newPwdBis) {
                if (newPwd === newPwdBis) {
                    Users.changepwd({id: userId, oldpwd: oldPwd, newpwd: newPwd}).$promise.then(function() {
                        $location.path('admin/users');
                    });
                } 
            };
        }
    ])
    .controller('UserListCtrl', ['$scope', '$rootScope', '$stateParams', 'API.Users', '$location', 
        function($scope, $rootScope, $stateParams, Users, $location) {
            $rootScope.pageActive = 'users';
            $scope.me = Users.me();

            $scope.users = Users.query();
            $scope.remove = function(userId) {
                Users.remove({id: userId}).$promise.then(function() {
                    $scope.users = Users.query();
                });
            };
        }
    ])
;
