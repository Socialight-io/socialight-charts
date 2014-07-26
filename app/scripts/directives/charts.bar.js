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
