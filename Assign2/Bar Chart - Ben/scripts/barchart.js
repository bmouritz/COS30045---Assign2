function init(){
    var w = 700;
    var h = 500;
    var padding = 20;
    var sortOrder = false;
    var dataset = [0,1,2,3,4,5,6,7];
    var allYears;

    /*
    d3.csv("../data/Australia Waste.csv").then(function(data){
      allYears = d3.nest()
        .key(function(d) { return d.Year; })
        .entries(data);

      for (var i = 0; i < data.length; i++){
        var dataYears = data[i].Year;
        var category = data[i].Category;
        var ACT = data[i].ACT;
        var NSW = data[i].NSW;
        var NT = data[i].NT;
        var QLD = data[i].Qld;
        var SA = data[i].SA;
        var TAS = data[i].Tas;
        var VIC = data[i].Vic;
        var WA = data[i].WA;
      }
  });
*/
		var xScale = d3.scaleBand()
		  .domain(d3.range(dataset.length))
		  .rangeRound([0, w])
		  .paddingInner(0.5);

/*  var xScale = d3.scaleOrdinal()
    .domain(dataset)
    .range(['black', '#ccc', '#ccc']); */

	var yScale = d3.scaleLinear()
	  .domain([0, d3.max(dataset)])
	  .range([ h, 0]);



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
            .text(i); 
            
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

    var xAxis = d3.axisBottom().ticks(5).scale(xScale);
    var yAxis = d3.axisLeft().ticks(5).scale(yScale);

    var svg = d3.select("#chart")
      .append("svg")
      .attr("width", w + 80)
      .attr("height", h + 80)
      .attr("transform", "translate(" + padding + "," + 80 + ")");

    svg.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        return xScale(i) + 40;
      })
      .attr("y", function(d) {
        return yScale(d) - 10;
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) {
        return h - yScale(d);
    })

    // Adding X and Y axis.
    svg.append("g").attr("transform", "translate(40, "+ (h - 10) +")").call(xAxis);
    svg.append("g").attr("transform", "translate(" + 40 + ", -10)").call(yAxis);

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
}

window.onload = init;