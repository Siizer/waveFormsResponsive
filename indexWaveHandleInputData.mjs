
import { I } from './ComplexOperatorAid.mjs';
import * as W_ from './indexWaveAid.mjs';
import { hideDiv } from './calculateImpedances.js';
import * as P_Line from "./move.mjs";
import { setState } from "./stateManagement.mjs";
var VA_Temp = [];
var IA_Temp = [];
var VB_Temp = [];
var IB_Temp = [];
var VC_Temp = [];
var IC_Temp = [];
let max_Max_yScale_I = 0;
let max_Max_yScale_V = 0;
export function handleInputData(numsample, lineFunc1, lineFunc2, lineFunc3, lineFunc4, lineFunc5, lineFunc6,lineFuncI_O, phaseShift,update,updateOutput,updatePowerSC,
  updatePowerYC,
  updatePowerSI,
  updatePowerSCV,
  updatePowerPPV,
  updatePowerPPI,
  updatePowerPPZ,
  updatePowerZaids) {

d3.selectAll(".form9, .form10, .form11, .form12, .forminput_1, .forminput_2_R, .tab-button, .forminput_2_R0, .forminput_3_X, .forminput_3_X0, .forminput_2_Rs, .forminput_2_Rs0, .forminput_3_Xs, .forminput_3_Xs0, .forminput_ϵ, .forminput_distanceToFault, .forminput_2_Rf").on("input click", function () {

d3.selectAll('.zdisplayed').remove();
  // Make the selected value available within the event handler
  const getValue = faultType;

  updateOutput();

  ϵs = ϵ.value * 1 * Math.PI / 180;
  nominalVoltageSource = Vn.value * 1;
  VsourcePhasor = new Complex(nominalVoltageSource, 0).multiply(Complex.expj(ϵs)); // Voltage amplitude
  V = VsourcePhasor;

  k = distanceToFault.value * 1 / 100; 

rAdd = 0, xAdd = 0;
if (faultType === '1Ph') {
  // Single phase to ground: include zero-sequence components and fault resistance for that single phase
  rAdd = ((R0.value * 1 * k - R.value * 1 * k) / 3) + (Rf.value * 1 * k);
  xAdd = ((X0.value * 1 * k - X.value * 1 * k) / 3);
} else if (faultType === '2PhGr') {
  // Two-phase to ground: 
  // Incorporate zero-sequence component for the two phases involved and fault resistance if needed.
  // This often involves more complex sequence network combinations. For simplicity, assume symmetrical component-based approach or 
  // similar logic as single phase but for two phases. You may need to adjust based on your power system model.
  rAdd = ((R0.value * 1 * k - R.value * 1 * k) / 3) + (Rf.value * 1 * k);
  xAdd = ((X0.value * 1 * k - X.value * 1 * k) / 3);
  // You might need a different factor depending on the exact calculation for two-phase-to-ground faults.
} else if (faultType === '2Ph') {
  // Phase-to-phase fault without ground:
  // Typically does not involve zero-sequence components, just consider negative sequence network.
  // For simplicity, you can ignore zero-sequence terms:
  rAdd = 0;
  xAdd = 0;
  // The line-to-line fault impedance often is just the positive sequence impedance (Z1) plus possibly negative sequence.
  // Adjust accordingly if you have the symmetrical component data.
} else if (faultType === '3Ph') {
  // Three phase fault: no zero-sequence components typically
  rAdd = 0;
  xAdd = 0;
}

Zl_complex = new Complex(R.value * 1 * k + rAdd, X.value * 1 * k + xAdd);

Zs_complex_load = new Complex(
  Rs.value * 1,
  Xs.value * 1
);
Zl_complex_total = new Complex(R.value * 1, X.value * 1);
Zl = Zl_complex.abs();
rsAdd = 0, xsAdd = 0;
if (faultType === '1Ph') {
  // Single phase to ground: include zero-sequence components and fault resistance for that single phase
  rsAdd = ((Rs0.value * 1 - Rs.value * 1) / 3);

  xsAdd = ((Xs0.value * 1 - Xs.value * 1) / 3);
} else if (faultType === '2PhGr') {
  // Two-phase to ground: 
  // Incorporate zero-sequence component for the two phases involved and fault resistance if needed.
  // This often involves more complex sequence network combinations. For simplicity, assume symmetrical component-based approach or 
  // similar logic as single phase but for two phases. You may need to adjust based on your power system model.
  rsAdd = ((Rs0.value * 1 - Rs.value * 1) / 3);
  xsAdd = ((Xs0.value * 1 - Xs.value * 1) / 3);
  // You might need a different factor depending on the exact calculation for two-phase-to-ground faults.
} else if (faultType === '2Ph') {
  // Phase-to-phase fault without ground:
  // Typically does not involve zero-sequence components, just consider negative sequence network.
  // For simplicity, you can ignore zero-sequence terms:
  rsAdd = 0;
  xsAdd = 0;
  // The line-to-line fault impedance often is just the positive sequence impedance (Z1) plus possibly negative sequence.
  // Adjust accordingly if you have the symmetrical component data.
} else if (faultType === '3Ph') {
  // Three phase fault: no zero-sequence components typically
  rsAdd = 0;
  xsAdd = 0;
}

Zs_complex = new Complex(Rs.value * 1 + rsAdd, Xs.value * 1 + xsAdd);
  Zs = Zs_complex.abs();
  load = Rload.value * 1;
  Ztotal_underLoad = Zs_complex_load.add(Zl_complex_total).add(new Complex(load, 0)).abs();
  Ztotal_underFault = Zs_complex.add(Zl_complex).abs();
  Ztotal_underLoad_complex = Zs_complex_load.add(Zl_complex_total).add(new Complex(load, 0));
  Ztotal_underFault_complex = Zs_complex.add(Zl_complex);
  θ = Math.atan2(Ztotal_underFault_complex.imag, Ztotal_underFault_complex.real);
  θs = Math.atan2(Zs_complex.imag, Zs_complex.real);
  θ_preFault = Math.atan2(Ztotal_underLoad_complex.imag, Ztotal_underLoad_complex.real);
  ZlComplex = Complex.expj(θ).multiply(new Complex(Zl, 0));
  ZsComplex = Complex.expj(θs).multiply(new Complex(Zs, 0));

  Z = {
    faultType: faultType,
    faultedPhase: faultedPhase,
    ZlModule: Zl,
    Zl: { r: R.value * 1, x: X.value * 1 },
    ZsModule: Zs,
    Zs: { r: Rs.value * 1, x: Xs.value * 1 },
    Ztotal_underLoadModule: Ztotal_underLoad,
    Ztotal_underFaultModule: Ztotal_underFault,
    Ztotal_underFault_imag: Ztotal_underFault_complex.imag,
    Ztotal_underFault_real: Ztotal_underFault_complex.real
  };
  XoverR_ratio = ((X.value * 1) / (R.value * 1));

  div = 5;
  addsample = 0;
  numsample = 300;
  duration = 0;
  temp = 0;

  POW = (PointOnWave.value * 1 * Math.PI) / 180;
  
  phaseShift = { va: POW, vb: POW - (2 * Math.PI) / 3, vc: POW + (2 * Math.PI) / 3, ia: POW, ib: POW - (2 * Math.PI) / 3, ic: POW + (2 * Math.PI) / 3 };


  Iac_rms = V.divide(Zs_complex.add(Zl_complex).add(new Complex(load, 0))).abs();
  I_peak_underLoad = V.divide(Zs_complex.add(Zl_complex_total).add(new Complex(load, 0))).abs();
  I_peak_underFault = V.divide(Zs_complex.add(Zl_complex)).abs();
  max_Max_yScale_I = I_peak_underFault;
  I_peak_underLoad_complex = V.divide(Zs_complex.add(Zl_complex_total).add(new Complex(load, 0)));
  I_peak_underFault_complex = V.divide(Zs_complex.add(Zl_complex));

  V_peak_underLoad = V.subtract(Zs_complex.multiply(V.divide(Zs_complex.add(Zl_complex_total).add(new Complex(load, 0))))).abs();
  V_peak_underLoad_complex = V.subtract(Zs_complex.multiply(V.divide(Zs_complex.add(Zl_complex_total).add(new Complex(load, 0)))));

  τ = Z.Ztotal_underFault_imag / (ω * Z.Ztotal_underFault_real);  

  d3.select("#Rout").text((R.value * 1).toFixed(1));
  d3.select("#Xout").text((X.value * 1).toFixed(1));
  d3.select("#Rsout").text((Rs.value * 1).toFixed(1));
  d3.select("#Xsout").text((Xs.value * 1).toFixed(1));
  d3.select('#distanceToFaultout').text(distanceToFault.value);
  d3.select('#sVSnout').text((ϵ.value * 1));

  let datasetTemp = []; 
  let localMax_I = []; 
  let localMax_V = [];
  
  const svgI = d3.select("#svg1_svg");
  const svgV = d3.select("#svg2_svg");
  
  function generateDataAndDrawLine(numsample, addsample, div, POW, Z, load, i_mul_loop, θ, XoverR_ratio, nominalVoltageSource, MAX_yScale, svg, svgPolar, lineFunc, className, strokeColor, phaseShift, I_V) { 
    if(className === ".mylineVA") {
      VA_Temp = datasetTemp.dataset;     
      datasetTemp = W_.generateDataset(numsample, I_peak_underFault, phaseShift.va, false, POW, div, addsample, load, nominalVoltageSource, Z, Iac_rms, θ, XoverR_ratio, I_peak_underLoad, 'A', θ_preFault);
      VA_dataset = datasetTemp;
    }
    if(className === ".mylineIA") {
      IA_Temp = datasetTemp.dataset;
      datasetTemp = W_.generateDataset(numsample, I_peak_underFault, phaseShift.ia, true, POW, div, addsample, load, nominalVoltageSource, Z, Iac_rms, θ, XoverR_ratio, I_peak_underLoad, 'A', θ_preFault);
      IA_dataset = datasetTemp;
    }
    if(className === ".mylineVB") {
      VB_Temp = datasetTemp.dataset;      
      datasetTemp = W_.generateDataset(numsample, I_peak_underFault, phaseShift.vb, false, POW, div, addsample, load, nominalVoltageSource, Z, Iac_rms, θ, XoverR_ratio, I_peak_underLoad, 'B', θ_preFault);
      VB_dataset = datasetTemp;
    }
    if(className === ".mylineIB") {
      IB_Temp = datasetTemp.dataset;
      datasetTemp = W_.generateDataset(numsample, I_peak_underFault, phaseShift.ib, true, POW, div, addsample, load, nominalVoltageSource, Z, Iac_rms, θ, XoverR_ratio, I_peak_underLoad, 'B', θ_preFault);
      IB_dataset = datasetTemp;
    }
    if(className === ".mylineVC") {
      VC_Temp = datasetTemp.dataset;      
      datasetTemp = W_.generateDataset(numsample, I_peak_underFault, phaseShift.vc, false, POW, div, addsample, load, nominalVoltageSource, Z, Iac_rms, θ, XoverR_ratio, I_peak_underLoad, 'C', θ_preFault);
      VC_dataset = datasetTemp;
    }
    if(className === ".mylineIC") {
      IC_Temp = datasetTemp.dataset;
      datasetTemp = W_.generateDataset(numsample, I_peak_underFault, phaseShift.ic, true, POW, div, addsample, load, nominalVoltageSource, Z, Iac_rms, θ, XoverR_ratio, I_peak_underLoad, 'C', θ_preFault);
      IC_dataset = datasetTemp;
    }
  
    if (className.charAt(7) === 'I') localMax_I.push(datasetTemp.max);
    if (className.charAt(7) === 'V') localMax_V.push(datasetTemp.max);
  
    return {
      dataset: datasetTemp.dataset,
      className,
      strokeColor,
      isCurrent: (className !== "mylineI_O")
    };
  }
  
  const allWaveforms = [
  generateDataAndDrawLine(numsample, addsample, div, POW, Z, load, I_peak_underFault, θ, XoverR_ratio, nominalVoltageSource, MAX_yScale_I, svgI, svgPolar, lineFunc1, ".mylineIA", "red", phaseShift, true),
  generateDataAndDrawLine(numsample, addsample, div, POW, Z, load, I_peak_underFault, θ, XoverR_ratio, nominalVoltageSource, MAX_yScale_I, svgI, svgPolar, lineFunc2, ".mylineIB", "yellow", phaseShift, true),
  generateDataAndDrawLine(numsample, addsample, div, POW, Z, load, I_peak_underFault, θ, XoverR_ratio, nominalVoltageSource, MAX_yScale_I, svgI, svgPolar, lineFunc3, ".mylineIC", "blue", phaseShift, true),
  generateDataAndDrawLine(numsample, addsample, div, POW, Z, load, I_peak_underFault, θ, XoverR_ratio, nominalVoltageSource, MAX_yScale_V, svgV, svgPolar, lineFunc4, ".mylineVA", "red", phaseShift, false),
  generateDataAndDrawLine(numsample, addsample, div, POW, Z, load, I_peak_underFault, θ, XoverR_ratio, nominalVoltageSource, MAX_yScale_V, svgV, svgPolar, lineFunc5, ".mylineVB", "yellow", phaseShift, false),
  generateDataAndDrawLine(numsample, addsample, div, POW, Z, load, I_peak_underFault, θ, XoverR_ratio, nominalVoltageSource, MAX_yScale_V, svgV, svgPolar, lineFunc6, ".mylineVC", "blue", phaseShift, false),
  ];

  console.log('localMax_I',localMax_I);
  
  // Update global max after all draws
  max_Max_yScale_I = Math.max(...localMax_I);
  max_Max_yScale_V = Math.max(...localMax_V);
  console.log('max_Max_yScale_I',max_Max_yScale_I);
  
  // Set axis domains and ticks
  r.domain([0, max_Max_yScale_I]);
  rv.domain([0, max_Max_yScale_V]);
  
  let ticks = r.ticks(5).slice(1);
  if (!ticks.includes(max_Max_yScale_I)) ticks.push(Math.round(max_Max_yScale_I));
  
  let ticksv = rv.ticks(5).slice(1);
  if (!ticksv.includes(max_Max_yScale_V)) ticksv.push(Math.round(max_Max_yScale_V));
  
  // Update polar text ticks
  svgPolar.select("#grAxis")
    .selectAll("text")
    .data(ticks)
    .transition().duration(0)
    .text(d => d);
  
  svgPolar.select("#grvAxis")
    .selectAll("text")
    .data(ticksv)
    .transition().duration(0)
    .text(d => d);
  
  // Update domains for line charts
  xScale.domain([0.0001, numsample + addsample]);
  
  yScale.domain([-max_Max_yScale_I, max_Max_yScale_I]);
  yScaleI.domain([-max_Max_yScale_I, max_Max_yScale_I]);
  yScaleV.domain([-max_Max_yScale_V, max_Max_yScale_V]);
  yScaleRight.domain([-max_Max_yScale_V, max_Max_yScale_V]);
  svgI.select("#svg1_svg_x-axis").transition().duration(0).call(xAxis);
  svgI.select("#svg1_svg_y-axis").transition().duration(0).call(yAxisI);
  svgV.select("#svg2_svg_x-axis").transition().duration(0).call(xAxis);
  svgV.select("#svg2_svg_y-axis").transition().duration(0).call(yAxisV);
  
  for (const wave of allWaveforms) {
    d3.selectAll(wave.className)
      .attr("d", d => {
        const y = wave.className.charAt(7) === 'I' ? yScaleI : yScaleV;
        const lineFunc = d3.line()
          .x(d => xScale(d[0]))
          .y(d => y(d[1]))
          .curve(d3.curveBasis);
        return lineFunc(wave.dataset);
      })
      .transition()
      .duration(duration)
      .attr("stroke", wave.strokeColor)
      .attr("stroke-width", wave.isCurrent ? thickness : 10)
      .attr("fill", "none");
  }

  update();
  

// Instead of checking for closeZModeBtn,
// get the unified toggle button and check its active state:
const toggleZModeBtn = document.getElementById("toggleZMode");
if (toggleZModeBtn && toggleZModeBtn.classList.contains("active")) {
  // If we are in Z Mode, perform the necessary update.
  
  d3.selectAll('.zdisplayed').remove();
  hideDiv(VA_dataset.dataset, IA_dataset.dataset, VB_dataset.dataset, IB_dataset.dataset, VC_dataset.dataset, IC_dataset.dataset, 'change');
}

const allInputs = [...document.querySelectorAll(".form9, .form10, .form11, .form12, \
  .forminput_1, .forminput_2_R, \
  .tab-button, .forminput_2_R0, \
  .forminput_3_X, .forminput_3_X0, \
  .forminput_2_Rs, .forminput_2_Rs0, \
  .forminput_3_Xs, .forminput_3_Xs0, \
  .forminput_ϵ, .forminput_distanceToFault, \
  .forminput_2_Rf")];

// Map each <input> or <button> to an object { name, value, type }
const inputObjects = allInputs.map(input => {
return {
name: input.name || input.id || "unnamed",
value: input.value,
type: input.type || "unknown"
};
});

// Example grouping: group inputs by type, e.g. 'range', 'number', 'button'
// (Just for demonstration of groupBy)
// If your environment doesn't have groupBy, you might skip or polyfill it:
const inputsGroupedByType = Object.groupBy(inputObjects, item => item.type);


// 2) Re-calculate your waveform data or fault logic here.
//    For instance, call your existing function to update angles, impedances, etc.
//    We'll assume you have some function: recalcDataset() that returns new arrays
// const { IA_data, IB_data, IC_data } = recalcDataset(); 
// ^ This function is hypothetical. You can adapt it to your existing structure.

// 3) Update circles on each parent <svg> that show "tracked" positions
//    We'll do something like:
d3.select("#svg1_svg>g")  // or whatever your selection is
.selectAll(".myLineIA-track")
.data([IA_dataset.dataset]) // just binding one element for the circle
.join(
enter => enter.append("circle")
.attr("class", "myLineIA-track")
.attr("r", 5)
.style("fill", "var(--Aphase)"),
update => update,
exit => exit.remove()
)
.attr("cx", d => xScale(d[0])) // or your indexing logic
.attr("cy", d => yScaleI(d[1]));

// ... repeat for .myLineIB-track and .myLineIC-track ...
d3.select("#svg1_svg>g")
.selectAll(".myLineIB-track")
.data([IB_dataset.dataset])
.join("circle")
.attr("class", "myLineIB-track")
.attr("r", 5)
.style("fill", "var(--Bphase)")
.attr("cx", d => xScale(d[0]))
.attr("cy", d => yScaleI(d[1]));

d3.select("#svg1_svg>g")
.selectAll(".myLineIC-track")
.data([IC_dataset.dataset])
.join("circle")
.attr("class", "myLineIC-track")
.attr("r", 5)
.style("fill", "var(--Cphase)")
.attr("cx", d => xScale(d[0]))
.attr("cy", d => yScaleI(d[1]));

d3.select("#svg2_svg>g")  // or whatever your selection is
.selectAll(".myLineVA-track")
.data([VA_dataset.dataset]) // just binding one element for the circle
.join(
enter => enter.append("circle")
.attr("class", "myLineVA-track")
.attr("r", 5)
.style("fill", "var(--Aphase)"),
update => update,
exit => exit.remove()
)
.attr("cx", d => xScale(d[0])) // or your indexing logic
.attr("cy", d => yScaleV(d[1]));

// ... repeat for .myLineIB-track and .myLineIC-track ...
d3.select("#svg2_svg>g")
.selectAll(".myLineVB-track")
.data([VB_dataset.dataset])
.join("circle")
.attr("class", "myLineVB-track")
.attr("r", 5)
.style("fill", "var(--Bphase)")
.attr("cx", d => xScale(d[0]))
.attr("cy", d => yScaleV(d[1]));

d3.select("#svg2_svg>g")
.selectAll(".myLineVC-track")
.data([VC_dataset.dataset])
.join("circle")
.attr("class", "myLineVC-track")
.attr("r", 5)
.style("fill", "var(--Cphase)")
.attr("cx", d => xScale(d[0]))
.attr("cy", d => yScaleV(d[1]));

const circleSelectionA = d3.select("#svg1_svg>g")  // or whatever your selection is
.selectAll(".myLineVA-track-Right")
.data([VA_dataset.dataset]) // just binding one element for the circle
.join(
enter => enter.append("circle")
.attr("class", "myLineVA-track-Right")
.attr("r", 5)
.style("fill", "var(--Aphase)"),
update => update,
exit => exit.remove()
)
.attr("cx", d => xScale(d[0])) // or your indexing logic
.attr("cy", d => yScaleRight(d[1]));

// circleSelectionA.style('display','block');

// ... repeat for .myLineIB-track and .myLineIC-track ...
const circleSelectionB = d3.select("#svg1_svg>g")
.selectAll(".myLineVB-track-Right")
.data([VB_dataset.dataset])
.join("circle")
.attr("class", "myLineVB-track-Right")
.attr("r", 5)
.style("fill", "var(--Bphase)")
.attr("cx", d => xScale(d[0]))
.attr("cy", d => yScaleRight(d[1]));

// circleSelectionB.style('display','block');

const circleSelectionC = d3.select("#svg1_svg>g")
.selectAll(".myLineVC-track-Right")
.data([VC_dataset.dataset])
.join("circle")
.attr("class", "myLineVC-track-Right")
.attr("r", 5)
.style("fill", "var(--Cphase)")
.attr("cx", d => xScale(d[0]))
.attr("cy", d => yScaleRight(d[1]));

// circleSelectionC.style('display','block');

// 4) Optionally log or handle further logic

document.addEventListener("DOMContentLoaded", () => {
setState();})
});
}
