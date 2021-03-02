function init(){
    var w = 1000;
    var h = 300;
	var padding = 20;
    var xPadding = 30;
    var yPadding = 20;
    
	var dataset;

	var svg = d3.select("#wasteChart").append("svg").attr("width", w).attr("height", h);
    
    d3.csv("./data/kerbsidevicdata2.csv").then(function(data){
        dataset = data.map(function(d) { return [+d["Years"], +d["Total_Annual_tonnes_Collected"], +d["Total_Annual_Tonnes_Processed"]];});
	
		var xScale = d3.scaleLinear()
						.domain([d3.min(dataset, function(d){
							return d[0];
						}),
						d3.max(dataset, function(d){
							return d[0];
						})])
						.range([xPadding, w - xPadding]);

		var yScale = d3.scaleLinear()
						.domain([d3.min(dataset, function(d){
							return d[1];
						}),
						d3.max(dataset, function(d){
							return d[1];
						})])
						.range([h - yPadding, yPadding]);
		
		var xAxis = d3.axisBottom().ticks(20).scale(xScale);
		var yAxis = d3.axisLeft().ticks(5).scale(yScale);
		
		svg.selectAll("circle").data(dataset).enter().append("circle")
			.attr("cx", function(d, i) {
					return xScale(d[0]);
			})
			.attr("cy", function(d){
				return yScale(d[1]);
			})
			.attr("r", 5)
			.attr("fill", function(d){
				return "grey";                
		});
		
		svg.append("g").attr("transform", "translate(0, "+ (h - padding) +")").call(xAxis);
		svg.append("g").attr("transform", "translate(" + 30 + ", 0)").call(yAxis);
		
       }).catch(function(error){
        d3.select("svg")
         .append("text")
         .text("Couldn't load data")
         .attr("x", function(d){
           return w / 2;
         })
         .attr("y", function(d){
           return h / 2;
         })
         .style('fill', 'red');
    });
}

window.onload = init;