// add new agg value of tonnes based on filters.
    //  Needs to return all 4 columns not just key/value
// Create agg for all waste by year
// Create agg for all year by waste
// Fix format of hover
// Fix y scale amounts

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

    // Derived metric - Sums the amount of waste regardless of Year and Waste Type
    rollup = d3.nest()
      .key(function(d) { return d.Jurisdiction; })
      .rollup(function(v) { return d3.sum(v, function(d) { return d.Tonnes; }); })
      .entries(dataset);

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
        // Check both dropdowns, if both on All use derived dataset
        if (yearSelected == "All" && wasteSelected == "All"){
          d3.selectAll("svg > *").remove();
      
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
              return xScale(d.key) + 100;
            })
            .attr("y", function(d) {
              return yScale(d.value) - 10;
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) {
              return h - yScale(d.value);
            })
      
          var xAxis = d3.axisBottom().ticks(5).scale(xScale);
          var yAxis = d3.axisLeft().scale(yScale);
      
          // Adding X and Y axis.
          svg.selectAll("#yaxis").remove();
          svg.selectAll("#xaxis").remove();
          svg.append("g").attr("id", "xaxis").attr("transform", "translate(100, "+ (h - 10) +")").call(xAxis);
          svg.append("g").attr("id", "yaxis").attr("transform", "translate(" + 100 + ", -10)").call(yAxis); 

          // Adding Y axis label
          svg.append("text")
            .attr("id", "ylabel")
            .attr("text-anchor", "middle")
            .attr("y", 0)
            .attr("x", -h / 2)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Tonnes of Waste");
      
          // Adding X axis label
          svg.append("text")
            .attr("id", "xlabel")
            .attr("text-anchor", "middle")
            .attr("x", 50 + w / 2)
            .attr("y", h + 25)
            .text("State");
      
          HoverOnDerived();
        } 
        // If not using any derived metrics just filter dataset
        else {
          d3.selectAll("svg > *").remove();
      
          xScale = d3.scaleBand()
            .domain(["ACT","NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"])
            .range([0, w])
            .paddingInner(0.05);
          
          // Filter dataset for yScale
          var filterDataset = dataset.filter(function(d) { return d.Category == wasteSelected, d.Year == yearSelected });

          // add filter to scale//
          yScale = d3.scaleLinear()
            .domain([0, d3.max(filterDataset, function(d){ return d.Tonnes})])
            .range([h, 0]);
      
          svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .filter(function(d) { return d.Category == wasteSelected })
            .attr("x", function(d) {
              return xScale(d.Jurisdiction) + 100;
            })
            .attr("y", function(d) {
              return yScale(d.Tonnes) - 10;
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) {
              return h - yScale(d.Tonnes);
            })

            svg.selectAll("rect")
            .filter(function(d) { return d.Year == yearSelected })
      
            var xAxis = d3.axisBottom().ticks(5).scale(xScale);
            var yAxis = d3.axisLeft().scale(yScale);
      
          // Adding X and Y axis.
          svg.selectAll("#yaxis").remove();
          svg.selectAll("#xaxis").remove();
          svg.append("g").attr("transform", "translate(100, "+ (h - 10) +")").call(xAxis);
          svg.append("g").attr("transform", "translate(" + 100 + ", -10)").call(yAxis); 
          
          svg.selectAll("g.y.axis")
          .call(yAxis);

          // Adding Y axis label
          svg.append("text")
            .attr("id", "ylabel")
            .attr("text-anchor", "middle")
            .attr("y", 0)
            .attr("x", -h / 2)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Tonnes of Waste");
      
          // Adding X axis label
          svg.append("text")
            .attr("id", "xlabel")
            .attr("text-anchor", "middle")
            .attr("x", 50 + w / 2)
            .attr("y", h + 25)
            .text("State");
      
          HoverOn();
        }
      }
      // Call draw all for onload to work
      drawAll();

      // Get the value of Year dropdown dynamically.
      document.getElementById("year").addEventListener('change', function() {
        yearSelected = this.value;
        drawAll();
      });

      // Get the value of Waste Type dropdown dynamically.
      document.getElementById("wasteType").addEventListener('change', function() {
        wasteSelected = this.value;
        drawAll();
    });
  });

  // Hover effects and tooltips for derived metrics
  var HoverOnDerived = function(){
    svg.selectAll("rect")
    .on("mouseover", function(d, i){
      var xPos = parseFloat(d3.select(this).attr("x")) + parseFloat(d3.select(this).attr("width"))/2 - 10;
      var yPos = parseFloat(d3.select(this).attr("y")) + 20;
            
      // Position the tooltip
      d3.select("#tooltip") 
        .style("left", xPos + "px") 
        .style("top", yPos + "px") 
        .select("#value") 
        .text(d.value); 

      // Position the tooltip
      d3.select("#tooltip") 
        .select("#state") 
        .text(d.key);
              
      //Show the tooltip 
      d3.select("#tooltip")
        .classed("hidden", false ); 
    }) 
    .on("mouseout", function () { 
      //Hide the tooltip 
      d3.select("#tooltip")
        .classed("hidden", true );
    });
  };

    // Hover effects and tooltips for non derived datasets
    var HoverOn = function(){
      svg.selectAll("rect")
      .on("mouseover", function(d, i){
        var xPos = parseFloat(d3.select(this).attr("x")) + parseFloat(d3.select(this).attr("width"))/2 - 10;
        var yPos = parseFloat(d3.select(this).attr("y")) + 20;
              
        // Position the tooltip
        d3.select("#tooltip") 
          .style("left", xPos + "px") 
          .style("top", yPos + "px") 
          .select("#value") 
          .text(d.Tonnes); 
  
        // Position the tooltip
        d3.select("#tooltip") 
          .select("#state") 
          .text(d.Jurisdiction);
                
        //Show the tooltip 
        d3.select("#tooltip")
          .classed("hidden", false ); 
      }) 
      .on("mouseout", function () { 
        //Hide the tooltip 
        d3.select("#tooltip")
          .classed("hidden", true );
      });
    };
};

window.onload = init;