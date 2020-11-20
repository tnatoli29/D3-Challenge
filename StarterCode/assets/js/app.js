// @TODO: YOUR CODE HERE!
// Set up SVG size
var svgWidth = 960;
var svgHeight = 500;

// Set the margins which is the space between the edge of the page and the SVG
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
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

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(overallData, chosenXAxis) {
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(overallData, d => d[chosenXAxis]) * 0.8,
      d3.max(overallData, d => d[chosenXAxis]) * 1.1])
    .range([0, width]);
  return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}

// Function used for updating y-scale var upon click on axis label.
function yScale(overallData, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(overallData, d => d[chosenYAxis]) * .8,
            d3.max(overallData, d => d[chosenYAxis]) * 1.1])
        .range([height, 0]);
    return yLinearScale;
}

// Function used for updating yAxis var upon click on axis label.
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
       .duration(1000)
       .call(leftAxis);
    return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}

// Function used for updating text in circles group with a transition to new text.
function renderText(circleTextGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circleTextGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
    return circleTextGroup;
}


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

   // xLinearScale function above csv import
  var xLinearScale = xScale(overallData, chosenXAxis);

   // Create y scale function
  var yLinearScale = yScale(overallData, chosenYAxis, height);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
 var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    //.attr("transform", `translate(0, - ${height})`)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(overallData)
  // Bind data
  var elemEnter = circlesGroup.enter();

  var circle = elemEnter.append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 13)
    .classed("stateCircle", true)

  // Create circle text.
  var circleText = elemEnter.append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("dy", ".35em")
    .text(d => d.abbr)
    .classed("stateText", true);

  // Create group for x-axis labels
  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 10)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 30)
    .attr("value", "age")
    .classed("inactive", true)
    .text("Age (Median)");

  var houseLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 50)
    .attr("value", "income")
    .classed("inactive", true)
    .text("Household Income (Median)");

  // Add y labels group and labels.
  var yLabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var healthcareLabel = yLabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 60 - margin.left)
    .attr("value", "healthcare")
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  var smokesLabel = yLabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 40 - margin.left)
    .attr("value", "smokes")
    .classed("inactive", true)
    .text("Smokes (%)");

  var obeseLabel = yLabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 20 - margin.left)
    .attr("value", "obesity")
    .classed("inactive", true)
    .text("Obese (%)");



// x axis labels event listener
  xLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");


        // replaces chosenXAxis with value
        chosenXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(overallData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          houseLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "age"){
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          houseLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          houseLabel
            .classed("active", true)
            .classed("inactive", false)
        }
      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

      // Update circles text with new values.
      circleText = renderText(circleText, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
   });

// y axis labels event listener
  yLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      value = d3.select(this).attr("value");

          // replaces chosenYAxis with value
          chosenYAxis = value;

          // functions here found above csv import
          // updates y scale for new data
          yLinearScale = yScale(overallData, chosenYAxis, height);

          // updates y axis with transition
          yAxis = renderYAxes(yLinearScale, yAxis);

        // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "smokes"){
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", true)
            .classed("inactive", false)
        }
      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);

      // Update circles text with new values.
      circleText = renderText(circleText, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
    });

}).catch(function(error) {
  console.log(error);
});

