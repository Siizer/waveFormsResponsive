// polarChart.js
export function createPolarChart(elementId, width, height, rScale, rvScale, radius) {
  let svgPolar = d3
    .select(elementId)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("id", "appendedPolar")
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // Get tick values for both scales.
  // (Assumes MAX_yScale_I and MAX_yScale_V are defined elsewhere.)
  let ticksI = rScale.ticks(5).slice(1);
  if (!ticksI.includes(MAX_yScale_I)) {
    ticksI.push(MAX_yScale_I);
  }
  let ticksV = rvScale.ticks(5).slice(1);
  if (!ticksV.includes(MAX_yScale_V)) {
    ticksV.push(MAX_yScale_V);
  }

  // Draw grid circles and labels for currents.
  let gr = svgPolar
    .append("g")
    .attr("class", "r axis")
    .attr("id", "grAxis")
    .selectAll("g")
    .data(ticksI)
    .enter()
    .append("g");

  gr.append("circle")
    // Normalize tick value relative to the maximum so the outer circle equals `radius`
    .attr("r", (d) => (d / MAX_yScale_I) * radius)
    .style('stroke','rgba(250,255,200,0.5)')
    .style("stroke-width", d => (d === MAX_yScale_I ? "2px" : "0.5px"))
    .style("stroke-dasharray", d => (d === MAX_yScale_I ? "none" : "1,4"));

  gr.append("text")
    .attr("y", (d) => -((d / MAX_yScale_I) * radius))
    .attr("transform", "rotate(15)")
    .style("text-anchor", "middle")
    .style('stroke','grey')
    .text((d) => d.toFixed(0));

  // Draw grid circles and labels for voltages.
  let grv = svgPolar
    .append("g")
    .attr("class", "r axis")
    .attr("id", "grvAxis")
    .selectAll("g")
    .data(ticksV)
    .enter()
    .append("g");

  grv.append("circle")
    .attr("r", (d) => (d / MAX_yScale_V) * radius)
    .style('stroke','rgba(250,255,200,0.5)')
    .style("stroke-dasharray", d => (d === MAX_yScale_I ? "none" : "1,4"));

  grv.append("text")
    .attr("y", (d) => -((d / MAX_yScale_V) * radius))
    .attr("transform", "rotate(-15)")
    .style("text-anchor", "middle")
    .style('stroke','grey')
    .text((d) => d.toFixed(0));

  // Draw radial lines with angle labels.
  let ga = svgPolar
    .append("g")
    .attr("class", "a axis")
    .selectAll("g")
    .data(d3.range(0, 360, 30))
    .enter()
    .append("g")
    .style("stroke", "white")
    .style("stroke-dasharray", "1,4")
    .attr("transform", (d) => "rotate(" + -d + ")");

  ga.append("line").attr("x2", radius);

  ga.append("text")
    .attr("x", (d) => (d < 270 && d > 90 ? radius : radius + 10))
    .attr("dy", "0.5rem")
    .attr("transform", (d) =>
      d < 270 && d > 90 ? "rotate(180 " + radius + ",0)" : null
    )
    .style("text-anchor", (d) => (d < 270 && d > 90 ? "end" : null))
    .attr("stroke", "#777")
    .style("stroke-dasharray", "none")
    .text((d) => d + "°");

  return svgPolar;
}


export function updateInfo(div, text, value) {
  // Convert div to a D3 selection if it's not already
  var d3div = d3.select(div);
  
  // Clear existing text
  div.select("#infoTimeStamp").remove();

  // Append new text
  div.append("text")
    .text(text + " = " + value)
    .attr("id", "infoTimeStamp");
}
