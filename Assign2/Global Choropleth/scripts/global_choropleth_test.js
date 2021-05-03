function init() {

	var colorGreen = d3.scaleQuantize()
  .range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);

	var colorOrange = d3.scaleQuantize()
  .range(["rgb(254,237,222)","rgb(253,190,133)","rgb(253,141,60)","rgb(230,85,13)","rgb(166,54,3)"]);
	// Set up page initially
	var toggle = false;
	d3.select("#toggBtn").text("Orange");
	generateMap("./data/aus_dummy_data1.csv", colorGreen,"orange");

	var changeData = function() {
		toggle = !toggle; // sets toggle
		if(toggle){
			d3.select("#chart").selectAll('svg').remove();
			d3.select("#toggBtn").text("Green");
			generateMap("./data/aus_dummy_data2.csv",colorOrange,"green");
		} else {
			d3.select("#chart").selectAll('svg').remove();
			d3.select("#toggBtn").text("Orange");
			generateMap("./data/aus_dummy_data1.csv",colorGreen,"orange");
		}
	};

	d3.select("#toggBtn") // Set up event listener for sort button
	.on("click", function() {
		changeData();
	})
}

window.onload = init;
