"use strict";angular.module("socCharts",["ngAnimate","ngResource","ngRoute"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("socCharts").controller("MainCtrl",["$scope",function(a){a.options={label:"label",stack:[{key:"v1",label:"Impressions",color:"rgba(0,0,255, .5)"},{key:"v2",label:"Comments",color:"rgba(0,255,0, .5)"},{key:"v3",label:"Likes",color:"rgba(255,0,0, .5)"}],height:400,legend:!0,axis:{x:{show:!0},y:{show:!1,label:"Traffic"}},sort:"desc"},a.donutOptions={label:"label",stack:{key:"v1",label:"Impressions",colors:["#666666","#CCCCCC"]},height:400,sort:"desc"},a.loading=!1,a.data=[{label:"1AM",v1:4,v2:3,v3:1,color:"#FF0000"},{label:"4PM",v1:2,v2:6,v3:7},{label:"6PM",v1:3,v2:4,v3:2,color:"#00FF00"},{label:"12PM",v1:8,v2:8,v3:1},{label:"8PM",v1:4,v2:8,v3:1},{label:"9AM",v1:9,v2:6,v3:1}],a.update=function(){a.loading=a.loading?!1:!0}}]),angular.module("socCharts").directive("barchart",function(){return{templateUrl:"views/charts/bar.html",restrict:"A",scope:{barchart:"=",options:"=",loading:"="},link:function(a,b){a.$watch("barchart",function(){a.create()},!0),a.$watch("options",function(){a.update()},!0),a.options=angular.extend({label:"label",stack:[{key:"v1",label:"Impressions",color:"#006699"},{key:"v2",label:"Comments",color:"#996600"},{key:"v3",label:"Likes",color:"#FF0099"}],height:400,legend:!0,chartLabel:!1,axis:{x:{show:!0},y:{show:!1,label:"Traffic"}},sort:"desc",limit:!1},a.options),$(window).on("resize",function(){a.update()}),a.create=function(){if(!a.barchart)return!1;b.height(a.options.height);var c=d3.selectAll(b),d={top:20,right:0,bottom:20,left:0};a.options.axis.y.show&&(d.left+=a.options.axis.y.width||100);var e=a.options.width||b.width();e=e-d.left-d.right;var f=a.options.height-d.top-d.bottom,g=d3.scale.ordinal().rangeRoundBands([0,f],.1),h=d3.scale.linear().rangeRound([e,0]),i=d3.svg.axis().scale(g).orient("left"),j=d3.svg.axis().scale(h).orient("bottom").tickFormat(d3.format(".2s"));c.selectAll(".chart").selectAll("svg").remove();var k=c.selectAll(".chart").append("svg").attr("width",e+d.left+d.right).attr("height",f+d.top+d.bottom).append("g").attr("transform","translate("+d.left+","+d.top+")"),l=angular.copy(a.barchart);if(l.forEach(function(b,c){var d=0;l[c]={label:"function"==typeof a.options.axis.y.label?a.options.axis.y.label(b):b[a.options.axis.y.label]},a.options.stack?a.options.stack.forEach(function(a){if(l[c].values=l[c].values||[],"function"==typeof a.key){var e={label:a.label,color:a.color};e.y0=d,e.y1=d+=a.key(b),l[c].values.push(e)}else if(b[a.key]){var e={label:a.label,color:a.color};e.y0=d,e.y1=d+=b[a.key],l[c].values.push(e)}}):l[c].values=[{label:"test",color:l.color||"black",y0:0,y1:b.value}],l[c].total=l[c].values[l[c].values.length-1].y1}),a.options.sort&&"function"==typeof a.options.sort?l=l.sort(a.options.sort):a.options.sort&&l.sort(function(b,c){return"desc"==a.options.sort?c.total-b.total:b.total-c.total}),a.options.limit&&(l=l.slice(0,a.options.limit)),g.domain(l.map(function(a){return a.label})),h.domain([d3.max(l,function(a){return a.total}),0]),a.options.axis.x.show&&k.append("g").attr("class","x axis").attr("transform","translate(0,"+f+")").call(j),a.options.axis.y.show){var m=k.append("g").attr("class","y axis").call(i).append("text").attr("transform","rotate(-90)").attr("y",6).attr("dy",".71em").style("text-anchor","end");a.options.axis.y.showLabel&&m.text(a.options.axis.y.label("Label"))}var n=k.selectAll(".state").data(l).enter().append("g").attr("class","g").attr("transform",function(a){return"translate(0,"+g(a.label)+")"});if(n.selectAll("rect").data(function(a){return a.values}).enter().append("rect").attr("height",g.rangeBand()).attr("x",function(a){return h(a.y0)}).attr("width",function(a){return h(a.y1)-h(a.y0)}).style("fill",function(a){return a.color}),a.options.legend){var o=k.selectAll(".legend").data(a.options.stack).enter().append("g").attr("class","legend").attr("transform",function(a,b){return"translate(-20,"+20*b+")"});o.append("rect").attr("x",e-18).attr("width",18).attr("height",18).style("fill",function(a){return a.color}),o.append("text").attr("x",e-24).attr("y",9).attr("dy",".35em").style("text-anchor","end").text(function(a){return a.label})}},a.update=function(){a.create()},a.create()}}}),angular.module("socCharts").directive("linechart",function(){return{templateUrl:"views/charts/line.html",restrict:"A",scope:{linechart:"=",options:"=",loading:"="},link:function(a,b){a.$watch("linechart",function(){a.data=a.linechart,a.create()},!0),a.$watch("options",function(){a.update()},!0),a.data=a.linechart,a.options=angular.extend({label:"label",stack:[{key:"v1",label:"Impressions",color:"#006699"},{key:"v2",label:"Comments",color:"#996600"},{key:"v3",label:"Likes",color:"#FF0099"}],height:400,legend:!0,offset:{left:0,top:0},width:void 0,axis:{x:{show:!0,label:"label"},y:{show:!1,label:"Traffic"}},date:function(){},mouseover:function(){},mouseout:function(){},click:function(){}},a.options),$(window).on("resize",function(){a.update()}),b.height(a.options.height),a.create=function(){var c=this,d="v0",e={top:20,right:0,bottom:30,left:0};a.options.axis.y.show&&(e.left+=0);var f=a.options.width||b.width();f=f-e.left-e.right;var g=a.options.height-e.top-e.bottom;if(a.options.timeseries)var h=d3.time.scale().range([0,f]);else var h=d3.scale.ordinal().rangePoints([0,f]);var i=d3.scale.linear().rangeRound([g,0]),j=d3.svg.axis().scale(h).orient(["bottom"]),k=d3.svg.axis().scale(i).orient("right").tickFormat(d3.format(".2s")),l=d3.svg.line().interpolate("cardinal").x(function(b){return h("function"==typeof a.options.axis.x.label?a.options.axis.x.label(b):b[a.options.axis.x.label])}).y(function(a){return i("function"==typeof d?d(a):a[d])}),m=d3.selectAll(b);m.selectAll(".chart").selectAll("svg").remove();var n=m.selectAll(".chart").append("svg").attr("width",f+e.left+e.right).attr("height",g+e.top+e.bottom).append("g").attr("transform","translate("+(e.left+a.options.offset.left)+","+(e.top+a.options.offset.top)+")"),o=[];if(o=angular.copy(a.data),a.options.sort&&"function"==typeof a.options.sort?o&&(o=o.sort(a.options.sort)):a.options.sort&&o.sort(function(b,c){return"desc"==a.options.sort?c.total-b.total:b.total-c.total}),h.domain(a.options.timeseries?a.options.extent?a.options.extent:d3.extent(o,function(b){return"function"==typeof a.options.axis.x.label?a.options.axis.x.label(b):b[a.options.axis.x.label]}):o.map(function(b){return"function"==typeof a.options.axis.x.label?a.options.axis.x.label(b):b[a.options.axis.x.label]})),o&&i.domain([0,d3.max(o,function(b){return b?d3.max(a.options.stack,function(a){return"function"==typeof a.key?a.key(b):b[a.key]}):void 0})]),a.options.axis.x.show&&n.append("g").attr("class","x axis").attr("transform","translate(0,"+g+")").call(j),a.options.axis.y.show&&n.append("g").attr("class","y axis").call(k).append("text").attr("transform","rotate(-90)").attr("y",20).attr("dy",".71em").style("text-anchor","end").text(a.options.axis.y.label),a.options&&a.options.stack&&a.options.stack.forEach(function(b){d=b.key,o&&(n.append("path").attr("class","line").attr("d",l(o)).style("fill","none").style("stroke",b.color).style("stroke-width",5),b.markers&&b.markers.show&&n.selectAll(".marker-"+b.label).data(o).enter().append("circle").attr("class","marker marker-"+b.label).attr("cx",function(b){return b?h("function"==typeof a.options.axis.x.label?a.options.axis.x.label(b):b[a.options.axis.x.label]):void 0}).attr("r",function(a){return a?7:void 0}).attr("cy",function(a){return a?i("function"==typeof b.key?b.key(a):a[b.key]):void 0}).style("stroke","white").style("fill",b.markers.color||"#999").style("stroke-width",3).on("mouseover",c.options.mouseover||function(){}).on("mouseout",c.options.mouseout||function(){}).on("click",c.options.click||function(){}))}),a.options.legend){var p=n.selectAll(".legend").data(a.options.stack).enter().append("g").attr("class","legend").attr("transform",function(a,b){return"translate(-20,"+20*b+")"});p.append("rect").attr("x",f-18).attr("width",18).attr("height",18).style("fill",function(a){return a.color}),p.append("text").attr("x",f-24).attr("y",9).attr("dy",".35em").style("text-anchor","end").text(function(a){return a.label})}},a.update=function(){a.create()},a.create()}}}),angular.module("socCharts").directive("columnchart",function(){return{templateUrl:"views/charts/bar.html",restrict:"A",scope:{columnchart:"=",options:"=",loading:"="},link:function(a,b){a.$watch("columnchart",function(){a.create()},!0),a.$watch("options",function(){a.update()},!0),a.create=function(){a.data=a.columnchart,a.options=angular.extend({label:"label",stack:[{key:"v1",label:"Impressions",color:"#006699"},{key:"v2",label:"Comments",color:"#996600"},{key:"v3",label:"Likes",color:"#FF0099"}],height:400,legend:!0,axis:{x:{show:!0},y:{show:!1,label:"Traffic"}}},a.options);var c=d3.selectAll(b),d={top:10,right:10,bottom:24,left:10},e=a.options.width||b.width();e=e-d.left-d.right;var f=a.options.height-d.top-d.bottom;if(a.options.timeseries){var g=d3.time.scale().range([0,e]);if(a.options.extent)var h=a.options.extent;else var h=d3.extent(a.columnchart,function(b){return a.options.axis.x.label(b)});h=d3.time.days(h[0],h[1]),h=e/h.length*.9}else var g=d3.scale.ordinal().rangeRoundBands([0,e],.1);var i=d3.scale.linear().rangeRound([f,0]),j=d3.svg.axis().ticks(4).scale(g).orient("bottom").ticks(4),k=d3.svg.axis().ticks(4).scale(i).orient("left").tickFormat(d3.format(".2"));c.selectAll(".chart").selectAll("svg").remove();var l=c.selectAll(".chart").append("svg").attr("width",e+d.left+d.right).attr("height",f+d.top+d.bottom).append("g").attr("transform","translate("+d.left+","+d.top+")"),m=c.append("div").attr("class","tip").style("display","none"),n=[];if(a.columnchart&&angular.forEach(a.columnchart,function(b,c){var d=0;n[c]={label:"function"==typeof a.options.axis.x.label?a.options.axis.x.label(b):b[a.options.axis.x.label]},a.options.stack?angular.forEach(a.options.stack,function(a){if(n[c].values=n[c].values||[],"function"==typeof a.key){var e={label:a.label,color:a.color};e.y0=d,e.y1=d+=a.key(b),e.options=a,e.data=b,n[c].values.push(e)}else if(b[a.key]){var e={label:a.label,color:a.color};e.y0=d,e.y1=d+=b[a.key],e.options=a,e.data=b,n[c].values.push(e)}}):n[c].values=[{label:n.label,color:n.color||"black",y0:0,y1:b.value,data:v}],n[c].total=n[c].values&&n[c].values[n[c].values.length-1]&&n[c].values[n[c].values.length-1].y1?n[c].values[n[c].values.length-1].y1:0}),a.options.sort&&"function"==typeof a.options.sort?n=n.sort(a.options.sort):a.options.sort&&n.sort(function(b,c){return"desc"==a.options.sort?c.total-b.total:b.total-c.total}),a.options.timeseries){if(a.options.extent)var o=a.options.extent;else var o=d3.extent(n,function(b){return"function"==typeof a.options.axis.x.label?a.options.axis.x.label(b):b[a.options.axis.x.label]});g.domain(o)}else g.domain(p?n.map(function(a){return a.label}):n.map(function(b){return"function"==typeof a.options.axis.x.label?a.options.axis.x.label(b):b[a.options.axis.x.label]}));var p=1;i.domain([0,d3.max(n,function(a){return a.total})]),a.options.axis.x.show&&l.append("g").attr("class","x axis").attr("transform","translate(0,"+f+")").call(j),a.options.axis.y.show&&l.append("g").attr("class","y axis").call(k).append("text").attr("transform","rotate(-90)").attr("y",6).attr("dy",".71em").style("text-anchor","end").text(a.options.axis.y.label);var q=l.selectAll(".state").data(n).enter().append("g").attr("class","g").attr("transform",function(a){return"translate("+g(a.label)+",0)"});if(q.selectAll("rect").data(function(a){return a.values}).enter().append("rect").attr("width",a.options.timeseries?h:g.rangeBand()).attr("y",function(a){return i(a.y1)}).attr("class","over").attr("height",function(a){return i(a.y0)-i(a.y1)}).style("fill",function(a){return a.color}).on("click",function(b){a.options.click&&a.options.click(b)}).on("mouseover",function(b){var c=$(this).position();m.style("left",c.left+"px").style("top",c.top-40+"px").style("display","block").html(function(){return"function"==typeof a.options.tooltip?a.options.tooltip(b):b[a.options.tooltip]}).attr("font-family","sans-serif").attr("font-size","14px").attr("fill","red")}).on("mouseout",function(){m.style("display","none")}),a.options.legend){var r=l.selectAll(".legend").data(a.options.stack).enter().append("g").attr("class","legend").attr("transform",function(a,b){return"translate(0,"+20*b+")"});r.append("rect").attr("x",e-18).attr("width",18).attr("height",18).style("fill",function(a){return a.color}),r.append("text").attr("x",e-24).attr("y",9).attr("dy",".35em").style("text-anchor","end").text(function(a){return a.label})}},a.update=function(){a.create()},a.create()}}}),angular.module("socCharts").directive("donutchart",function(){return{templateUrl:"views/charts/donut.html",restrict:"A",scope:{donutchart:"=",options:"=",loading:"="},link:function(a,b){a.$watch("donutchart",function(){a.update()},!0),a.$watch("options",function(){a.update()},!0),$(window).on("resize",function(){a.update()});var c=d3.format(".2s");return a.create=function(){if(a.donutchart.length<=0)return!1;a.options=angular.extend({stack:{key:"v1",label:"Impressions",colors:["#0000FF","#006699"]},legend:!0,width:void 0,arcs:{main:{inner:.9,outer:1},text:{inner:.6,outer:1}},label:!0,mouseover:function(){},mouseout:function(){},click:function(){}},a.options);var d=d3.scale.linear().range(a.options.stack.colors);if(d.domain(d3.extent(a.donutchart,function(b){return b[a.options.stack.key]})),!a.donutchart||0==a.donutchart.length||!b.width())return!1;a.data=angular.copy(a.donutchart),a.width=a.options.width||b.width(),a.radius=a.options.height&&a.width>a.options.height?a.options.height/2:a.width/2,b.height(a.options.height?a.options.height:2*a.radius),a.arc=d3.svg.arc().innerRadius(a.radius*a.options.arcs.main.inner).outerRadius(a.radius*a.options.arcs.main.outer),a.textArc=d3.svg.arc().innerRadius(a.radius*a.options.arcs.text.inner).outerRadius(a.radius*a.options.arcs.text.outer),a.pie=d3.layout.pie().value(function(b){return b[a.options.stack.key]}).sort(null);var e=d3.selectAll(b);return e.selectAll(".chart").selectAll("svg").remove(),a.vis=e.selectAll(".chart").append("svg").data(a.data).attr("class","donut-chart").attr("width",a.options.width).attr("height",a.options.height||2*a.radius).append("svg:g").attr("transform","translate("+a.radius+","+a.radius+")"),a.options.label&&(a.vis.append("svg:text").attr("class","chart-label").attr("text-anchor","middle").attr("transform","translate(0,"+Math.round(a.radius/10)+")").style("font-size",Math.round(a.radius/2.5)+"px").text(c(d3.sum(a.data,function(b){return b[a.options.stack.key]}))),a.vis.append("svg:text").attr("class","chart-sub-label").attr("text-anchor","middle").attr("transform","translate(0,"+.3*a.radius+")").style("font-size",Math.round(.15*a.options.radius)).text(a.options.stack.label)),a.data.length&&(a.arcs=a.vis.selectAll("g.slice").data(a.pie(a.data)).enter().append("svg:g").attr("class","slice"),a.arcs.append("svg:path").attr("class",function(a){return a.data.label}).attr("fill",function(b){return angular.isFunction(a.options.stack.colors)?a.options.stack.colors(b):d(b.value)}).style("opacity",.7).attr("d",a.textArc).each(function(b){a._current=b}),a.arcs.append("svg:path").attr("class",function(a){return a.data.label}).attr("fill",function(b){return angular.isFunction(a.options.stack.colors)?a.options.stack.colors(b):d(b.value)}).style("opacity","1").attr("d",a.arc).each(function(b){a._current=b}).on("click",a.options.click||function(a){console.log(a)})),a.arcs.append("svg:text").attr("class","hover-show").attr("text-anchor","middle").attr("transform",function(b){var c=a.textArc.centroid(b);return"translate("+c+")"}).style("font-size",Math.round(a.radius/6.5)+"px").style("font-weight","bold").style("fill","white").text(function(b){return c(b.data[a.options.stack.key])}),a.arcs.append("svg:text").attr("class","small-text hover-show").attr("text-anchor","middle").attr("transform",function(b){var c=a.textArc.centroid(b);return c[1]=c[1]+.16*a.radius,"translate("+c+")"}).style("font-size",Math.round(a.radius/10)+"px").style("fill","white").text(function(a){return a.data.label}),this},a.update=function(){a.create()},a.create()}}}),angular.module("socCharts").directive("posts",function(){return{templateUrl:"views/charts/posts.html",restrict:"A",scope:{posts:"=",options:"=",loading:"="},link:function(a){a.fixPic=function(a){return a?a.replace("50.50","200.200").replace("50x50","200x200"):null}}}});