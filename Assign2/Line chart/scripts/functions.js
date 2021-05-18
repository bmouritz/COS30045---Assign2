// Create Line Chart
function lineChart(dataset, dataset1) {
  var w = 700;
  var h = 300;
  var padding = 40;

  // Derived metrics for waste output
  dataset = d3.nest()
    .key(function(d) { return d.Year; })
    .rollup(function(v) { return d3.sum(v, function(d) { return d.Tonnes; }); })
    .entries(dataset);

  // Derived metrics for GDP output
  dataset1 = d3.nest()
    .key(function(d) { return d.Year; })
    .rollup(function(v) { return d3.sum(v, function(d) { return d.Amount; }); })
    .entries(dataset1);
  
  // xScaling
  xScale = d3.scaleTime()
  .domain(d3.extent(dataset1, function(d) { 
    return new Date(d.key); 
  }))
  .range([padding, w-29]);

  // yScaling for the left axis
  y1Scale = d3.scaleLinear()
  .domain([0, d3.max(dataset, function(d) { return d.value; })])
  .range([h - padding, 0]);

  // yScaling for the right axis
  y2Scale = d3.scaleLinear()
  .domain([0, d3.max(dataset1, function(d) { return d.value; })])
  .range([h - padding, 0]);

  // Set up the left axis line
  y1Line = d3.line()
  .x(function(d) { return xScale(new Date(d.key)); })
  .y(function(d) { return y1Scale(d.value); });

  // Set up the right axis line
  y2Line = d3.line()
  .x(function(d) { return xScale(new Date(d.key)); })
  .y(function(d) { return y2Scale(d.value); });

  var svg = d3.select("#chart")
    .append("svg")
    .attr("width",w + padding + padding)
    .attr("height",h);

  // Append the left axis line
  svg.append("path")
    .datum(dataset)
    .attr("class", "y1Line")
    .attr("transform", "translate(" + 50 + ",0)")
    .attr("d", y1Line);

  // Append the right axis line
  svg.append("path")
    .datum(dataset1)
    .attr("class", "y2Line")
    .attr("transform", "translate(" + 50 + ",0)")
    .attr("d", y2Line);

  // Add x axis
  xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(10)
    .tickFormat(d3.timeFormat("%Y"));

  // Add left y axis
  y1Axis = d3.axisLeft()
    .scale(y1Scale)
    .ticks(10)
    .tickFormat(d3.format(".0s")); // Format y scale in million;

  // Add right y axis
  y2Axis = d3.axisRight()
    .scale(y2Scale)
    .ticks(10);

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(50," + (h - padding) + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "axis")
    .attr("color","red")
    .attr("transform", "translate(" + 90 + ",0)")
    .call(y1Axis);

  svg.append("g")
    .attr("class", "axis")
    .attr("color","green")
    .attr("transform", "translate(" + (720) + ",0)")
    .call(y2Axis);

  // Add circles for waste path
  svg.selectAll("wastecircle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("id", "wastecircle")
    .attr("cx", function(d) {
            return xScale(new Date(d.key));
    })
    .attr("cy", function(d){
        return y1Scale(d.value);
    })
    .attr("r", 5)
    .attr("transform", "translate(" + 50 + ",0)")
    .style("fill", "red");

  // Add circles for GDP path
  svg.selectAll("gdpcircle")
    .data(dataset1)
    .enter()
    .append("circle")
    .attr("id", "gdpcircle")
    .attr("cx", function(d) {
            return xScale(new Date(d.key));
    })
    .attr("cy", function(d){
        return y2Scale(d.value);
    })
    .attr("r", 5)
    .attr("transform", "translate(" + 50 + ",0)")
    .style("fill", "green");

  // Adding Y1 axis label
  svg.append("text")
    .attr("id", "y1label")
    .attr("text-anchor", "middle")
    .attr("y", 30)
    .attr("x", -h / 2)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Tonnes of Waste (M)");

  // Adding Y2 axis label
  svg.append("text")
    .attr("id", "y2label")
    .attr("text-anchor", "middle")
    .attr("y", -w - 82)
    .attr("x", h / 2)
    .attr("dy", ".75em")
    .attr("transform", "rotate(90)")
    .text("$ (M)");

// Adding X axis label
svg.append("text")
    .attr("id", "xlabel")
    .attr("text-anchor", "middle")
    .attr("x", 50 + w / 2)
    .attr("y", h)
    .text("Year");

  // Hover effects and tooltips
  var HoverOn = function(){
    // Hover for Waste line
    svg.selectAll("#wastecircle")
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
          .select("#waste")
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
    
    // Hover for GDP
    svg.selectAll("#gdpcircle")
      .on("mouseover", function(d){
        // Get mouse location
        var mouse = d3.mouse(this);
        // Get top location of chart element
        var y = document.getElementById("chart").getBoundingClientRect().top;
              
        var formatComma = d3.format(",");
        var formatYear = d3.timeFormat("%Y");
        d3.select(this).style("opacity", 1);

        // Position the tooltip
        d3.select("#tooltip1")
          .style("left", mouse[0] + "px")
          .style("top", (d3.event.pageY - y) + "px")
          .select("#value")
          .text(function() { return formatComma(d.value); }); // add commas to tooltip value

        d3.select("#tooltip1")
          .select("#year")
          .text(function() { return formatYear(new Date(d.key)); }); // add commas to tooltip value
                
        //Show the tooltip 
        d3.select("#tooltip1")
          .classed("hidden", false ); 

      }).style("fill", "green")
      .style("opacity", 0.6)
      .on("mouseout", function () { 
        d3.select(this).style("opacity", 0.6);
        //Hide the tooltip 
        d3.select("#tooltip1")
          .classed("hidden", true );
      });
    };
  HoverOn();
}
