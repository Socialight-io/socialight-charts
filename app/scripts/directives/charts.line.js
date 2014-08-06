angular.module('socCharts').directive('linechart', function() {
    return {
        templateUrl: _SocChartsConfig.path + 'charts/line.html',
        restrict: 'A',
        scope: {
            'linechart': '=',
            'options': '=',
            'loading': '='
        },
        link: function(scope, element, attrs) {

            scope.$watch("linechart", function() {
                scope.data = scope.linechart;
                scope.create();
            }, true);

            scope.$watch("options", function() {
                scope.update();
            }, true);

            scope.data = scope.linechart;

            scope.options = angular.extend({
                label: "label",
                stack: [{
                    key: "v1",
                    label: "Impressions",
                    color: "#006699"
                }, {
                    key: "v2",
                    label: "Comments",
                    color: "#996600"
                }, {
                    key: "v3",
                    label: "Likes",
                    color: "#FF0099"
                }],
                height: 400,
                legend: true,
                offset: {
                    left: 0,
                    top: 0
                },
                width: undefined,
                axis: {
                    x: {
                        show: true,
                        label: "label"
                    },
                    y: {
                        show: false,
                        label: "Traffic"
                    }
                },
                date: function() {},
                mouseover: function() {},
                mouseout: function() {},
                click: function() {}
            }, scope.options);

            $(window).on("resize", function() {
                scope.update();
            });

            element.height(scope.options.height);

            scope.create = function() {

                if (!scope.linechart || scope.linechart.length == 0) { 
                    return false;
                }
                
                var self = this,
                    featured = "v0";

                var margin = {
                    top: 20,
                    right: 0,
                    bottom: 30,
                    left: 0
                };

                if (scope.options.axis.y.show) {
                    margin.left += 0;
                };

                var width = scope.options.width || element.width();
                width = width - margin.left - margin.right;
                var height = scope.options.height - margin.top - margin.bottom;

                /* Calculate widths and heights */
                if (scope.options.timeseries) {
                    var x = d3.time.scale().range([0, width]);
                } else {
                    var x = d3.scale.ordinal().rangePoints([0, width]);
                }

                var y = d3.scale.linear().rangeRound([height, 0]);
                var xAxis = d3.svg.axis().scale(x).orient(["bottom"]);
                var yAxis = d3.svg.axis().scale(y).orient("right").tickFormat(d3.format(".2s"));

                var line = d3.svg.line().interpolate("cardinal").x(function(d) {
                    return x(typeof(scope.options.axis.x.label) == "function" ? scope.options.axis.x.label(d) : d[scope.options.axis.x.label]);
                }).y(function(d) {
                    return y(typeof(featured) == "function" ? featured(d) : d[featured]);
                });

                var container = d3.selectAll(element);
                container.selectAll(".chart").selectAll("svg").remove();
                var svg = container.selectAll(".chart").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g");
                if (scope.options && scope.options.offset) {
                    svg.attr("transform", "translate(" + (margin.left + scope.options.offset.left) + "," + (margin.top + scope.options.offset.top) + ")");
                }

                var data = [];
                data = angular.copy(scope.data);

                if (scope.options.sort && angular.isFunction(scope.options.sort) && angular.isFunction(data.sort)) {
                    if (data) {
                        data = data.sort(scope.options.sort);
                    }
                } else if (scope.options.sort && angular.isFunction(data.sort)) {
                    data.sort(function(a, b) {
                        if (scope.options.sort == "desc") {
                            return b.total - a.total;
                        } else {
                            return a.total - b.total;
                        }
                    });
                }

                if (scope.options.timeseries) {
                    if (scope.options.extent) {
                        x.domain(scope.options.extent);
                    } else {
                        x.domain(d3.extent(data, function(d) {
                            if (typeof(scope.options.axis.x.label) == "function") {
                                return scope.options.axis.x.label(d);
                            } else {
                                return d[scope.options.axis.x.label];
                            }
                        }));
                    }
                } else {
                    if (data.map) {
                        x.domain(data.map(function(d) {
                            if (typeof(scope.options.axis.x.label) == "function") {
                                return scope.options.axis.x.label(d);
                            } else {
                                return d[scope.options.axis.x.label];
                            }
                        }));
                    }
                }

                if (data) {
                    y.domain([0, d3.max(data, function(d) {
                        if (d) {
                            return d3.max(scope.options.stack, function(si) {
                                if (typeof(si.key) == "function") {
                                    return si.key(d);
                                } else {
                                    return d[si.key];
                                }
                            });
                        }
                    })]);
                }

                if (scope.options.axis.x.show) {
                    svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
                }

                if (scope.options.axis.y.show) {
                    svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 20).attr("dy", ".71em").style("text-anchor", "end").text(scope.options.axis.y.label);
                }

                if (scope.options && scope.options.stack) {
                    angular.forEach(scope.options.stack, function(l) {
                        featured = l.key;

                        if (data) {
                            svg.append("path").attr("class", "line").attr("d", line(data)).style("fill", "none").style("stroke", l.color).style("stroke-width", 5);
                            if (l.markers && l.markers.show) {
                                svg.selectAll(".marker-" + l.label).data(data).enter().append("circle").attr("class", "marker marker-" + l.label).attr("cx", function(d, i) {
                                    if (d) {
                                        return x(typeof(scope.options.axis.x.label) == "function" ? scope.options.axis.x.label(d) : d[scope.options.axis.x.label]);
                                    }
                                }).attr("r", function(d, i) {
                                    if (d) {
                                        return 7;
                                    }
                                }).attr("cy", function(d, i) {
                                    if (d) {
                                        return y(typeof(l.key) == "function" ? l.key(d) : d[l.key]);
                                    }
                                }).style("stroke", "white").style("fill", l.markers.color || "#999").style("stroke-width", 3).on("mouseover", self.options.mouseover || function() {}).on("mouseout", self.options.mouseout || function() {}).on("click", self.options.click || function() {});
                            }
                        }
                    });
                }

                if (scope.options.legend) {
                    var legend = svg.selectAll(".legend").data(scope.options.stack).enter().append("g").attr("class", "legend").attr("transform", function(d, i) {
                        return "translate(-20," + i * 20 + ")";
                    });
                    legend.append("rect").attr("x", width - 18).attr("width", 18).attr("height", 18).style("fill", function(d) {
                        return d.color;
                    });
                    legend.append("text").attr("x", width - 24).attr("y", 9).attr("dy", ".35em").style("text-anchor", "end").text(function(d) {
                        return d.label;
                    });
                }
            };
            scope.update = function() {
                scope.create();
            }
            scope.create();
        }
    };
});