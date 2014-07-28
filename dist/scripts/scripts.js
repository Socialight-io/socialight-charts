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
'use strict';

angular.module('socCharts')
    .controller('MainCtrl', function($scope) {

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
'use strict';

angular.module('socCharts')
  .directive('barchart', function () {
    return {
      templateUrl: _SocChartsConfig.path+'views/charts/bar.html',
      restrict: 'A',
      scope: {
	  	'barchart': '=',
	  	'options': '=',
	  	'loading': '='  
      },
      link: function (scope, element, attrs) {
		  
		scope.$watch("barchart", function () { 
			scope.create();
		}, true);

		scope.$watch("options", function () { 
			scope.update();
		}, true);
		
		scope.options = angular.extend({ 
			label: "label",
			stack: [
				{ 
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
				}
			], 
			height: 400,
			legend: true,
			chartLabel: false,
			axis: {
				x: {
					show: true
				},
				y: {
					show: false,
					label: "Traffic"
				}
			},
			sort: "desc",
			limit: false
		}, scope.options);
		
        $(window).on("resize", function () { 
	    	scope.update();
        });
		
		scope.create = function () { 

			if (!scope.barchart) { return false; }
			
		  	var self = this;
		  
			element.height(scope.options.height);
	
			var container = d3.selectAll(element);
			
			var margin = {top: 20, right: 0, bottom: 20, left: 0};
			
			// Legend fix
			if (scope.options.axis.y.show) { margin.left += scope.options.axis.y.width || 100; };
			
			var width = scope.options.width || element.width();
			
			width = width - margin.left - margin.right;
			var height = scope.options.height - margin.top - margin.bottom;
			
			var y = d3.scale.ordinal()
			    .rangeRoundBands([0, height], .1);
			
			var x = d3.scale.linear()
			    .rangeRound([width, 0]);
			
			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left");
			
			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom")
			    .tickFormat(d3.format(".2s"));
			
		  container.selectAll(".chart").selectAll("svg").remove();

		  var svg = container.selectAll(".chart").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
		  var data = angular.copy(scope.barchart);
		  var y0 = 0;
		  		  			
		  data.forEach(function(d, i) {
		  
		    var y0 = 0;
			data[i] = {
				label: typeof(scope.options.axis.y.label) == "function" ? scope.options.axis.y.label(d) : d[scope.options.axis.y.label]
			};
			
			if (scope.options.stack) { 
			    scope.options.stack.forEach(function (v) { 
			    	data[i].values = data[i].values || [];
			    	
				    if (typeof(v.key) == "function") { 
				    	var value = {
					    	label: v.label,
					    	color: v.color
				    	};
				    	value.y0 = y0;
				    	value.y1 = y0 += v.key(d);
					    data[i].values.push(value);
				    } else if (d[v.key]) { 
				    	var value = {
					    	label: v.label,
					    	color: v.color
				    	};
				    	value.y0 = y0;
				    	value.y1 = y0 += d[v.key];
					    data[i].values.push(value);					    
				    }
			    });
		    } else { 
			    data[i].values = [{
				    label: "test",
				    color: data.color || "black",
				    y0: 0,
				    y1: d.value
			    }];
		    }
			
		    data[i].total = data[i].values[data[i].values.length - 1].y1;
		    
		  });
		  
		  if (scope.options.sort && typeof(scope.options.sort) == "function") {
		  	data = data.sort(scope.options.sort);
		  } else if (scope.options.sort) { 
		  	data.sort(function(a, b) { 
		  		if (scope.options.sort == "desc") { 
		  			return b.total - a.total; 
		  		} else { 
			  		return a.total - b.total;
		  		}
		  	});
		  }

		  if (scope.options.limit) { 
		  	data = data.slice(0, scope.options.limit);
		  }
		  
		  y.domain(data.map(function(d) { return d.label; }));	
		  x.domain([d3.max(data, function(d) { return d.total; }), 0]);
		  
		  if (scope.options.axis.x.show) {
			  svg.append("g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + height + ")")
			      .call(xAxis);
		 }
		 
		 if (scope.options.axis.y.show) { 
			 var yaxis = svg.append("g")
			      .attr("class", "y axis")
			      .call(yAxis)
			    .append("text")
			      .attr("transform", "rotate(-90)")
			      .attr("y", 6)
			      .attr("dy", ".71em")
			      .style("text-anchor", "end");
			      if (scope.options.axis.y.showLabel) { 
			      	yaxis.text(scope.options.axis.y.label("Label"));
			      }
		 }
		
		  var bar = svg.selectAll(".state")
		      .data(data)
		    .enter().append("g")
		      .attr("class", "g")
		      .attr("transform", function(d) { return "translate(0," + y(d.label) + ")"; });
		
		  bar.selectAll("rect")
		      .data(function(d) { return d.values; })
		    .enter().append("rect")
		      .attr("height", y.rangeBand())
		      .attr("x", function(d) { return x(d.y0); })
		      .attr("width", function(d) { return x(d.y1) - x(d.y0); })
		      .style("fill", function(d) { return d.color; });
		
		  if (scope.options.legend) { 
			  var legend = svg.selectAll(".legend")
			      .data(scope.options.stack)
			    .enter().append("g")
			      .attr("class", "legend")
			      .attr("transform", function(d, i) { return "translate(-20," + i * 20 + ")"; });
			
			  legend.append("rect")
			      .attr("x", width - 18)
			      .attr("width", 18)
			      .attr("height", 18)
			      .style("fill", function (d) { return d.color; });
			
			  legend.append("text")
			      .attr("x", width - 24)
			      .attr("y", 9)
			      .attr("dy", ".35em")
			      .style("text-anchor", "end")
			      .text(function(d) { return d.label; });
		  }
		};
		
		scope.update = function () { 
			scope.create();
		}

		scope.create();
		
      }
    };
  });

angular.module('socCharts').directive('linechart', function() {
    return {
        templateUrl: _SocChartsConfig.path + 'views/charts/line.html',
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
                offset: { left: 0, top: 0 },
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

                var self = this, featured = "v0";

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
                if (scope.options.timeseries) { var x = d3.time.scale().range([0, width]); } 
                else { var x = d3.scale.ordinal().rangePoints([0, width]); }

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
                var svg = container.selectAll(".chart").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + (margin.left + scope.options.offset.left) + "," + (margin.top + scope.options.offset.top) + ")");
                
                var data = [];
                data = angular.copy(scope.data);

                if (scope.options.sort && typeof(scope.options.sort) == "function") {
                    if (data) { 
                        data = data.sort(scope.options.sort);
                    }   
                } else if (scope.options.sort) {
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
	                        return typeof(scope.options.axis.x.label) == "function" ? scope.options.axis.x.label(d) : d[scope.options.axis.x.label];
	                    }));
                	}
                } else {
                    x.domain(data.map(function(d) {
                        return typeof(scope.options.axis.x.label) == "function" ? scope.options.axis.x.label(d) : d[scope.options.axis.x.label];
                    }));
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
                    scope.options.stack.forEach(function(l) {
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
'use strict';
angular.module('socCharts').directive('columnchart', function() {
    return {
        templateUrl: _SocChartsConfig.path + 'views/charts/bar.html',
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

                        data[i].total = data[i].values[data[i].values.length - 1] && data[i].values[data[i].values.length - 1].y1 ? data[i].values[data[i].values.length - 1].y1 : 0;
                    });
                }

                if (scope.options.sort && typeof(scope.options.sort) == "function") {
                    data = data.sort(scope.options.sort);
                } else if (scope.options.sort) {
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
                } else if (!run) {
                    x.domain(data.map(function(d) {
                        /*console.log(d);
                        console.log(scope.options.axis.x.label(d));*/
                        return typeof(scope.options.axis.x.label) == "function" ? scope.options.axis.x.label(d) : d[scope.options.axis.x.label];
                    }));
                } else {
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

                //scope.loading = true;

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

angular.module('socCharts-templates', []);