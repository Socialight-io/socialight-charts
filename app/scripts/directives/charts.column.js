'use strict';
angular.module('socCharts').directive('columnchart', function() {
    return {
        templateUrl: _SocChartsConfig.path + 'charts/bar.html',
        restrict: 'A',
        scope: {
            'columnchart': '=',
            'options': '=',
            'loading': '='
        },
        link: function(scope, element, attrs) {
            scope.$watch("columnchart", function() {
                scope.create();
            }, true);

            scope.$watch("options", function() {
                scope.update();
            }, true);

            scope.create = function() {
                scope.data = scope.columnchart;
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
                    axis: {
                        x: {
                            show: true
                        },
                        y: {
                            show: false,
                            label: "Traffic"
                        }
                    }
                }, scope.options);

                var self = this;
                var container = d3.selectAll(element);
                var margin = {
                    top: 10,
                    right: 10,
                    bottom: 24,
                    left: 10
                };

                var width = scope.options.width || element.width();
                width = width - margin.left - margin.right;
                var height = scope.options.height - margin.top - margin.bottom;

                if (scope.options.timeseries) {
                    var x = d3.time.scale().range([0, width]);
                    if (scope.options.extent) {
                        var barWidth = scope.options.extent;
                    } else {
                        var barWidth = d3.extent(scope.columnchart, function(d) {
                            return scope.options.axis.x.label(d);
                        });
                    }
                    barWidth = d3.time.days(barWidth[0], barWidth[1]);
                    barWidth = (width / barWidth.length) * .9;
                } else {
                    var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
                }

                var y = d3.scale.linear().rangeRound([height, 0]);
                var xAxis = d3.svg.axis().ticks(4).scale(x).orient("bottom").ticks(4);
                var yAxis = d3.svg.axis().ticks(4).scale(y).orient("left").tickFormat(d3.format(".2"));
                container.selectAll(".chart").selectAll("svg").remove();
                var svg = container.selectAll(".chart").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                var tooltip = container.append("div")
                    .attr("class", "tip")
                    .style("display", "none");

                var data = [];

                if (scope.columnchart) {
                    angular.forEach(scope.columnchart, function(d, i) {

                        var y0 = 0;
                        data[i] = {
                            label: typeof(scope.options.axis.x.label) == "function" ? scope.options.axis.x.label(d) : d[scope.options.axis.x.label]
                        };
                        if (scope.options.stack) {
                            angular.forEach(scope.options.stack, function(v) {
                                data[i].values = data[i].values || [];
                                if (typeof(v.key) == "function") {
                                    var value = {
                                        label: v.label,
                                        color: v.color
                                    };
                                    value.y0 = y0;
                                    value.y1 = y0 += v.key(d);
                                    value.options = v;
                                    value.data = d;
                                    data[i].values.push(value);
                                } else if (d[v.key]) {
                                    var value = {
                                        label: v.label,
                                        color: v.color
                                    };
                                    value.y0 = y0;
                                    value.y1 = y0 += d[v.key];
                                    value.options = v;
                                    value.data = d;
                                    data[i].values.push(value);
                                }
                            });
                        } else {
                            data[i].values = [{
                                label: data.label,
                                color: data.color || "black",
                                y0: 0,
                                y1: d.value,
                                data: v
                            }];
                        }

                        if (data[i].values && data[i].values.length) {
                            data[i].total = data[i].values[data[i].values.length - 1].y1;
                        } else {
                            data[i].total = 0;
                        }
                    });
                }

                if (scope.options.sort && angular.isFunction(scope.options.sort) && angular.isFunction(data.sort)) {
                    data = data.sort(scope.options.sort);
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
                        var extent = scope.options.extent;
                    } else {
                        var extent = d3.extent(data, function(d) {
                            return typeof(scope.options.axis.x.label) == "function" ? scope.options.axis.x.label(d) : d[scope.options.axis.x.label];
                        });
                    }
                    x.domain(extent);
                } else if (!run && angular.isFunction(data.map)) {
                    x.domain(data.map(function(d) {
                        /*console.log(d);
                        console.log(scope.options.axis.x.label(d));*/
                        return typeof(scope.options.axis.x.label) == "function" ? scope.options.axis.x.label(d) : d[scope.options.axis.x.label];
                    }));
                } else if (angular.isFunction(data.map)) {
                    x.domain(data.map(function(d) {
                        return d.label;
                    }));
                }

                var run = 1;

                /* console.log(x.domain()); */
                y.domain([0, d3.max(data, function(d) {
                    return d.total;
                })]);

                if (scope.options.axis.x.show) {
                    svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
                }
                if (scope.options.axis.y.show) {
                    svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text(scope.options.axis.y.label);
                }
                var bar = svg.selectAll(".state").data(data).enter().append("g").attr("class", "g").attr("transform", function(d) {
                    return "translate(" + x(d.label) + ",0)";
                });

                bar.selectAll("rect").data(function(d) {
                    return d.values;
                }).enter().append("rect").attr("width", scope.options.timeseries ? barWidth : x.rangeBand()).attr("y", function(d) {
                    return y(d.y1);
                }).attr("class", "over").attr("height", function(d) {
                    return y(d.y0) - y(d.y1);
                }).style("fill", function(d) {
                    return d.color;
                }).on("click", function(d, i) {
                    if (scope.options.click) {
                        scope.options.click(d);
                    }
                }).on("mouseover", function(ob, i, el) {
                    var pos = $(this).position();

                    tooltip.style("left", pos.left + "px")
                        .style("top", (pos.top - 40) + "px")
                        .style("display", "block")
                        .html(function(d) {
                            return typeof(scope.options.tooltip) == "function" ? scope.options.tooltip(ob) : ob[scope.options.tooltip];
                        })
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "14px")
                        .attr("fill", "red");
                }).on("mouseout", function(d, i, el) {
                    tooltip.style("display", "none")
                });

                if (scope.options.legend) {
                    var legend = svg.selectAll(".legend").data(scope.options.stack).enter().append("g").attr("class", "legend").attr("transform", function(d, i) {
                        return "translate(0," + i * 20 + ")";
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