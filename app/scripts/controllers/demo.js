'use strict';

angular.module('socCharts')
    .controller('DemoCtrl', function($scope) {

        $scope.options = {
            label: "label",
            stack: [{
                key: "v1",
                label: "Impressions",
                color: "rgba(0,0,255, .5)"
            }, {
                key: "v2",
                label: "Comments",
                color: "rgba(0,255,0, .5)"
            }, {
                key: "v3",
                label: "Likes",
                color: "rgba(255,0,0, .5)"
            }],
            height: 400,
            legend: true,
            axis: {
                x: {
                    show: true
                },
                y: {
                    show: false,
                    label: "Traffic"
                }
            },
            sort: "desc"
        };

        $scope.donutOptions = {
            label: "label",
            stack: {
                key: "v1",
                label: "Impressions",
                colors: ["#666666", "#CCCCCC"]
            },
            height: 400,
            sort: "desc"
        };

        $scope.loading = false;

        $scope.data = [{
            label: "1AM",
            v1: 4,
            v2: 3,
            v3: 1,
            color: "#FF0000"
        }, {
            label: "4PM",
            v1: 2,
            v2: 6,
            v3: 7
        }, {
            label: "6PM",
            v1: 3,
            v2: 4,
            v3: 2,
            color: "#00FF00"
        }, {
            label: "12PM",
            v1: 8,
            v2: 8,
            v3: 1
        }, {
            label: "8PM",
            v1: 4,
            v2: 8,
            v3: 1
        }, {
            label: "9AM",
            v1: 9,
            v2: 6,
            v3: 1
        }];

        $scope.update = function() {
            $scope.loading = $scope.loading ? false : true;
        }
    });