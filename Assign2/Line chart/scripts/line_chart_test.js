function init() {

	var dataset;

  // Load in CSV file
  d3.csv("../data/Australia Waste.csv").then(function(data){
		dataset = data;

		// Convert tonnes column from String to Int
    	dataset.forEach(function(d) { d.Tonnes = parseInt(d.Tonnes.replace(/,/g, ""))});
		// Convert years column from String to Date
    	dataset.forEach(function(d) { d.Year = new Date(+d.Year.substr(d.Year.length - 4), 0, 1)});
		lineChart(dataset);
	})
}

window.onload = init;
