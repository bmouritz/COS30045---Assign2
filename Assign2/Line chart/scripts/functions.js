// Create Line Chart
function lineChart(dataset) {

  // console.table(dataset, ["year","tonnes","billions"]);

  var w = 615;
  var h = 300;
  var padding = 40;

  xScale = d3.scaleTime()
  .domain([
    d3.min(dataset, function(d) { return d.year; }),
    d3.max(dataset, function(d) { return d.year; })
  ])
  .range([padding, w-29]);

  y1Scale = d3.scaleLinear()
  .domain([0, d3.max(dataset, function(d) { return d.tonnes; })])
  .range([h - padding, 0]);

  y2Scale = d3.scaleLinear()
  .domain([0, d3.max(dataset, function(d) { return d.billions; })])
  .range([h - padding, 0]);

  // Set up the Lines
  y1Line = d3.line()
  .x(function(d) { return xScale(d.year); })
  .y(function(d) { return y1Scale(d.tonnes); });

  y2Line = d3.line()
  .x(function(d) { return xScale(d.year); })
  .y(function(d) { return y2Scale(d.billions); });

  var svg = d3.select("#chart")
  .append("svg")
  .attr("width",w)
  .attr("height",h);

  svg.append("path")
  .datum(dataset)
  .attr("class", "y1Line")
  .attr("d", y1Line);

  svg.append("path")
  .datum(dataset)
  .attr("class", "y2Line")
  .attr("d", y2Line);

  //Add Axis
  xAxis = d3.axisBottom()
  .scale(xScale)
  .ticks(10)
  .tickFormat(d3.timeFormat("%Y"));

  y1Axis = d3.axisLeft()
  .scale(y1Scale)
  .ticks(10);

  y2Axis = d3.axisRight()
  .scale(y2Scale)
  .ticks(10);

  svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(0," + (h - padding) + ")")
  .call(xAxis);

  svg.append("g")
  .attr("class", "axis")
  .attr("color","green")
  .attr("transform", "translate(" + padding + ",0)")
  .call(y1Axis);

  svg.append("g")
  .attr("class", "axis")
  .attr("color","red")
  .attr("transform", "translate(" + (600-15) + ",0)")
  .call(y2Axis);
}
