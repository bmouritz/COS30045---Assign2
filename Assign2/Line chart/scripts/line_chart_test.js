function init() {

	var dataset;

	// read in csv and pass data to lineChart function
	d3.csv("data/line_chart_data.csv", function(d) {
		return {
			// year: new Date(+d.year),
			year: new Date(+d.year, +d.month - 1),
			tonnes: +d.tonnes,
			billions: +d.billions
		};
	}).then(function(data){
		dataset = data;
		lineChart(dataset);
	})
}

window.onload = init;
