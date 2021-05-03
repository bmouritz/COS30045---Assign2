function generateMap(dataString, countryColour) {

  var w = 1000;
  var h = 600;

  // Australia
  // var projection = d3.geoMercator()
  // .center([135, -26])
  // .translate([w/2,h/2])
  // .scale(600);

  // Europe
  // var projection = d3.geoMercator()
  // .center([13, 52])
  // .translate([w/2, h/2])
  // .scale([w/1.5]);

  // Global
  var projection = d3.geoMercator()
  .center([20, 20])
  .translate([w/2,h/2])
  .scale(150);

  // Australasia
  // var projection = d3.geoMercator()
  // .center([129, -21])
  // .translate([w/2, h/2])
  // .scale(w/2);

  var path = d3.geoPath()
  .projection(projection);

  var svg = d3.select("#chart")
  .append("svg")
  .attr("width",w)
  .attr("height",h)
  .style("opacity", 0.8);

  //Not yet working - keep chipping away at
  var legend = svg.selectAll('rect')
  .data(countryColour.domain().reverse())
  .enter()
  .append('rect')
  .attr("x", w - 780)
  .attr("y", function(d, i) {
    return i * 20;
  })
  .attr("width", 10)
  .attr("height", 10)
  .style("fill", countryColour);

  //Load in Country data from csv
  d3.csv(dataString, (error, data) => {
    if (error) return console.error(error); // Throw error if csv not found

    //Set input domain for colour scale dynamically
    countryColour.domain([
      d3.min(data, function(d) { return d.AMOUNT; }),
      d3.max(data, function(d) { return d.AMOUNT; })
    ]);

    //Load in GeoJSON data
    d3.json("./data/countries.geojson", (error, json) => {
      if (error) return console.error(error); // Throw error if GeoJSON not found

      // Merge the data with the GeoJSON
      // Loop through once for each AMOUNT data
      for (var i = 0; i < data.length; i++) {

        var dataCountry = data[i].Country; // Grab Country name from csv
        var dataISO = data[i].Alpha_3_code.trim(); // Get ISO code from csv
        var dataAMOUNT = data[i].AMOUNT; //Grab data AMOUNT from csv

        // Find the corresponding country inside the GeoJSON
        for (var j = 0; j < json.features.length; j++) {

          var jsonCountry = json.features[j].properties.ADMIN; // Grab Country name from json
          var jsonISO = json.features[j].properties.ISO_A3.trim(); // Grab ISO code from json

          if (jsonISO == dataISO) { // join where ISO 3 codes match
            json.features[j].properties.AMOUNT = dataAMOUNT; //Copy the data AMOUNT into the JSON
            break; //Stop looking through the json
          }
        }
      }

      //Bind data and create one path per GeoJSON feature
      svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "black")
      .style("stroke-width", 0.10)
      .attr("class", function(d){ return "Country" } )
      .on("mouseover",function(event, d){ // change to orange on mouse over
        d3.selectAll(".Country")
          .transition()
          .duration(100)
          .style("opacity", .5)
        d3.select(this)
          .transition()
          .duration(100)
          .style("opacity", 1)
          .style("stroke", "red")
          .style("stroke-width", 1)
    		})
    		.on("mouseout",function(event, d){ // change back on mouse out
          d3.selectAll(".Country")
            .transition()
            .duration(100)
            .style("opacity", 0.8)
            .style("stroke", "black")
            .style("stroke-width", 0.10)
          d3.select(this)
            .transition()
            .duration(100)
    		})

      .style("fill", function(d) {

        var AMOUNT = d.properties.AMOUNT; //Get data AMOUNT

        if (AMOUNT) {
          return countryColour(AMOUNT); //If AMOUNT exists
        } else {
          return "#ccc"; //If AMOUNT is undefined
        }
      });
    });
  });
}
