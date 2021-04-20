function generateMap(dataString, stateColour, cityColour) {

  var w = 500;
  var h = 500;

  var projection = d3.geoMercator()
  .center([135, -26])
  .translate([w/2,h/2])
  .scale(600);

  var path = d3.geoPath()
  .projection(projection);

  var svg = d3.select("#chart")
  .append("svg")
  .attr("width",w)
  .attr("height",h);

  //Not yet working - keep chipping away at
  var legend = svg.selectAll('rect')
      .data(stateColour.domain().reverse())
      .enter()
      .append('rect')
      .attr("x", w - 780)
      .attr("y", function(d, i) {
         return i * 20;
      })
     .attr("width", 10)
     .attr("height", 10)
     .style("fill", stateColour);

  //Load in STATE_NAME data
  d3.csv(dataString, function(data) {

    //Set input domain for color scale - NOT WORKING FOR SOME REASON
    // color.domain([
    // 	d3.min(data, function(d) { return d.AMOUNT; }),
    // 	d3.max(data, function(d) { return d.AMOUNT; })
    // ]);

    stateColour.domain([0,25]); //Need to figure out how to do this dynamically, like above.

    //Load in GeoJSON data
    d3.json("./data/au-states.geojson", function(json) {

      // Merge the unemployment data and GeoJSON
      // Loop through once for each unemployment data AMOUNT
      for (var i = 0; i < data.length; i++) {

        // Grab STATE_NAME name
        var dataState = data[i].STATE_NAME;

        //Grab data AMOUNT, and convert from string to float
        var dataAMOUNT = data[i].AMOUNT;

        //Find the corresponding state inside the GeoJSON
        for (var j = 0; j < json.features.length; j++) {

          var jsonState = json.features[j].properties.STATE_NAME;

          if (dataState == jsonState) {

            //Copy the data AMOUNT into the JSON
            json.features[j].properties.AMOUNT = dataAMOUNT;

            //Stop looking through the JSON
            break;
          }
        }
      }

      //Bind data and create one path per GeoJSON feature
      svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", function(d) {
        //Get data AMOUNT
        var AMOUNT = d.properties.AMOUNT;

        if (AMOUNT) {
          //If AMOUNT exists…
          return stateColour(AMOUNT);
        } else {
          //If AMOUNT is undefined…
          return "#ccc";
        }
      });

      //Load in cities data
      d3.csv("./data/Aus_city_data.csv", function(data) {
        svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
          return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
          return projection([d.lon, d.lat])[1];
        })
        .attr("r", 3)
        .style("fill", cityColour)
        .style("stroke", "black")
        .style("stroke-width", 1);
      });
    });
  });
}
