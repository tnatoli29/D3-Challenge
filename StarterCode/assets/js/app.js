// @TODO: YOUR CODE HERE!
// Set up SVG size
var svgWidth = 960;
var svgHeight = 500;

// Set the margins which is the space between the edge of the page and the SVG
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

//Set the new set height and width of the SVG
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initial Params
var chosenXAxis = "age";
var chosenYAxis = "smokers";

// Import Data
d3.csv("./assets/data/data.csv").then(function(overallData){
    console.log(overallData);

  // Parse Data/Cast as numbers
   overallData.forEach(function(data) {
    data.poverty    = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age        = +data.age;
    data.smokes     = +data.smokes;
    data.obesity    = +data.obesity;
    data.income     = +data.income;
  });




});
