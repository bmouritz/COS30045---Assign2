// Create Line Chart
function lineChart(dataset) {
  var w = 615;
  var h = 300;
  var padding = 40;

  dataset = d3.nest()
    .key(function(d) { return d.Year; })
    .rollup(function(v) { return d3.sum(v, function(d) { return d.Tonnes; }); })
    .entries(dataset);

  console.log(dataset);
  
  xScale = d3.scaleTime()
  .domain(d3.extent(dataset, function(d) { 
    return new Date(d.key); 
  }))
  .range([padding, w-29]);

  y1Scale = d3.scaleLinear()
  .domain([0, d3.max(dataset, function(d) { return d.value; })])
  .range([h - padding, 0]);

 /* y2Scale = d3.scaleLinear()
  .domain([0, d3.max(dataset, function(d) { return d.billions; })])
  .range([h - padding, 0]);*/

  // Set up the Lines
  y1Line = d3.line()
  .x(function(d) { return xScale(new Date(d.key)); })
  .y(function(d) { return y1Scale(d.value); });

/*  y2Line = d3.line()
  .x(function(d) { return xScale(d.year); })
  .y(function(d) { return y2Scale(d.billions); });*/

  var svg = d3.select("#chart")
    .append("svg")
    .attr("width",w)
    .attr("height",h);

  svg.append("path")
    .datum(dataset)
    .attr("class", "y1Line")
    .attr("d", y1Line);

/*  svg.append("path")
    .datum(dataset)
    .attr("class", "y2Line")
    .attr("d", y2Line);*/

  //Add Axis
  xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(10)
    .tickFormat(d3.timeFormat("%Y"));

  y1Axis = d3.axisLeft()
    .scale(y1Scale)
    .ticks(10);

/*  y2Axis = d3.axisRight()
    .scale(y2Scale)
    .ticks(10);*/

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "axis")
    .attr("color","green")
    .attr("transform", "translate(" + padding + ",0)")
    .call(y1Axis);

/*  svg.append("g")
    .attr("class", "axis")
    .attr("color","red")
    .attr("transform", "translate(" + (600-15) + ",0)")
    .call(y2Axis);*/

  svg.selectAll("circle").data(dataset).enter().append("circle")
    .attr("cx", function(d) {
            return xScale(new Date(d.key));
    })
    .attr("cy", function(d){
        return y1Scale(d.value);
    })
    .attr("r", 5)
    .attr("fill", "red");

  // Hover effects and tooltips for derived metrics
  var HoverOn = function(){
    svg.selectAll("circle")
      .on("mouseover", function(d){
      // Get mouse location
      var mouse = d3.mouse(this);
      // Get top location of chart element
      var y = document.getElementById("chart").getBoundingClientRect().top;
            
      var formatComma = d3.format(",");
      var formatYear = d3.timeFormat("%Y");
      d3.select(this).style("opacity", 1);

      // Position the tooltip
      d3.select("#tooltip")
        .style("left", mouse[0] + "px")
        .style("top", (d3.event.pageY - y) + "px")
        .select("#value")
        .text(function() { return formatComma(d.value); }); // add commas to tooltip value

      d3.select("#tooltip")
        .select("#year")
        .text(function() { return formatYear(new Date(d.key)); }); // add commas to tooltip value
               
      //Show the tooltip 
      d3.select("#tooltip")
        .classed("hidden", false ); 
    }).style("fill", "red")
    .style("opacity", 0.6)
    .on("mouseout", function () { 
      d3.select(this).style("opacity", 0.6);
      //Hide the tooltip 
      d3.select("#tooltip")
        .classed("hidden", true );
    });
  };
  HoverOn();
}
