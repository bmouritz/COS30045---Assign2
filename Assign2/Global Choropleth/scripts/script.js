// TO DO:
// 1) Finish slider and pass year value into generateMap function - DONE
// 2) Format legend and tooltip values - DONE
// 3) Add 'Tonnes of Waste' and 'ratio' to dataset
// 4) Make a dropdown to choose between different datasets
// OPTIONAL:
// 5) Change geoMercator
// 6) Add cities if geoMercator selected


function init() {

  var dataString = "./data/GDP.csv";
  var minYear = 1960, maxYear = 2017; // Declare min/max years from dataset
  var yearSelected = 2017; // Set default selected year

  var slider = d3.sliderHorizontal()
  .min(minYear)
  .max(maxYear)
  .step(1)
  .width(600)
  .tickFormat(d3.format("d"))
  .default(yearSelected)
  .displayValue(true)
  .on('onchange', val => {
    d3.selectAll(".vis").remove(); // Remove old visualisation
    updateVisualisations(dataString, val, colorScheme); // upadte visualisations on slider update
  });

  var g = d3.select("#slider").append("svg")
  .attr("width", 700)
  .attr("height", 100)
  .append("g")
  .attr("transform", "translate(30,30)")
  .call(slider);

  var colorScheme = d3.scaleQuantize()
  .range([
    "rgb(237,248,233)",
    "rgb(186,228,179)",
    "rgb(116,196,118)",
    "rgb(49,163,84)",
    "rgb(0,109,44)"
  ]);

  // Initial generation of visualisation
  updateVisualisations(dataString, yearSelected, colorScheme);
}

function updateVisualisations(dataString, yearSelected, colorScheme){
  d3.select("#title").text("GDP per Country for " + yearSelected);

  // Update map on slider value change
  generateMap(dataString, colorScheme, yearSelected);
}

window.onload = init;
