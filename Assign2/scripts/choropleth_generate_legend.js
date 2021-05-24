function generateLegend(min, max, colorScheme){

  var w = 100;
  var h = 120;

  var num2 = max * 0.25; // 25% value
  var num3 = max * 0.5;  // 50% value
  var num4 = max * 0.75; // 75% value

  // Set up formatting for labels
  var format = d3.format("0.2s"); // Default
  var legendLabel = "GDP ($US)"; // Default
  var dataVisSelected = document.getElementById("viz_data").value;

  // sets variables to 0 if no data in dataset
  var isDataMissing = function(){
    min = 0;
    num2 = 0;
    num3 = 0;
    num4 = 0;
    max = 0;
  }

  // Sets dynamic labels and formats if the data exists
  if(dataVisSelected == "GDP"){
    legendLabel = "GDP ($US)";
    if(max) {
      format = d3.format("0.2s");
    } else {
      isDataMissing();
      format = d3.format("");
    }
  } else if (dataVisSelected == "Waste"){
    legendLabel = "Waste (Tonnes)";
    if(max) {
      format = d3.format("0.2s");
    } else {
      isDataMissing();
      format = d3.format("");
    }
  } else if (dataVisSelected == "Ratio"){
    legendLabel = "Ratio ($ vs W)";
    if(max) {
      format = d3.format("0.2s");
    } else {
      isDataMissing();
      format = d3.format("");
    }
  }

  // Use the above defined format to formate the legend's labals
  var labels = [
    format(Math.round(min)).replace(/G/,"B"),
    format(Math.round(num2)).replace(/G/,"B"),
    format(Math.round(num3)).replace(/G/,"B"),
    format(Math.round(num4)).replace(/G/,"B"),
    format(Math.round(max)).replace(/G/,"B")
  ];

  var svg = d3.select("#legend")
    .append("svg")
    .attr("class", "vis")
    .attr("width",w)
    .attr("height",h);

  var countryColourQuantized = d3.scaleQuantize().range(colorScheme).domain([min,max]);

    var colorScale = d3.scaleQuantize()
        .domain([min,max])
        .range(colorScheme);

  var g = svg.append("g")
      .attr("class", "legendThreshold")
      .attr("transform", "translate(5,20)");

  g.append("text")
      .attr("class", "caption")
      .attr("x", 0)
      .attr("y", -6)
      .style("font-weight","bold")
      .text(legendLabel); // Set dynamically

  var legend = d3.legendColor()
      .labels(function (d) { return labels[d.i]; })
      .shapePadding(4)
      .scale(countryColourQuantized);

  svg.select(".legendThreshold")
      .call(legend);
};
