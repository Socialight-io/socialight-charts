'use strict';

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
        'socCharts-templates'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });