function init(){
  var w = 700;
  var h = 500;
  var padding = 20;
  var dataset = [];
  var allYears;
  var allWaste;
  var xScale;
  var yScale;
  var yearSelected = document.getElementById("year").value;
  var wasteSelected = document.getElementById("wasteType").value;
  var rollup;
  var colour = "blue";

  var svg = d3.select("#chart")
    .append("svg")
    .attr("width", w + 80)
    .attr("height", h + 80)
    .attr("transform", "translate(" + padding + "," + 80 + ")");
    
  // Load in CSV file
  d3.csv("../data/Australia Waste.csv").then(function(data){
    dataset = data;

    // Convert tonnes column from String to Int
    dataset.forEach(function(d) { d.Tonnes = parseInt(d.Tonnes.replace(/,/g, ""))});
      
    // Get grouping of Year keys
    allYears = d3.map(data, function(d){return(d.Year)}).keys();

    // Get grouping of Jurisdiction keys
    allWaste = d3.map(data, function(d){return(d.Category)}).keys();

    // Populate dropdown dynamically with grouping of Year data
    d3.select("#year")
      .selectAll('myOptions')
      .data(allYears.sort().reverse())
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // Populate dropdown dynamically with grouping of Waste data
    d3.select("#wasteType")
      .selectAll('myOptions')
      .data(allWaste.sort())
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button
    
    // function to draw the visuals
    var drawAll = function(){
      d3.selectAll("svg > *").remove();
        // Check both dropdowns, if both on All use derived dataset
        if (yearSelected == "All" && wasteSelected == "All"){
          // Derived metric - Sums the amount of waste regardless of Year and Waste Type
          rollup = d3.nest()
            .key(function(d) { return d.Jurisdiction; })
            .rollup(function(v) { return d3.sum(v, function(d) { return d.Tonnes; }); })
            .entries(dataset);
        }

        // Check if Year selected is All
        else if (yearSelected == "All" && wasteSelected != "All"){
          // Filter data to only the waste category
          var filteredData = dataset.filter(function(d) 
          {   
            if( d.Category == wasteSelected)
            { 
              return d;
            } 
          });
          rollup = d3.nest()
            .key(function(d) { return d.Jurisdiction; })
            .rollup(function(v) { return d3.sum(v, function(d) { return d.Tonnes; }); })
            .entries(filteredData);
        }

        // Check if Year selected is All
        else if (yearSelected != "All" && wasteSelected == "All"){
          // Filter data to only the year
          var filteredData = dataset.filter(function(d) 
          {   
            if( d.Year == yearSelected)
            { 
              return d;
            } 
          });          
          rollup = d3.nest()
            .key(function(d) { return d.Jurisdiction; })
            .rollup(function(v) { return d3.sum(v, function(d) { return d.Tonnes; }); })
            .entries(filteredData);
        }

        // Check both dropdowns aren't All
        else if (yearSelected != "All" && wasteSelected != "All"){
          // Filter the data to both year and waste type
          var filteredData = dataset.filter(function(d) 
          {   
            if( (d.Year == yearSelected) && (d.Category == wasteSelected))
            { 
              return d;
            } 
          });
          rollup = d3.nest()
            .key(function(d) { return d.Jurisdiction; })
            .rollup(function(v) { return d3.sum(v, function(d) { return d.Tonnes; }); })
            .entries(filteredData);
        }
          xScale = d3.scaleBand()
            .domain(["ACT","NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"])
            .range([0, w])
            .paddingInner(0.05);
      
          yScale = d3.scaleLinear()
            .domain([0, d3.max(rollup, function(d){ return d.value})])
            .range([h, 0]);
      
          svg.selectAll("rect")
            .data(rollup)
            .enter()
            .append("rect")
            .attr("x", function(d) {
              return xScale(d.key) + 60;
            })
            .attr("y", function(d) {
              return yScale(d.value);
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) {
              return h - yScale(d.value);
            })
      
          var xAxis = d3.axisBottom().ticks(5).scale(xScale);
          var yAxis = d3.axisLeft().scale(yScale).ticks(5).tickFormat(d3.format(".0s")); // Format y scale in million
      
          // Adding X and Y axis.
          svg.selectAll("#yaxis").remove();
          svg.selectAll("#xaxis").remove();
          svg.append("g").attr("id", "xaxis").attr("transform", "translate(60, "+ (h) +")").call(xAxis);
          svg.append("g").attr("id", "yaxis").attr("transform", "translate(" + 60 + ", 0)").call(yAxis); 

          // Adding Y axis label
          svg.append("text")
            .attr("id", "ylabel")
            .attr("text-anchor", "middle")
            .attr("y", 0)
            .attr("x", -h / 2)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Tonnes of Waste (M)");
      
          // Adding X axis label
          svg.append("text")
            .attr("id", "xlabel")
            .attr("text-anchor", "middle")
            .attr("x", 50 + w / 2)
            .attr("y", h + 35)
            .text("State");

          d3.select("#wastetitle")
            .text(wasteSelected.toLowerCase());
          
            d3.select("#yeartitle")
            .text(yearSelected.toLowerCase());
          HoverOn();
        }
      
      // Call draw all for onload to work
      drawAll();

      // Get the value of Year dropdown dynamically.
      document.getElementById("year").addEventListener('change', function() {
        wasteSelected = document.getElementById("wasteType").value;
        yearSelected = document.getElementById("year").value;
        drawAll();
      });

      // Get the value of Waste Type dropdown dynamically.
      document.getElementById("wasteType").addEventListener('change', function() {
        wasteSelected = document.getElementById("wasteType").value;
        yearSelected = document.getElementById("year").value;
        if(wasteSelected == "Ash"){
          colour = "black";
        } else if (wasteSelected == "Biosolids"){
          colour = "yellow";
        } else if (wasteSelected == "Glass"){
          colour = "aqua";
        } else if (wasteSelected == "Hazardous"){
          colour = "green";
        } else if (wasteSelected == "Masonry materials"){
          colour = "lightgray";
        } else if (wasteSelected == "Metals"){
          colour = "SlateBlue";
        } else if (wasteSelected == "Mining"){
          colour = "DarkGoldenRod";
        } else if (wasteSelected == "Organics"){
          colour = "DarkOliveGreen";
        } else if (wasteSelected == "Other"){
          colour = "Purple";
        } else if (wasteSelected == "Paper & cardboard"){
          colour = "PaleVioletRed";
        } else if (wasteSelected == "Plastics"){
          colour = "Salmon";
        } else {
          colour = "OrangeRed";
        }
        drawAll();
    });
  });

  // Hover effects and tooltips for derived metrics
  var HoverOn = function(){
    svg.selectAll("rect")
      .on("mouseover", function(d){
      var xPos = parseFloat(d3.select(this).attr("x")) + parseFloat(d3.select(this).attr("width"))/2 - 10;
      var yPos = parseFloat(d3.select(this).attr("y")) + 20;
            
      var formatComma = d3.format(",");
      d3.select(this).style("opacity", 1);
      // Position the tooltip
      d3.select("#tooltip")
        .style("left", xPos + "px")
        .style("top", yPos + "px")
        .select("#value")
        .text(function() { return formatComma(d.value); }); // add commas to tooltip value

      // Position the tooltip
      d3.select("#tooltip") 
        .select("#state") 
        .text(d.key);
              
      //Show the tooltip 
      d3.select("#tooltip")
        .classed("hidden", false ); 
    }).style("fill", colour).style("opacity", 0.6)
    .on("mouseout", function () { 
      d3.select(this).style("opacity", 0.6);
      //Hide the tooltip 
      d3.select("#tooltip")
        .classed("hidden", true );
    });
  };
};

window.onload = init;