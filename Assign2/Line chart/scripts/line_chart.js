function init() {

	var dataset;
	var dataset1;

  // Load in CSV file
  d3.csv("../data/Australia Waste.csv").then(function(data){
		dataset = data;

		// Convert tonnes column from String to Int
    	dataset.forEach(function(d) { d.Tonnes = parseInt(d.Tonnes.replace(/,/g, ""))});
		// Convert years column from String to Date
    	dataset.forEach(function(d) { d.Year = new Date(+d.Year.substr(d.Year.length - 4), 0, 1)});

		// Load in second CSV file
		  d3.csv("../data/5220001_Annual_Gross_State_Product_All_States.csv").then(function(data1){
			dataset1 = data1;

			// Convert amount column from String to Int
    		dataset1.forEach(function(d) { d.Amount = parseInt(d.Amount.replace(/,/g, ""))});

			// Convert years column from String to Date
    		dataset1.forEach(function(d) { d.Year = new Date(+d.Year.substr(d.Year.length - 4), 0, 1)});

			lineChart(dataset, dataset1);
		})
		
	})
}

window.onload = init;
