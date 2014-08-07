'use strict';

// set up the config, unless it already exists
if (!_SocChartsConfig) {
    var _SocChartsConfig = {};
}

// set the template URL
// this expects @@analyticsAppVersion to be replaced by the build process (of the container app)
_SocChartsConfig.templatePath = _SocChartsConfig.templatePath || "http://static.socialight.io/public/libs/publisher-analytics/@@analyticsAppVersion/bower_components/socialight-charts/dist/views/";


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
                templateUrl: _SocChartsConfig.templatePath + 'demo.html',
                controller: 'DemoCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });