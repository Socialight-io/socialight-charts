'use strict';

angular.module('socCharts')
	.directive('posts', function () {
		return {
			templateUrl: _SocChartsConfig.path+'views/charts/posts.html',
			restrict: 'A',
			scope: {
			'posts': '=',
			'options': '=',
			'loading': '='
			},
			link: function postLink(scope, element, attrs) {				
				scope.fixPic = function (url) { 
					if (url) { 
						return url.replace("50.50", "200.200").replace("50x50", "200x200");
					} else { return null; }
				}
			}
		};
	});
