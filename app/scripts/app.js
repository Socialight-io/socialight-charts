'use strict';

var _SocChartsConfig = {
	path: "/static/modules/socialight-charts/app/"
};

angular.module('socCharts', ["ngAnimate", "ngRoute"])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
