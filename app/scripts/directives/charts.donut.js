'use strict';

angular.module('socCharts')
    .directive('donutchart', function() {
        return {
            templateUrl: _SocChartsConfig.path + 'views/charts/donut.html',
            restrict: 'A',
            scope: {
                'donutchart': '=',
                'options': '=',
                'loading': '='
            },
            link: function(scope, element, attrs) {

                scope.loading = true;

                scope.$watch("donutchart", function() {
                    scope.update();
                }, true);

                scope.$watch("options", function() {
                    scope.update();
                }, true);

                $(window).on("resize", function() {
                    scope.update();
                });

                var si = d3.format('.2s');

                scope.create = function() {

                    if (scope.donutchart.length <= 0) {
                        return false;
                    }

                    scope.options = angular.extend({
                        stack: {
                            key: "v1",
                            label: "Impressions",
                            colors: ["#0000FF", "#006699"],
                        },
                        legend: true,
                        width: undefined,
                        arcs: {
                            main: {
                                inner: .9,
                                outer: 1
                            },
                            text: {
                                inner: .6,
                                outer: 1
                            }
                        },
                        label: true,
                        mouseover: function() {},
                        mouseout: function() {},
                        click: function() {}
                    }, scope.options);

                    var colors = d3.scale.linear().range(scope.options.stack.colors);

                    colors.domain(d3.extent(scope.donutchart, function(v) {
                        return v[scope.options.stack.key];
                    }));

                    if (!scope.donutchart || scope.donutchart.length == 0 || !element.width()) {
                        return false;
                    }

                    scope.data = angular.copy(scope.donutchart);

                    scope.width = scope.options.width || element.width();

                    if (scope.options.height && scope.width > scope.options.height) {
                        scope.radius = scope.options.height / 2;
                    } else {
                        scope.radius = scope.width / 2;
                    }

                    if (scope.options.height) {
                        element.height(scope.options.height);
                    } else {
                        element.height(scope.radius * 2);
                    }

                    scope.arc = d3.svg.arc()
                        .innerRadius(scope.radius * scope.options.arcs.main.inner)
                        .outerRadius(scope.radius * scope.options.arcs.main.outer);

                    scope.textArc = d3.svg.arc()
                        .innerRadius(scope.radius * scope.options.arcs.text.inner)
                        .outerRadius(scope.radius * scope.options.arcs.text.outer);

                    scope.pie = d3.layout.pie()
                        .value(function(d) {
                            return d[scope.options.stack.key];
                        }).sort(null);

                    var g = function(arr) {
                        return d3.max(arr, function(d) {
                            return d[scope.options.stack.key];
                        });
                    };

                    var container = d3.selectAll(element);
                    container.selectAll(".chart").selectAll("svg").remove();

                    scope.vis = container.selectAll(".chart")
                        .append("svg")
                        .data(scope.data)
                        .attr("class", "donut-chart")
                        .attr("width", scope.options.width)
                        .attr("height", scope.options.height || scope.radius * 2)
                        .append("svg:g")
                        .attr("transform", "translate(" + scope.radius + "," + scope.radius + ")");

                    if (scope.options.label) {

                        scope.vis.append("svg:text")
                            .attr("class", "chart-label")
                            .attr("text-anchor", "middle") //center the text on it's origin
                        .attr("transform", "translate(0," + Math.round(scope.radius / 10) + ")")
                            .style("font-size", Math.round(scope.radius / 2.5) + "px")
                            .text(si(d3.sum(scope.data, function(d) {
                                return d[scope.options.stack.key];
                            })));

                        scope.vis.append("svg:text")
                            .attr("class", "chart-sub-label")
                            .attr("text-anchor", "middle") //center the text on it's origin
                        .attr("transform", "translate(0," + (scope.radius * .3) + ")")
                            .style("font-size", Math.round(scope.options.radius * .15))
                            .text(scope.options.stack.label);
                    }

                    if (scope.data.length) {

                        scope.arcs = scope.vis.selectAll("g.slice")
                            .data(scope.pie(scope.data))
                            .enter()
                            .append("svg:g")
                            .attr("class", "slice");

                        scope.arcs.append("svg:path")
                            .attr("class", function(d) {
                                return d.data.label;
                            })
                            .attr("fill", function(d, i) {
                                if (angular.isFunction(scope.options.stack.colors)) {
                                    return scope.options.stack.colors(d);
                                } else {
                                    return colors(d.value);
                                }
                            })
                            .style("opacity", .7)
                            .attr("d", scope.textArc)
                            .each(function(d) {
                                scope._current = d;
                            });

                        scope.arcs.append("svg:path")
                            .attr("class", function(d) {
                                return d.data.label;
                            })
                            .attr("fill", function(d, i) {
                                if (angular.isFunction(scope.options.stack.colors)) {
                                    return scope.options.stack.colors(d);
                                } else {
                                    return colors(d.value);
                                }
                            })
                            .style("opacity", "1")
                            .attr("d", scope.arc)
                            .each(function(d) {
                                scope._current = d;
                            })
                            .on("click", scope.options.click || function(d) {
                                console.log(d);
                            });
                    }

                    scope.arcs.append("svg:text")
                        .attr("class", "hover-show")
                        .attr("text-anchor", "middle") // center the text on it's origin
                    .attr("transform", function(d) {
                        var cent = scope.textArc.centroid(d);
                        return "translate(" + cent + ")";
                    })
                        .style("font-size", Math.round(scope.radius / 6.5) + "px")
                        .style("font-weight", "bold")
                        .style("fill", "white")
                        .text(function(d, i) {
                            return si(d.data[scope.options.stack.key]);
                        });

                    scope.arcs.append("svg:text")
                        .attr("class", "small-text hover-show")
                        .attr("text-anchor", "middle")
                        .attr("transform", function(d) {
                            var cent = scope.textArc.centroid(d);
                            cent[1] = cent[1] + (scope.radius * .16);
                            return "translate(" + cent + ")";
                        })
                        .style("font-size", Math.round(scope.radius / 10) + "px")
                        .style("fill", "white")
                        .text(function(d, i) {
                            return d.data.label;
                        });
                    return this;
                };

                scope.update = function() {
                    scope.create();
                }

                return scope.create();

            }
        };
    });