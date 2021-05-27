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
  var RatioColorScheme = [ // Blues
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

  // Get the value of Year dropdown dynamically.
  document.getElementById("year").addEventListener('change', function() {
    yearSelected = document.getElementById("year").value;
    updateVariables();
    d3.selectAll(".vis").remove(); // Remove old visualisation
    updateVisualisations(); // update visualisations on user input
  });

  // Drop down menu behavior
  document.getElementById("viz_data").addEventListener('change', function() {
    updateVariables();
    d3.selectAll(".vis").remove(); // Remove old visualisation
    updateVisualisations(); // upadte visualisations on user input
  });

  // Initial generation of visualisation
  updateVisualisations();
};

window.onload = init;
