function init() {

  // var dataString = "./data/global_vis_data.csv"; // Path to data source
  var dataString = "./data/global_vis_data - real waste data and ratio.csv";
  var dataVisSelected = "GDP"; // Default data for visualisation
  var minYear = 1960, maxYear = 2017; // Declare min/max years from dataset
  var yearSelected = 2017; // Set default selected year
  var vis_footnote_text = "GDP (USD 2010) per Country for 2017"; // Text for data visualtisation footnote
  d3.select("#vis_footnote").text(vis_footnote_text); // Default

  // Define colour schemes
  var GdpColorScheme = [ // Greens
    "rgb(237,248,233)",
    "rgb(186,228,179)",
    "rgb(116,196,118)",
    "rgb(49,163,84)",
    "rgb(0,109,44)"
  ];
  var WasteColorScheme = [ // Oranges
    "rgb(254,237,222)",
    "rgb(253,190,133)",
    "rgb(253,141,60)",
    "rgb(230,85,13)",
    "rgb(166,54,3)"
  ];
  var RatioColorScheme = [ //Bluess
    "rgb(239,243,255)",
    "rgb(189,215,231)",
    "rgb(107,174,214)",
    "rgb(49,130,189)",
    "rgb(8,81,156)"
  ];

  // Default colour scheme
  var colourScheme = GdpColorScheme;

  // Reusable funtion to update the variables outlined above
  var updateVariables = function(){
    dataVisSelected = document.getElementById("viz_data").value;
    if(dataVisSelected == "GDP"){
      colourScheme = GdpColorScheme;
      vis_footnote_text = "GDP (USD 2010) per Country for " + yearSelected;
    } else if (dataVisSelected == "Waste"){
      colourScheme = WasteColorScheme;
      vis_footnote_text = "Waste output (Tonnes) per Country for " + yearSelected;
    } else if (dataVisSelected == "Ratio"){
      colourScheme = RatioColorScheme;
      vis_footnote_text = "Ratio of Gross Domestic Product (USD 2010) vs. Waste Output (Tonnes) for " + yearSelected;
    }
    d3.select("#vis_footnote").text(vis_footnote_text);
  };

  var updateVisualisations = function(){
    generateMap(dataString, colourScheme, yearSelected);
  };

  // Set up slider and its functionality
  var slider = d3.sliderHorizontal()
  .min(minYear)
  .max(maxYear)
  .step(1)
  .width(600)
  .tickFormat(d3.format("d"))
  .default(yearSelected)
  .displayValue(true)
  .on('onchange', val => {
    yearSelected = val;
    updateVariables();
    d3.selectAll(".vis").remove(); // Remove old visualisation
    updateVisualisations(); // update visualisations on slider update
  });
  var g = d3.select("#slider").append("svg")
  .attr("width", 700)
  .attr("height", 120)
  .append("g")
  .attr("transform", "translate(30,30)")
  .call(slider);

  // Drop down menu behavior
  document.getElementById("viz_data").addEventListener('change', function() {
    updateVariables();
    d3.selectAll(".vis").remove(); // Remove old visualisation
    updateVisualisations(); // upadte visualisations on slider update
  });

  // Initial generation of visualisation
  updateVisualisations();
};

window.onload = init;
