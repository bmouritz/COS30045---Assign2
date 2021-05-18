function generateMap(dataString, countryColour, yearSelected) {

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


  var svg = d3.select("#map")
    .append("svg")
    .attr("class", "vis")
    .attr("width",w)
    .attr("height",h)
    .style("opacity", 0.8);

  //Load in Country data from csv
  d3.csv(dataString, (error, data) => {
    if (error) return console.error(error); // Throw error if csv not found

    data = data.filter(function(d) {
      return d.Year == yearSelected // filter the dataset down to the year selected by slider
      && d.Alpha_3_code.length == 3; // and remove aggregate amounts
    });

    // Set min and max amounts dynamically
    var min = d3.min(data, function(d) { return parseInt(d.AMOUNT); });
    var max = d3.max(data, function(d) { return parseInt(d.AMOUNT); });

    console.log(min);
    console.log(max);

    //Set input domain for colour scale dynamically
    countryColour.domain([min,max]);

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
        .on("mouseover",function(event, d){ // change to red border on mouse over
          d3.selectAll(".Country")
        .style("opacity", .5)
          d3.select(this)
          .style("opacity", 1)
          .style("stroke", "red")
          .style("stroke-width", 1);
        })
        .on("mouseout",function(event, d){ // change back on mouse out
          d3.selectAll(".Country")
            .style("opacity", 0.8)
            .style("stroke", "black")
            .style("stroke-width", 0.10);

          //Hide the tooltip
          d3.select("#tooltip")
            .classed("hidden", true );
        })
        .on("click",function(event, d){ // on click tooltip
          var mouse = d3.mouse(this); // Create mouse object

          // Getting data variables
          selected = event.properties.ADMIN;
          amount = event.properties.AMOUNT;

          // Set x,y of tooltip and set text of country
          d3.select("#tooltip")
            .style('left', mouse[0] + `px`) // Use mouse x coordinates to draw text box
            .style('top', (mouse[1] + 20) + `px`) // Use mouse y coordinates to draw text box
            .select("#country")
            .text(selected);

          // Set text of the year
          d3.select("#tooltip")
            .select("#year")
            .text(yearSelected);

          // Set text of the amount
          var f = d3.format("0.2s"); // Set up formatting for amount
          if (amount) {
          d3.select("#tooltip")
            .select("#value")
            .text(f(amount).replace(/G/,"B")); // Use formatting in tooltip
          } else {
          d3.select("#tooltip")
            .select("#value")
            .text('N/A'); // Set to N/A if no amount in data
          }

          //Show the tooltip
          d3.select("#tooltip")
            .classed("hidden", false );
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

      // Create the Legend and pass min, max and colour scheme
      generateLegend(min, max, countryColour);
    });
};
