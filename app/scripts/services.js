'use strict';

var ergoServices = angular.module('ergoServices', ['ngResource']);

ergoServices
.factory('API', ['$location', 
    function ($location) {
        return { 
            route: function (path) {
                if (/localhost/.test($location.absUrl())) {
                    return 'api/web/app_dev.php' + (path == '' ? '' : '/' + path);
                } else {
                    return 'api/web' + (path == '' ? '' : '/' + path);
                }
            }
        };
    }
])
.factory('API.Auth', ['API', '$resource', 
    function (API, $resource) {
        return $resource(API.route('auth/login'));
    } 
])
.factory('API.Boats', ['API', '$resource', '$stateParams', 
    function (API, $resource, $stateParams) {
        return $resource(API.route('boats/:id'), {}, {
            deletedquery: {method: 'GET', url: API.route('boats/deleted'), static: true, isArray: true},
            getnames: {method: 'GET', url: API.route('boats/names'), static: true, isArray: true},
            add: {method: 'POST', url: API.route('boats/add'), static: true},
            myboats: {method: 'POST', url: API.route('boats/myboats'), isArray: true},
            save: {method: 'POST', url: API.route('boats/:id'), params: {id: '@id'}},
            remove: {method: 'DELETE'},
            catupdate: {method: 'POST', url: API.route('boats/catupdate/:id'), params: {id: '@id'}},
            valid: {method: 'POST', url: API.route('boats/valid/:id'), params: {id: '@id'}},
            pay: {method: 'POST', url: API.route('boats/pay/:id'), params: {id: '@id'}},
            record: {method: 'POST', url: API.route('boats/record/:id'), params: {id: '@id'}},
            softremove: {method: 'POST', url: API.route('boats/softremove/:id'), params: {id: '@id'}},
            count: {method: 'GET', url: API.route('boats/count')},
            sendmail: {method: 'POST', url: API.route('boats/email/:id'), params: {id: '@id'}},
            sendpaymail: {method: 'POST', url: API.route('boats/pay-email/:id'), params: {id: '@id'}},
            checkInscription: {method: 'GET', url: API.route('boats/check-inscription')},
            getCode: {method: 'POST', url: API.route('boats/code-inscription')}
        });
    }
])
.factory('API.Rowers', ['API', '$resource',
    function (API, $resource) {
        return $resource(API.route('rowers/:id'), {}, {
            add: {method: 'POST', url: API.route('rowers/add'), static: true},
            save: {method: 'POST', url: API.route('rowers/:id'), params: {id: '@id'}},
            remove: {method: 'DELETE'}
        });
    }
])
.factory('API.Leaders', ['API', '$resource', 
    function (API, $resource) {
        return $resource(API.route('leaders/:id'), {}, {
            add: {method: 'POST', url: API.route('leaders/add'), static: true},
            save: {method: 'POST', url: API.route('leaders/:id'), params: {id: '@id'}}
        });
    }
])
.factory('API.Users', ['API', '$resource', 
    function (API, $resource) {
        return $resource(API.route('users/:id'), {}, {
            add: {method: 'POST', url: API.route('users/add'), static: true},
            changepwd: {method: 'POST', url: API.route('users/changepwd/:id'), params: {id: '@id'}},
            me: {method: 'GET', url: API.route('auth/me'), static: true},
            remove: {method: 'DELETE'}
        });
    }
])
.factory('API.Rankings', ['API', '$resource', 
    function (API, $resource) {
        return $resource(API.route('rankings/:id'), {}, {
            add: {method: 'POST', url: API.route('rankings/add'), static: true},
            save: {method: 'POST', url: API.route('rankings/:id'), params: {id: '@id'}},
            remove: {method: 'DELETE'},
            checkDisplay: {method: 'GET', url: API.route('rankings/check-display')},
            switchDisplay: {method: 'POST', url: API.route('rankings/switch-display')}
        });
    }])
;