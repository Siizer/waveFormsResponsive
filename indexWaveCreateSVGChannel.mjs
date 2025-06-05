import * as W_ from "./indexWaveAid.mjs"; // Assuming you have your waveforms code here

export function createSVG(svgContainer, id, dataset, MAX, text_X, text_Y) {
  // 1) INITIAL DIMENSIONS
  let localWidth = svgContainer.node().getBoundingClientRect().width;
  let localHeight = svgContainer.node().getBoundingClientRect().height;

  // Basic margins; can adjust as needed
   margin = { top: 10, right: 15, bottom: 15, left: 50 };
  let plotWidth = localWidth - margin.left - margin.right;
  let plotHeight = localHeight - margin.top - margin.bottom;

  // 2) CREATE THE SVG + GROUP
  const svgRoot = svgContainer
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    // Keep aspect ratio pinned at top-left; you can also use "xMidYMid" if needed
    .attr("preserveAspectRatio", "xMinYMin meet")
    // The viewBox matches the initial localWidth/localHeight
    .attr("viewBox", `0 0 ${localWidth} ${localHeight}`)
    .attr("id", id + "_svg");

  // The main group is offset by the margin
  const gMain = svgRoot
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 3) SCALES
  // We'll store them as local variables, not globally
   xScale = d3.scaleLinear().domain([0, numsample]).range([0, plotWidth]);


  // For #svg1, we have dual scales. Otherwise, a single scale
  if (id === "svg1") {
    yScale = d3
      .scaleLinear()
      .domain([-MAX.I, MAX.I])
      .range([plotHeight, 0]);
    yScaleI = d3
    .scaleLinear()
    .domain([-MAX.I, MAX.I])
    .range([plotHeight, 0]); 
    yScaleRight = d3
      .scaleLinear()
      .domain([-MAX.V, MAX.V])
      .range([plotHeight, 0]);
      yAxisI = d3.axisLeft(yScaleI).ticks(5).tickFormat(d => d + "A");
      yAxisRight = d3.axisRight(yScaleRight).ticks(5).tickFormat(d => d + "V");
  } else {
    if (id === 'svg3')
    {yScale = d3
      .scaleLinear()
      .domain([-MAX, MAX])
      .range([plotHeight, 0]);}
  }

  if (id === "svg2") {    
    yScale = d3
      .scaleLinear()
      .domain([-MAX, MAX])
      .range([plotHeight, 0]);
      yScaleV = d3
        .scaleLinear()
        .domain([-MAX, MAX])
        .range([plotHeight, 0]);
        yAxisV = d3.axisLeft(yScaleV).ticks(5).tickFormat(d => d + "V");
  }

  // 4) AXES
   xAxis = d3.axisBottom(xScale).ticks(5).tickFormat((d) => (d === 0 ? "" : d + "ms"));

  // 5) DRAW AXES
  const gXAxis = gMain
    .append("g")
    .attr("class", "x-axis")
    .attr("id", id + "_svg_x-axis")
    .attr("transform", `translate(0,${plotHeight/2})`)
    .call(xAxis);

    if (id === "svg1") {    
  // Left y-axis at x=0
  const gYAxis = gMain
    .append("g")
    .attr("class", "y-axis")
    .attr("id", id + "_svg_y-axis")
    .call(yAxisI);

  gYAxis.selectAll(".tick text").attr("x", -25); // offset text slightly
    
  // For #svg1, place the right y-axis at x = plotWidth
  let gYAxisRight;
  
    gYAxisRight = gMain
      .append("g")
      .attr("class", "y-axisRight")
      .attr("id", id + "_svg_y-axisRight")
      // .attr("transform", `translate(${plotWidth}, 0)`)
      .call(yAxisRight);

    // shift the text to the right
    gYAxisRight.selectAll(".tick text").attr("x", 25);
  }

  if (id === "svg2") {    
    // Left y-axis at x=0
    const gYAxis = gMain
      .append("g")
      .attr("class", "y-axis")
      .attr("id", id + "_svg_y-axis")
      .call(yAxisV);
  
    gYAxis.selectAll(".tick text").attr("x", -25); // offset text slightly
  }

  // 6) DRAW LINES
  if (id === "svg3") {
    // If not #svg1, just use a single scale
    dataset.forEach(({ data, class: lineClass, line }) => {
      W_.addLineWaveform(gMain, data, lineClass, xScale, yScale, line);
    });
  } else {
    if (id === 'svg1')
    {// #svg1 has separate arrays for I and V
    dataset.I.forEach(({ data, class: lineClass, line }) => {
      W_.addLineWaveform(gMain, data, lineClass, xScale, yScaleI, line);
    });
    dataset.V.forEach(({ data, class: lineClass, line }) => {
      W_.addLineWaveform(gMain, data, lineClass, xScale, yScaleRight, line);
    });}
    else {
      if (id === 'svg2'){
        console.log('dataset.V',dataset.V);
        
        dataset.V.forEach(({ data, class: lineClass, line }) => {
          W_.addLineWaveform(gMain, data, lineClass, xScale, yScaleV, line);
        });        
      }
    }
  }

  // 7) HANDLE RESIZE
  function updateChange() {
    // Re-measure container
    const newWidth = svgContainer.node().getBoundingClientRect().width;
    const newHeight = svgContainer.node().getBoundingClientRect().height;

    // Recompute margins, plot sizes
    margin = {
      top: newHeight * 0.05,
      right: newWidth * 0.05,
      bottom: newHeight * 0.1,
      left: newWidth * 0.1,
    };

    const newPlotWidth = newWidth - margin.left - margin.right;
    const newPlotHeight = newHeight - margin.top - margin.bottom;

    // Update scales
    xScale.range([0, newPlotWidth]);
    yScale.range([newPlotHeight, 0]);
    if (yScaleRight) {
      yScaleRight.range([newPlotHeight, 0]);
    }

    // Update the svg's viewBox
    svgRoot.attr("viewBox", `0 0 ${newWidth} ${newHeight}`);

    // Move the main group
    gMain.attr("transform", `translate(${margin.left},${margin.top})`);

    // Update x-axis position and re-draw
    gXAxis
      .attr("transform", `translate(0,${newPlotHeight/2})`)
      .call(xAxis);

    // Update y-axis
    gYAxis.call(yAxis);

    // If there's a right y-axis, shift it and re-draw
    if (gYAxisRight) {
      gYAxisRight
        .attr("transform", `translate(${newPlotWidth}, 0)`)
        .call(yAxisRight);
    }
  }
  svgRoot.selectAll('path.mylineIA, path.mylineIB, path.mylineIC') .each(function() { if (this.updatePath) { this.updatePath(); } });
  // Listen for resize / fullscreen
  // window.addEventListener("resize", updateChange);
  // window.addEventListener("fullscreen", updateChange);
}
