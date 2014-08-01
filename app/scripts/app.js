'use strict';

var _SocChartsConfig = {
    path: "http://static.socialight.io/analytics/bower_components/socialight-charts/dist/views/"
};

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

        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from our assets domain.
            _SocChartsConfig.path + '**/**'
        ]);
    });