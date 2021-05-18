function generateLegend(min, max, colorScheme){

  var w = 70;
  var h = 120;

  var num2 = max * 0.25; // 25% value
  var num3 = max * 0.5;  // 50% value
  var num4 = max * 0.75; // 75% value

  var f = d3.format("0.2s"); // Set up formatting for labels

  var labels = [
    f(Math.round(min)).replace(/G/,"B"),
    f(Math.round(num2)).replace(/G/,"B"),
    f(Math.round(num3)).replace(/G/,"B"),
    f(Math.round(num4)).replace(/G/,"B"),
    f(Math.round(max)).replace(/G/,"B")
  ];

  var svg = d3.select("#legend")
    .append("svg")
    .attr("class", "vis")
    .attr("width",w)
    .attr("height",h);

  // Set up colour scale dynamically
  var colorScale = d3.scaleThreshold()
      .domain([min,num2,num3,num4,max])
      .range(colorScheme);

  var g = svg.append("g")
      .attr("class", "legendThreshold")
      .attr("transform", "translate(5,20)");
      // .attr("transform", "translate(5,-10)");

  g.append("text")
      .attr("class", "caption")
      .attr("x", 0)
      .attr("y", -6)
      .style("font-weight","bold")
      .text("Legend"); // Set dynamically

  var legend = d3.legendColor()
      .labels(function (d) { return labels[d.i]; })
      .shapePadding(4)
      .scale(colorScheme);

  svg.select(".legendThreshold")
      .call(legend);
};
