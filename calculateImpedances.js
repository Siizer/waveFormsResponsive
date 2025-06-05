export var hideDiv = function (VA, IA, VB, IB, VC, IC, id) {
    let z = []; let VAB = new Array(VA.length); let VBC = new Array(VA.length); let VCA = new Array(VA.length); let IAB = new Array(VA.length); let IBC = new Array(VA.length); let ICA = new Array(VA.length);

    for (let i = 0; i < VA.length; i++) {
      VAB[i] = [i, VB[i][1] - VA[i][1], VB[i][2] - VA[i][2]];
      VBC[i] = [i, VC[i][1] - VB[i][1], VC[i][2] - VB[i][2]];
      VCA[i] = [i, VA[i][1] - VC[i][1], VA[i][2] - VC[i][2]];
      IAB[i] = [i, IB[i][1] - IA[i][1], IB[i][2] - IA[i][2]];
      IBC[i] = [i, IC[i][1] - IB[i][1], IC[i][2] - IB[i][2]];
      ICA[i] = [i, IA[i][1] - IC[i][1], IA[i][2] - IC[i][2]];
    }
    const zDisplayed = d3.selectAll('.zdisplayed');
    zDisplayed.remove();

    const calculateImpedance = (V, I) =>
      V.map(([index, Vr, Vi], idx) => {
        const [, Ir, Ii] = I[idx]; // Use `,` to skip the first value instead of declaring `_` again.
        
        return Ir !== 0 || Ii !== 0
          ? [
              new Complex(Vr, Vi).divide(new Complex(Ir, Ii)).real,
              new Complex(Vr, Vi).divide(new Complex(Ir, Ii)).imag,
            ]
          : [0, 0]; // Ensure default return
      });

    z = [calculateImpedance(VA, IA), calculateImpedance(VB, IB), calculateImpedance(VC, IC), calculateImpedance(VAB, IAB), calculateImpedance(VBC, IBC), calculateImpedance(VCA, ICA)];

    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = plotHeight * 2 - margin.left - margin.right,
      height = plotHeight * 2 - margin.top - margin.bottom;


    const flattenedZ = z.flat(); // Flattens the array of arrays into a single array


    var maxAbs = d3.max(flattenedZ, function (d) { return Math.abs(d[0]); });

    maxAbs = Math.max(maxAbs, d3.max(flattenedZ, function (d) { return Math.abs(d[1]); }));

    var x = d3.scaleLinear()
      .domain([-maxAbs, maxAbs])
      .range([-width / 2, width / 2]);

    var y = d3.scaleLinear()
      .domain([-maxAbs, maxAbs])
      .range([height / 2, -height / 2]);

    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    var svgContainer = d3.select("#merged-svg-container");

    svgContainer.style("display", "flex");
    svgContainer.selectAll("*").remove(); // Clear previous elements

    // hide container after 2 seconds
    setTimeout(function () {
        // d3.selectAll(".guideLine").style('opaity',0);

      var line = d3.line()
        .x(function (d) { return x(d[0]); })
        .y(function (d) { return y(d[1]); });
        svgContainer.style("display", "flex");
        svgContainer.style('justify-content','center');
      var svg = svgContainer.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "zdisplayed")
        .append("g")
        .attr("transform", `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`);

      svg.selectAll(".x.axis")
        .data([null]) // Use a single data point to handle the selection
        .join(
          enter => enter.append("g")
            .attr("class", "x axis")
            .call(xAxis)
        );

      svg.selectAll(".y.axis")
        .data([null]) // Use a single data point to handle the selection
        .join(
          enter => enter.append("g")
            .attr("class", "y axis")
            .call(yAxis)
        );

      svg.selectAll(".tick text")
        .filter(d => d === 0) // Change 5 to the value of the tick you want to remove
        .remove();

      const zoom = d3.zoom()
        .scaleExtent([1, 10])  // Min and max zoom scale
        .translateExtent([[-width / 2, -height / 2], [width, height]])  // Min and max zoom extent
        .on("zoom", zoomed);    // Event listener for zoom events

      const svgDisplay = d3.select('#' + id);

      svgDisplay.call(zoom);

      function zoomed(event) {
        svgDisplay.attr("transform", event.transform); // Apply the zoom and pan transformations
      }

      svg.append("line")
        .attr("x1", x(0))
        .attr("y1", y(0))
        .attr("x2", x(Zl_complex_total.real))
        .attr("y2", y(Zl_complex_total.imag))
        .attr("stroke-width", 2)
        .attr("stroke", "white");

      var delay = 10000 / z[0].length;
      var text = svg.append("text")
        .attr("x", -width / 2 + margin.left)
        .attr("y", -height / 2 + margin.top)
        .style("fill", "white");
      const t_fault = Math.round([(POW / (2 * Math.PI)) + 5] * 1000 / f) + 5;

      const drawImpedanceLines = (z, svg, x, y, delay) => {
        // Define colors and labels for each impedance plot
        const impedanceConfig = [
          { color: "#FF0000", label: "ZA" },
          { color: "#FFFF00", label: "ZB" },
          { color: "#0000FF", label: "ZC" },
          { color: "#FFA500", label: "ZAB" },
          { color: "#00FF00", label: "ZBC" },
          { color: "#FF00FF", label: "ZCA" }
        ];

        const tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.85)")
        .style("color", "white")
        .style("padding", "8px 12px")
        .style("border-radius", "6px")
        .style("border", "1px solid #ccc")
        .style("box-shadow", "0px 2px 10px rgba(255,255,255,0.2)")
        .style("font-family", "Arial, sans-serif")
        .style("font-size", "12px")
        .style("display", "none");

        impedanceConfig.forEach(({ color, label }, index) => {
          z[index].forEach((d, i) => {
            if (i < z[index].length - 1) {
              setTimeout(() => {      
                d3.selectAll('.runingLine').remove();
      
                d3.select('#svg1_svg')
                  .append("line")
                  .attr("x1", xScale(i) + 50)
                  .attr("y1", 10)
                  .attr("x2", xScale(i) + 50)
                  .attr("y2", yScale(0) * 2 + 10)
                  .attr("stroke-width", 2)
                  .attr("stroke", "white")
                  .attr("class", "runingLine");
      
                const zPolar = new Complex(d[0], d[1]);
                text.text(`Impedances at: ${i} (ms) = ${zPolar.abs().toFixed(2)} / ${(zPolar.arg() * 180 / Math.PI).toFixed(1)}°`);
      
                svg.append("line")
                  .attr("x1", x(d[0]))
                  .attr("y1", y(d[1]))
                  .attr("x2", x(z[index][i + 1][0]))
                  .attr("y2", y(z[index][i + 1][1]))
                  .attr("stroke-width", 1.5)
                  .attr("stroke", color)
                  .attr("opacity", 0.75);
      
                svg.append('circle')
                  .attr('cx', x(d[0]))
                  .attr('cy', y(d[1]))
                  .attr('r', i === 0 ? 2.5 : 1.4)
                  .attr('fill', color)
                  .attr("class", `impedance-point-${index}`)
                  .on("mouseover", function (event) {
                    d3.select(this).attr("r", 5); // Increase size on hover
      
                    const realPart = d[0].toFixed(2);
                    const imagPart = d[1].toFixed(2);
                    const magnitude = Math.sqrt(d[0] ** 2 + d[1] ** 2).toFixed(2);
                    const angle = (Math.atan2(d[1], d[0]) * (180 / Math.PI)).toFixed(1);
      
                    tooltip
                      .html(`
                        <strong style="color:${color}">Impedance: ${label}</strong><br>
                        <span style="color:${color}">R: <strong>${realPart}</strong> Ω</span> <br>
                        <span style="color:${color}">j X: <strong>${imagPart}</strong> Ω</span> <br>
                        <span style="color:${color}">|Z|: <strong>${magnitude}</strong> Ω</span> <br>
                        <span style="color:${color}"> θ<sub>z</sub>: <strong>${angle}°</strong></span>
                      `)
                      .style("display", "block")
                      .style("left", `${event.pageX + 15}px`)
                      .style("top", `${event.pageY - 15}px`);
                  })
                  .on("mouseout", function () {
                    d3.select(this).attr("r", (i === 0) ? 2.5 : 1.4); // Reset size
                    tooltip.style("display", "none");
                  })
                  .on("click", function () {
                    console.log(`Clicked on ${label} at ${d[0].toFixed(2)} + j${d[1].toFixed(2)}`);
                  });
      
                // Append text only at the last valid index
                if (i === 0) {
                  svg.append('text')
                    .attr('x', x(d[0]))
                    .attr('y', y(d[1])) // Positioning logic for phase vs phase-to-phase
                    .attr('text-anchor', 'middle')
                    .style('font-size', '1.5rem')
                    .attr('font-weight', 'bold')
                    .attr('dx', 60) // Offset for phase-to-phase labels
                    .attr('dy', index * -28)
                    .attr('fill', color)
                    .text(label);
                }
              }, i * delay);
            }
          });
        });
      };
      drawImpedanceLines(z, svg, x, y, delay);      
    }, 0);

  }
