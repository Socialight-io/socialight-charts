'use strict';

var _SocChartsConfig = {
    path: "../views/socialight-charts/"
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
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: _SocChartsConfig.path + 'demo.html',
                controller: 'DemoCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });