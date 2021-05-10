function init(){
    var w = 700;
    var h = 500;
    var padding = 20;
    var dataset = [5,6,7,8,9,10,11,12,13,14,15, 7];
    var sortOrder = false;

		var xScale = d3.scaleBand()
		  .domain(d3.range(dataset.length))
		  .rangeRound([0, w])
		  .paddingInner(0.5);

		var yScale = d3.scaleLinear()
		  .domain([0, d3.max(dataset)])
		  .range([ h, 0]);

    // Hover effects and tooltips
    var HoverOn = function(){
        svg.selectAll("rect")
        .on("mouseover", function(d, i){
          var xPos = parseFloat(d3.select(this).attr("x")) + parseFloat(d3.select(this).attr("width"))/2 - 10;
          var yPos = parseFloat(d3.select(this).attr("y")) + 20;

          d3.select("#tooltip") 
            .style("left", xPos + "px") 
            .style("top", yPos + "px") 
            .select("#value") 
            .text(i ); 
            
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
      .attr("width", w + padding)
      .attr("height", h + padding + 10)
      .attr("transform", "translate(" + padding + "," + padding + ")");

    svg.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        return xScale(i) + 20;
      })
      .attr("y", function(d) {
        return yScale(d) + 10;
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) {
        return h - yScale(d);
    })

    svg.append("g").attr("transform", "translate(20, "+ (h + 10) +")").call(xAxis);
    svg.append("g").attr("transform", "translate(" + 20 + ", 10)").call(yAxis);

    HoverOn();

    d3.select("#btnSort").on("click", function(){
        sortBars();
    });
}

window.onload = init;