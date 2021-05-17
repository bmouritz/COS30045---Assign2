function generateLegend(min,max,colorScheme){

  var num2 = max/2/2;
  var num3 = max/2;
  var num4 = max/2/2*3;

  var labels = [
    Math.round(min),
    Math.round(num2),
    Math.round(num3),
    Math.round(num4),
    Math.round(max)
  ];

  var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

  var colorScale = d3.scaleThreshold()
      .domain([min,num2,num3,num4,max])
      .range(colorScheme);

  // Legend
  var g = svg.append("g")
      .attr("class", "legendThreshold")
      .attr("transform", "translate(20,20)");
  g.append("text")
      .attr("class", "caption")
      .attr("x", 0)
      .attr("y", -6)
      .text("Legend");
  // var labels = [min,num2,num3,num4,max];
  var legend = d3.legendColor()
      .labels(function (d) { return labels[d.i]; })
      .shapePadding(4)
      .scale(colorScheme);
  svg.select(".legendThreshold")
      .call(legend);
};

function init() {

  var colorScheme = d3.scaleQuantize()
  .range([
    "rgb(237,248,233)",
    "rgb(186,228,179)",
    "rgb(116,196,118)",
    "rgb(49,163,84)",
    "rgb(0,109,44)"
  ]);

  generateLegend(0,99,colorScheme);
};

window.onload = init;
