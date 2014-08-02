'use strict';

// set up the config, unless it already exists
if (!_SocChartsConfig) {
    var _SocChartsConfig = {};
}

_SocChartsConfig.path = _SocChartsConfig.path || "http://static.socialight.io/analytics/bower_components/socialight-charts/dist/views/"


/**
 * @ngdoc overview
 * @name socCharts
 * @description
 * # socCharts
 *
 * Main module of the application.
 */
angular
    .module('socCharts', [
        'ngAnimate',
        'ngResource',
        'ngRoute',
        //'socCharts-templates'
    ])
    .config(function($routeProvider, $sceDelegateProvider) {
        $routeProvider
            .when('/', {
                templateUrl: _SocChartsConfig.path + 'demo.html',
                controller: 'DemoCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });