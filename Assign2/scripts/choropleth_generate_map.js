function generateMap(dataString, countryColour, yearSelected) {

  // var w = 1350;
  var w = window.screen.width / 2;
  var h = 400;

  // Global geoMercator
  var projection = d3.geoMercator()
  .center([20, 20])
  .translate([w/2,h/2])
  .scale(120);

  var path = d3.geoPath()
    .projection(projection);

  // Select the map id
  var svg = d3.select("#map")
    .append("svg")
    .attr("class", "vis")
    .attr("width",w)
    .attr("height",h)
    .style("opacity", 0.8);

  //Load in Country data from csv
  d3.csv(dataString, (error, data) => {
    if (error) return console.error(error); // Throw error if csv not found

    // Get grouping of Year keys
    allYears = d3.map(data, function(d){return(d.Year)}).keys();

    // Populate dropdown dynamically with grouping of Year data
    d3.select("#year")
      .selectAll('myOptions')
      .data(allYears.sort().reverse())
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }); // corresponding value returned by the button

    //=========================== Data Manipulation =====================================
    data = data.filter(function(d) {
      return d.Year == yearSelected // filter the dataset down to the year selected by user
      && d.alpha_3_code.length == 3 // and remove aggregate amounts
    });

    // Reshape data to function more easily with following code
    dataVisSelected = document.getElementById("viz_data").value;
    if(dataVisSelected == "GDP"){
      data = data.map(function (d){
        return {
          Country: d.Country,
          alpha_3_code: d.alpha_3_code,
          Year: d.Year,
          AMOUNT: d.GDP_USD
        }
      });
    } else if (dataVisSelected == "Waste"){
      data = data.map(function (d){
        return {
          Country: d.Country,
          alpha_3_code: d.alpha_3_code,
          Year: d.Year,
          AMOUNT: d.Waste_Tonnes
        }
      });
    } else if (dataVisSelected == "Ratio"){
      data = data.map(function (d){
        return {
          Country: d.Country,
          alpha_3_code: d.alpha_3_code,
          Year: d.Year,
          AMOUNT: d.Ratio
        }
      });
    }
    // =============================================================================

    // Set min and max amounts dynamically
    var min = d3.min(data, function(d) { return parseInt(d.AMOUNT); });
    var max = d3.max(data, function(d) { return parseInt(d.AMOUNT); });

    //Load in GeoJSON data
    d3.json("./data/countries.geojson", (error, json) => {
      if (error) return console.error(error); // Throw error if GeoJSON not found

      // Merge the data with the GeoJSON
      // Loop through once for each AMOUNT data
      for (var i = 0; i < data.length; i++) {

        var dataCountry = data[i].Country; // Grab Country name from csv
        var dataISO = data[i].alpha_3_code.trim(); // Get ISO code from csv
        var dataAMOUNT = data[i].AMOUNT;

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

      //Set input domain for colour scale dynamically
      var countryColourQuantized = d3.scaleQuantize()
        .range(countryColour)
        .domain([min,max]);

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
          // Get top location of chart element
          var y = document.getElementById("map").getBoundingClientRect().top;

          // Getting data variables
          selected = event.properties.ADMIN;
          amount = event.properties.AMOUNT;

          // Set x,y of tooltip and set text of country
          d3.select("#tooltip")
            .style('left',  mouse[0] + `px`) // Use mouse x coordinates to draw text box offset by mox width
            .style("top", y + mouse[1] + window.scrollY - 80 + "px") // Use mouse y coordinates to draw text box offset 
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

          // Set data type of tooltip
          if(dataVisSelected == "GDP"){
            d3.select("#data_medium_pre").text("$");
            d3.select("#data_medium_post").text("");
          } else if (dataVisSelected == "Waste"){
            d3.select("#data_medium_pre").text("");
            d3.select("#data_medium_post").text(" Tonnes");
          } else if (dataVisSelected == "Ratio"){
            d3.select("#data_medium_pre").text("");
            d3.select("#data_medium_post").text(" : 1");
          }

          //Show the tooltip
          d3.select("#tooltip")
            .classed("hidden", false );
        })
        .style("fill", function(d) {
          var AMOUNT = d.properties.AMOUNT; //Get data AMOUNT
          if (AMOUNT) {
            return countryColourQuantized(AMOUNT); //If AMOUNT exists
          } else {
            return "#ccc"; //If AMOUNT is undefined
          }
        });
      });

    // Create the Legend and pass min, max and colour scheme
    generateLegend(min, max, countryColour);
    });
};
