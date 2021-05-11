function init(){
    var w = 700;
    var h = 500;
    var padding = 20;
    var sortOrder = false;
    var dataset = [];
    var allYears;
    var allWaste;
    var dataYear = [];
    var dataCategory = [];
    var dataState = [];
    var dataTonnes = [];
    var xScale;
    var yScale;

    
    var svg = d3.select("#chart")
      .append("svg")
      .attr("width", w + 80)
      .attr("height", h + 80)
      .attr("transform", "translate(" + padding + "," + 80 + ")");
    
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

      xScale = d3.scaleBand()
        .domain(["ACT","NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"])
        .range([0, w])
        .paddingInner(0.05);

      yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function(d){ return d.Tonnes})])
        .range([h, 0]);

     svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
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

      var xAxis = d3.axisBottom().ticks(5).scale(xScale);
      var yAxis = d3.axisLeft().scale(yScale);

      // Adding X and Y axis.
      svg.append("g").attr("transform", "translate(100, "+ (h - 10) +")").call(xAxis);
      svg.append("g").attr("transform", "translate(" + 100 + ", -10)").call(yAxis); 
    

    // Hover effects and tooltips
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

    // Sort from biggest to smallest
    var sortBars = function(){
        sortOrder = !sortOrder;
  
        svg.selectAll("rect")
        .sort(function(a,b){
          if(sortOrder){
          return d3.ascending(a,b);}
          else {
            return d3.descending(a,b);
          }
        })
        .transition()
        .duration(500)
        .attr("x", function(d,i){
          return xScale(i);
        });
      };


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

    d3.select("#btnSort").on("click", function(){
        sortBars();
    });
  });
}

window.onload = init;