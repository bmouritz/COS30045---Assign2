function init(){
    var w = 800;
    var h = 300;
    var yPadding = 20;
    var xPadding = 60;

    var dataset;

    var svg = d3.select("#wasteChart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

    var rowConvertor = function(d){
      return {
        date: new Date(+d.year, 0),
        total_collected: parseInt(+d.total_annual_tonnes_collected),
		total_processed: parseInt(+d.total_annual_tonnes_processed)
      };
    }
    
	d3.csv("./data/victoriawaste.csv", rowConvertor, function(data){
		dataset = data;
    	lineChart(dataset);
		legend();
    });
      
    function lineChart(dataset){
		console.log(dataset);

      var xScale = d3.scaleTime()
        .domain([
          d3.min(dataset, function(d){ return d.date; }),
          d3.max(dataset, function(d){ return d.date; })
        ])
        .range([xPadding, w]);

      var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function(d){ return d.total_collected })
        ]).range([h - yPadding, 0]);

      var line = d3.line()
        .x(function(d){return xScale(d.date);})
        .y(function(d){return yScale(d.total_collected);});

	  var line2 = d3.line()
        .x(function(d){return xScale(d.date);})
        .y(function(d){return yScale(d.total_processed);});
  
      svg.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("d", line);
	
	  svg.append("path")
        .datum(dataset)
        .attr("class", "line2")
        .attr("d", line2);

      var xAxis = d3.axisBottom().ticks(18).scale(xScale);
      var yAxis = d3.axisLeft().scale(yScale);

      svg.append("g")
        .attr("transform", "translate (0, " + (h - yPadding) + ")")
        .attr("class", "axis")
        .call(xAxis);

      svg.append("g")
        .attr("transform", "translate (" + xPadding + ", 0)")
        .attr("class", "axis")
        .call(yAxis);
    }

	function legend(){
		svg.append("circle").attr("cx",200).attr("cy",130).attr("r", 6).style("fill", "#69b3a2");
		svg.append("circle").attr("cx",200).attr("cy",160).attr("r", 6).style("fill", "#404080");
		svg.append("text").attr("x", 220).attr("y", 130).text("Victorian Waste Collected").style("font-size", "15px").attr("alignment-baseline","middle");
		svg.append("text").attr("x", 220).attr("y", 160).text("Victorian Waste Processed").style("font-size", "15px").attr("alignment-baseline","middle");
	}
}

window.onload = init;