'use strict';

angular.module('ergoFilters', [])
    .filter('phoneDisp', function() {
        return function (num) {
            if (angular.isNumber(num)) {
                var mun = num.toString();
                return formatLocal("FR", mun);
            } else {
                return '';
            }
        };
    })
    .filter('catDisp', ['$rootScope', function($rootScope) {
        return function (catCode) {
            if (typeof(catCode) == "string") {
                var res = "";
                var cats = catCode.split("-");
                var catCodeBoat = cats[0] + "-" + cats[1];
                var catCodeType = "-" + cats[2];
                angular.forEach($rootScope.categoriesBoat, function(cat) {
                    if (cat.codeN == catCodeBoat) { res = cat.label; }
                });
                angular.forEach($rootScope.categoriesType, function(cat) {
                    if (cat.codeT == catCodeType) { res = res + ' ' + cat.label; }
                });
            } else {
                var res = "";
            }
            return res;
        }
    }])
    .filter('recordDisp', function() {
        return function (rec) {
            var min = Math.floor(rec / 60000);
            var sec = Math.floor((rec - 60000 * min) / 1000);
            var milli = (rec - 60000 * min) - 1000 * sec;
            var minS = min.toString();
            var secS = sec < 10 ? "0" + sec.toString() : sec.toString();
            var milliS = "";
            if (milli < 10) {
                milliS = "00" + milli.toString();
            } else if (milli < 100) {
                milliS = "0" + milli.toString();
            } else {
                milliS = milli.toString();
            }
            return minS + ':' + secS + '.' + milliS;
        }
    })
    .filter('positif', function() {
        return function (n) {
            return n > 0;
        }
    })
    .filter('nul', function() {
        return function (n) {
            return n == 0;
        }
    })
    .filter('filterRank', function() {
        return function(boats, rank) {
            var out = [];
            var acceptableCats = [];
            angular.forEach(rank.categories, function(cat, key) {
                acceptableCats[acceptableCats.length] = cat.code;
            });
            angular.forEach(boats, function(boat) {
                if (acceptableCats.indexOf(boat.category) > -1) {
                    out[out.length] = boat;
                }
            });
            console.log(out);
            return out;
        }
    })
;