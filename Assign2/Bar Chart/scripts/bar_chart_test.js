function init() {

	//Width and height
	var w = 600;
	var h = 250;

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

	// set the ranges
	var x = d3.scaleBand()
	.range([0, w])
	.padding(0.1);
	var y = d3.scaleLinear()
	.range([h, 0]);

	var svg = d3.select("#chart")
	.append("svg")
	.attr("width", w + margin.left + margin.right)
	.attr("height", h + margin.top + margin.bottom)
	.append("g")
	.attr("transform","translate(" + margin.left + "," + margin.top + ")");

	// get the data
	d3.csv("data/aus_dummy_data1.csv", function(data) {

		console.log(data.AMOUNT);

		// Scale the range of the data in the domains
		var xScale = d3.scaleBand()
		.domain(d3.range(data.length))
		.range([0, w])
		.paddingInner(0.05);

		var yScale = d3.scaleLinear()
		.domain([0,data.length])
		.range([0, h]);

		// append the rectangles for the bar chart
		svg.selectAll("bar")
		.data(data)
		.enter()
		.append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return x(d.AMOUNT); })
		.attr("width", x.bandwidth())
		.attr("y", function(d) { return y(d.AMOUNT); })
		.attr("height", function(d) { return h - y(d.AMOUNT); });

		// add the x Axis
		svg.append("g")
		.attr("transform", "translate(0," + h + ")")
		.call(d3.axisBottom(x));

		// add the y Axis
		svg.append("g")
		.call(d3.axisLeft(y));

	});

	// d3.select("#toggBtn") // Set up event listener for sort button
	// .on("click", function() {
	// 	changeData();
	// })
}

window.onload = init;
