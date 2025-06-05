

import * as P_ from "./indexWaveCreatePolar.mjs";

export function moveLine(aux,updatePowerSC,
  updatePowerYC,
  updatePowerSI,
  updatePowerSCV,
  updatePowerPPV,
  updatePowerPPI,
  updatePowerPPZ,
  updatePowerZaids,update,vectorsData,IA_dataset,IB_dataset,IC_dataset,VA_dataset,VB_dataset,VC_dataset,ia,ib,ic,va,vb,vc) {
const updateMove = update;

if (aux < 0 || aux >= VA_dataset.dataset.length) {
    d3.select("#infoTimeStamp").style("color", "rgba(0,0,0,0.2)");
    d3.selectAll(".guideLine").style("stroke", "rgba(0,0,0,0)");
    d3.selectAll(".myLineIA-track").style("fill",'rgba(0,0,0,0)')
    d3.selectAll(".myLineIB-track").style("fill",'rgba(0,0,0,0)')
    d3.selectAll(".myLineIC-track").style("fill",'rgba(0,0,0,0)')
    d3.selectAll(".myLineVA-track").style("fill",'rgba(0,0,0,0)')
    d3.selectAll(".myLineVB-track").style("fill",'rgba(0,0,0,0)')
    d3.selectAll(".myLineVC-track").style("fill",'rgba(0,0,0,0)')
    return; 
  }

  const guideLine = d3.selectAll(".guideLine").style("stroke", "var(--lineGuide)").style('stroke-dasharray', '4,2');

  P_.updateInfo(d3.select('#timeStamp'), "t", Math.round(aux) + "ms");
     
// Update vector values (assuming your dataset indexing is correct)
vectorsData.VA.x = VA_dataset.dataset[Math.round(aux)][1];
vectorsData.VA.y = VA_dataset.dataset[Math.round(aux)][2];
vectorsData.VB.x = VB_dataset.dataset[Math.round(aux)][1];
vectorsData.VB.y = VB_dataset.dataset[Math.round(aux)][2];
vectorsData.VC.x = VC_dataset.dataset[Math.round(aux)][1];
vectorsData.VC.y = VC_dataset.dataset[Math.round(aux)][2];
vectorsData.IA.x = IA_dataset.dataset[Math.round(aux)][1];
vectorsData.IA.y = IA_dataset.dataset[Math.round(aux)][2];
vectorsData.IB.x = IB_dataset.dataset[Math.round(aux)][1];
vectorsData.IB.y = IB_dataset.dataset[Math.round(aux)][2];
vectorsData.IC.x = IC_dataset.dataset[Math.round(aux)][1];
vectorsData.IC.y = IC_dataset.dataset[Math.round(aux)][2];

// Select separate parent groups for current and voltage circles:
const guidelineParentSVG1 = d3.select('#svg1_svg>g'); // for I phases
const guidelineParentSVG2 = d3.select('#svg2_svg>g'); // for V phases

// Bind data using unique classes for each phase:
const circlesIA = guidelineParentSVG1.selectAll(".myLineIA-track")
  .data([IA_dataset.dataset[Math.round(aux)]]);
const circlesIB = guidelineParentSVG1.selectAll(".myLineIB-track")
  .data([IB_dataset.dataset[Math.round(aux)]]);
const circlesIC = guidelineParentSVG1.selectAll(".myLineIC-track")
  .data([IC_dataset.dataset[Math.round(aux)]]);
  
  const circlesVA = guidelineParentSVG2.selectAll(".myLineVA-track")
    .data([VA_dataset.dataset[Math.round(aux)]]);
  const circlesVB = guidelineParentSVG2.selectAll(".myLineVB-track")
    .data([VB_dataset.dataset[Math.round(aux)]]);
  const circlesVC = guidelineParentSVG2.selectAll(".myLineVC-track")
    .data([VC_dataset.dataset[Math.round(aux)]]);
  
    const circlesVA_Right = guidelineParentSVG1.selectAll(".myLineVA-track-Right")
      .data([VA_dataset.dataset[Math.round(aux)]]);
    const circlesVB_Right = guidelineParentSVG1.selectAll(".myLineVB-track-Right")
      .data([VB_dataset.dataset[Math.round(aux)]]);
    const circlesVC_Right = guidelineParentSVG1.selectAll(".myLineVC-track-Right")
      .data([VC_dataset.dataset[Math.round(aux)]]);

// Remove old elements if any
circlesIA.exit().remove();
circlesIB.exit().remove();
circlesIC.exit().remove();
circlesVA.exit().remove();
circlesVB.exit().remove();
circlesVC.exit().remove();
circlesVA_Right.exit().remove();
circlesVB_Right.exit().remove();
circlesVC_Right.exit().remove();

// Append/update circles for each phase

circlesIA.enter()
  .append("circle")
  .merge(circlesIA)
  .attr("class", "myLineIA-track")
  .attr("id", d => "myLineIA-hovered-test-" + aux)
  .attr("cx", d => xScale(d[0]))
  .attr("cy", d => yScaleI(d[1]))  // Adjust if needed: ensure d[1] is the correct value
  .attr("r", 5)
  .style("fill", "var(--Aphase)");

circlesIB.enter()
  .append("circle")
  .merge(circlesIB)
  .attr("class", "myLineIB-track")
  .attr("id", d => "myLineIB-hovered-test-" + aux)
  .attr("cx", d => xScale(d[0]))
  .attr("cy", d => yScaleI(d[1]))
  .attr("r", 5)
  .style("fill", "var(--Bphase)");

circlesIC.enter()
  .append("circle")
  .merge(circlesIC)
  .attr("class", "myLineIC-track")
  .attr("id", d => "myLineIC-hovered-test-" + aux)
  .attr("cx", d => xScale(d[0]))
  .attr("cy", d => yScaleI(d[1]))
  .attr("r", 5)
  .style("fill", "var(--Cphase)");

  circlesVA.enter()
    .append("circle")
    .merge(circlesVA)
    .attr("class", "myLineVA-track")
    .attr("id", d => "myLineVA-hovered-test-" + aux)
    .attr("cx", d => xScale(d[0]))
    .attr("cy", d => yScaleV(d[1]))
    .attr("r", 5)
    .style("fill", "var(--Aphase)");
  
  circlesVB.enter()
    .append("circle")
    .merge(circlesVB)
    .attr("class", "myLineVB-track")
    .attr("id", d => "myLineVB-hovered-test-" + aux)
    .attr("cx", d => xScale(d[0]))
    .attr("cy", d => yScaleV(d[1]))
    .attr("r", 5)
    .style("fill", "var(--Bphase)");
  
  circlesVC.enter()
    .append("circle")
    .merge(circlesVC)
    .attr("class", "myLineVC-track")
    .attr("id", d => "myLineVC-hovered-test-" + aux)
    .attr("cx", d => xScale(d[0]))
    .attr("cy", d => yScaleV(d[1]))
    .attr("r", 5)
    .style("fill", "var(--Cphase)");

    circlesVA_Right.enter()
      .append("circle")
      .merge(circlesVA_Right)
      .attr("class", "myLineVA-track-Right")
      .attr("id", d => "myLineVA-hovered-test-Right" + aux)
      .attr("cx", d => xScale(d[0]))
      .attr("cy", d => yScaleRight(d[1]))
      .attr("r", 5)
      .style("fill", "var(--Aphase)");
    
    circlesVB_Right.enter()
      .append("circle")
      .merge(circlesVB_Right)
      .attr("class", "myLineVB-track-Right")
      .attr("id", d => "myLineVB-hovered-test-Right" + aux)
      .attr("cx", d => xScale(d[0]))
      .attr("cy", d => yScaleRight(d[1]))
      .attr("r", 5)
      .style("fill", "var(--Bphase)");
    
    circlesVC_Right.enter()
      .append("circle")
      .merge(circlesVC_Right)
      .attr("class", "myLineVC-track-Right")
      .attr("id", d => "myLineVC-hovered-test-Right" + aux)
      .attr("cx", d => xScale(d[0]))
      .attr("cy", d => yScaleRight(d[1]))
      .attr("r", 5)
      .style("fill", "var(--Cphase)");

  updatePowerSC();
  updatePowerYC();
  updatePowerSI();
  updatePowerSCV();
  updatePowerPPV();
  updatePowerPPI();
  updatePowerPPZ();
  updatePowerZaids();
  
  updateValues();

  function updateValues() {
     va = calculateVector(VA_dataset, aux, rv);
     vb = calculateVector(VB_dataset, aux, rv);
     vc = calculateVector(VC_dataset, aux, rv);
     ia = calculateVector(IA_dataset, aux, r);
     ib = calculateVector(IB_dataset, aux, r);
     ic = calculateVector(IC_dataset, aux, r);   
 

    [psa, psb, psc] = [[va], [vb], [vc]];
    [psai, psbi, psci] = [[ia], [ib], [ic]];
    vs = psResult[6];
    is = psResult[7];
    updateMove();
  }

  function calculateVector(dataset, aux, scale) {
    const index = Math.min(Math.max(0, Math.round(aux)), dataset.dataset.length );
  
    if (!dataset.dataset[index]) {
      return [0, 0]; 
    }    
    return [
      scale(dataset.dataset[index][1]),
      scale(dataset.dataset[index][2])
    ];
  }
}