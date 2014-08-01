'use strict';

var _SocChartsConfig = {
    path: "bower_components/socialight-charts/dist/views/"
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