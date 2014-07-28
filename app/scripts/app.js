'use strict';

var _SocChartsConfig = {
    path: ""
};

angular.module('socCharts', ['ngAnimate', 'ngRoute', 'socCharts-templates'])
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