import * as C_ from "./ComplexOperatorAid.mjs";
import * as W_ from "./indexWaveAid.mjs";
import * as M_ from "./AddMarkers.mjs";
import * as P_ from "./indexWaveCreatePolar.mjs";
import { Vector } from "./indexWaveClassVector.mjs";
import { createSVG } from "./indexWaveCreateSVGChannel.mjs";
import { handleInputData } from "./indexWaveHandleInputData.mjs";
import { setState } from "./stateManagement.mjs";
import DragManager from './dragManager.js';
import { legends } from './legends.js';
import { hideDiv } from './calculateImpedances.js';
import * as aP_ from "./quantity.mjs";
import * as P_Line from "./move.mjs";

DragManager.makeDraggableUnified(
  ['#table-control', '#test', '#table-control-R-X-Parameters'],
  {
    onDragStart: (e) => console.log("Drag started:", e.target.id),
    onDragMove: (e) => console.log("Dragging:", e.target.id),
    onDragEnd: (e) => console.log("Drag ended:", e.target.id)
  }
);

const table_control_R_X_Parameters = document.getElementById('table-control-R-X-Parameters')
const closePanel = document.getElementById('closePanel')
closePanel.addEventListener('click', (e) => table_control_R_X_Parameters.style.display = 'none' )
  
const { updateQuantity: updatePowerSC } = aP_.quantity(
  vectorsData,
  svg_apparentPower,
  colors,
  ["SA", "SB", "SC","S0", "S1", "S2"],
  "Apparent Power SA SB SC S0 S1 S2"
);

const { updateQuantity: updatePowerYC } = aP_.quantity(
  vectorsData,
  svg_admittance,
  colors,
  ["YA", "YB", "YC"],
  "Admittance YA YB YC"
);

const { updateQuantity: updatePowerSI } = aP_.quantity(
  vectorsData,
  svg_SequenceImpedance,
  colors,
  ["Z0", "Z1", "Z2", "ZA", "ZB", "ZC"],
  "Z0 Z1 Z2 ZA ZB ZC"
);

const { updateQuantity: updatePowerSCV } = aP_.quantity(
  vectorsData,
  svg_SequenceCurrentAndVoltage ,
  colors,
  ["V0", "V1", "V2","I0", "I1", "I2"],
  "V0 V1 V2 I0 I1 I2"
);

const { updateQuantity: updatePowerPPV } = aP_.quantity(
  vectorsData,
  svg_PhasePhaseVoltage ,
  colors,
  ["VAB", "VBC", "VCA"],
  "Phase-Phase Voltage"
);

const { updateQuantity: updatePowerPPI } = aP_.quantity(
  vectorsData,
  svg_PhasePhaseCurrent ,
  colors,
  ["IAB", "IBC", "ICA"],
  "Phase-Phase Current"
);

const { updateQuantity: updatePowerPPZ } = aP_.quantity(
  vectorsData,
  svg_PhasePhaseImpedance ,
  colors,
  ["ZAB", "ZBC", "ZCA"],
  "Phase-Phase Impedance"
);

const { updateQuantity: updatePowerZaids } = aP_.quantity(
  vectorsData,
  svg_Zaids ,
  colors,
  ["ZsymmetricalTotal", "Zn"],
  "ZT = Z1+Z2+Z0, Zn"
);

updatePowerSC();
updatePowerYC();
updatePowerSI();
updatePowerSCV();
updatePowerPPV();
updatePowerPPI();
updatePowerPPZ();
updatePowerZaids();


IA_dataset = W_.generateDataset(numsample, I_peak_underFault, phaseShift.ia, true, POW, div, addsample, load, nominalVoltageSource, Z, Iac_rms, θ, XoverR_ratio, I_peak_underLoad,'A',θ_preFault);
VA_dataset = W_.generateDataset(numsample, I_peak_underFault, phaseShift.va, false, POW, div, addsample, load, nominalVoltageSource, Z, Iac_rms, θ, XoverR_ratio, I_peak_underLoad,'A',θ_preFault);
IB_dataset = W_.generateDataset(numsample, I_peak_underFault, phaseShift.ib, true, POW, div, addsample, load, nominalVoltageSource, Z, Iac_rms, θ, XoverR_ratio, I_peak_underLoad,'B',θ_preFault);
IC_dataset = W_.generateDataset(numsample, I_peak_underFault, phaseShift.ic, true, POW, div, addsample, load, nominalVoltageSource, Z, Iac_rms, θ, XoverR_ratio, I_peak_underLoad,'C',θ_preFault);
VB_dataset = W_.generateDataset(numsample, I_peak_underFault, phaseShift.vb, false, POW, div, addsample, load, nominalVoltageSource, Z, Iac_rms, θ, XoverR_ratio, I_peak_underLoad,'B',θ_preFault);
VC_dataset = W_.generateDataset(numsample, I_peak_underFault, phaseShift.vc, false, POW, div, addsample, load, nominalVoltageSource, Z, Iac_rms, θ, XoverR_ratio, I_peak_underLoad,'C',θ_preFault);

MAX_yScale_I = Math.max(IA_dataset.max,IB_dataset.max,IC_dataset.max);
MAX_yScale_V = Math.max(VA_dataset.max,VB_dataset.max,VC_dataset.max);
MAX_yScale_IO = MAX_yScale_V;


let I_dataset = [
  { data: IA_dataset.dataset, class: "mylineIA",line: lineFunc1 },
  { data: IB_dataset.dataset, class: "mylineIB",line: lineFunc2 },
  { data: IC_dataset.dataset, class: "mylineIC",line: lineFunc3 }
];
let V_dataset = [
  { data: VA_dataset.dataset, class: "mylineVA",  line: lineFunc4 },
  { data: VB_dataset.dataset, class: "mylineVB", line:  lineFunc5 },
  { data: VC_dataset.dataset, class: "mylineVC",  line: lineFunc6 }
];

let V_datasetRight = [
  { data: VA_dataset.dataset, class: "mylineVA",  line: lineFunc4Right },
  { data: VB_dataset.dataset, class: "mylineVB", line:  lineFunc5Right },
  { data: VC_dataset.dataset, class: "mylineVC",  line: lineFunc6Right }
];

let combinedDataset = [
  ...I_dataset, // Currents
  ...V_datasetRight, // Voltages
];


const createArrayPairs = (firstNumber, secondNumber, value) => 
    Array.from({ length: secondNumber - firstNumber + 1 }, (_, i) => [firstNumber + i, value]);

let digital_I_O_Range = [
  {
    start:95,
    end: 250,
    label:"50P"
  },
  {
    start:0,
    end: 250,
    label:"51"
  },
  {
    start:150,
    end: 250,
    label:"51G"
  },
  {
    start:95,
    end: 300,
    label:"Trip"
  },
  {
    start:25,
    end: 100,
    label:"87"
  },
  {
    start:25,
    end: 100,
    label:"51Q"
  },
  {
    start:25,
    end: 100,
    label:"M1P"
  },
  {
    start:25,
    end: 100,
    label:"M2P"
  },
  {
    start:25,
    end: 100,
    label:"BF"
  },
  {
    start:25,
    end: 100,
    label:"Rx"
  }
];

const nMultiplier = 25;

let I_O_dataset = [];
for (let i = 0; i < digital_I_O_Range.length; i++) {
  I_O_dataset.push({ data: createArrayPairs(digital_I_O_Range[i].start, digital_I_O_Range[i].end, i*nMultiplier - 115), class: "mylineI_O",  line: lineFuncI_O });
}

function createDatasetBase(x) {
  return {
    data: [[0,x], [numsample,x]],
    class: "mylineI_O",
    line: lineFuncI_O
  };
}

width = svgContainer1.node().getBoundingClientRect().width;
    
height = svgContainer1.node().getBoundingClientRect().height;

createSVG(svgContainer1, "svg1", {I:I_dataset,V:V_datasetRight}, {I:MAX_yScale_I,V:MAX_yScale_V}, "t (ms)", "");
createSVG(svgContainer2, "svg2", {V:V_dataset}, MAX_yScale_V, "t (ms)", "");
createSVG(svgContainer3, "svg3", I_O_dataset, MAX_yScale_IO, "t (ms)", "");

d3.selectAll('#svg1_svg g path.mylineVA,#svg1_svg g path.mylineVB,#svg1_svg g path.mylineVC,#svg1_svg_y-axisRight,.my-legend-circleRight,.legend-textRight').style("opacity","0");

svgOverlay = d3.selectAll("#svg1_svg>g, #svg2_svg>g, #svg3_svg>g")
svgOverlay_I = d3.selectAll("#svg1>svg>g")
svgOverlay_V = d3.selectAll("#svg2>svg>g")
svgOverlay_I_O = d3.selectAll("#svg3>svg>g")

const svg1_svg = d3.select("#svg1_svg");

// On “mouse enters #svg1_svg”, make guide lines visible
svgOverlay.on("mouseenter", () => {
  d3.selectAll(".guideLine,.myLineIA-track,.myLineIB-track,.myLineIC-track,.myLineVA-track,.myLineVB-track,.myLineVC-track,.myLineVA-track-Right,.myLineVB-track-Right,.myLineVC-track-Right").style("opacity", 1);
  d3.selectAll(".runingLine").style("opacity", 0);
});

// On “mouse leaves #svg1_svg_svg”, hide them again
svgOverlay.on("mouseleave", () => {
  d3.selectAll(".guideLine,.myLineIA-track,.myLineIB-track,.myLineIC-track,.myLineVA-track,.myLineVB-track,.myLineVC-track,.myLineVA-track-Right,.myLineVB-track-Right,.myLineVC-track-Right").style("opacity", 0);
  d3.selectAll(".runingLine").style("opacity", 1);
});


let pathElementBase = d3.select("#svg3_svg>g");
for (let i = -5; i < 5; i++) {
  let dataset = createDatasetBase(i*nMultiplier + 4);
  pathElementBase.append('path')
    .attr("class", dataset.class)
    .attr('d', dataset.line(dataset.data))
    .attr('stroke-width',  1 )
    .attr('fill', 'none');

  pathElementBase.append('text')
    .attr('x', dataset.data[0][0]-20) // x-coordinate of the text
    .attr('y', yScale(i*nMultiplier*1.05 + 4)) // y-coordinate of the text
    //text color white
    .attr('fill', 'white')
    .text(digital_I_O_Range[i+5].label); // content of the text
}

d3.select("#svg3_svg>g>#svg3_svg_x-axis.x-axis").attr("display","none");
d3.selectAll("#svg3_svg>g>#svg3_svg_y-axis>g.tick").attr("display","none");


svgOverlay = d3.selectAll("#svg1_svg>g, #svg2_svg>g, #svg3_svg>g")

//----------- polar
r = d3.scaleLinear().domain([0, MAX_yScale_I]).range([0, radius]);
rv = d3.scaleLinear().domain([0, MAX_yScale_V]).range([0, radius]);

svgPolar = P_.createPolarChart("#viz_polar", width_polar, height_polar, r, rv, radius);


mag = rv(MAX_yScale_V), magI = r(MAX_yScale_I), p={x: (0) / 4,y: (0) / 4};
[va, vb, vc, po] = C_.setVectors(p, mag);
[psa, psb, psc] = [[va], [vb], [vc]];
[ia, ib, ic, po] = C_.setVectors(p, magI);
[psai, psbi, psci] = [[ia], [ib], [ic]];

psResult = W_.ps_(va,vb,vc,ia,ib,ic,po);
ps2 = psResult[0], ps2i = psResult[1], ps1 = psResult[2], ps1i = psResult[3], ps0 = psResult[4], ps0i = psResult[5];
vs = psResult[6], is = psResult[7];   


M_.Vmarker(svgPolar, Object.keys(colors), 5, colors);

let data = [[po[0], po[1]], [po[0], po[1]], [po[0], po[1]]];
var noText;

let vectora = new Vector(svgPolar, "vectora", "texta", psa, "arrow-A", "va", vs.a, va, vs.ampa, vs.anglea,rv);
let vectorb = new Vector(svgPolar, "vectorb", "textb", psb, "arrow-B", "vb", vs.b, vb, vs.ampb, vs.angleb,rv);
let vectorc = new Vector(svgPolar, "vectorc", "textc", psc, "arrow-C", "vc", vs.c, vc, vs.ampc, vs.anglec,rv);


let vectorai = new Vector(svgPolar, "vectorai", "textai", psai, "arrow-A", "ia", is.a, ia, is.ampa, is.anglea,r);
let vectorbi = new Vector(svgPolar, "vectorbi", "textbi", psbi, "arrow-B", "ib", is.b, ib, is.ampb, is.angleb,r);
let vectorci = new Vector(svgPolar, "vectorci", "textci", psci, "arrow-C", "ic", is.c, ic, is.ampc, is.anglec,r);

function changeReference(data,ps) { 
  data = [[ps[0].x, ps[0].y], [ps[1].x, ps[1].y], [ps[2].x, ps[2].y]];
  return data;
}

vectora.draw(true, data,psa);
vectorb.draw(true, data,psb);
vectorc.draw(true, data,psc);

data = [[po[0], po[1]], [po[0], po[1]], [po[0], po[1]]];  

vectorai.draw(true, data,psai);
vectorbi.draw(true, data,psbi);
vectorci.draw(true, data,psci);

const update = function () {


  psResult = W_.ps_(va,vb,vc,ia,ib,ic,po)
  ps2 = psResult[0], ps2i = psResult[1], ps1 = psResult[2], ps1i = psResult[3], ps0 = psResult[4], ps0i = psResult[5]
  vs = psResult[6], is = psResult[7]

  data = [[po[0], po[1]], [po[0], po[1]], [po[0], po[1]]];

  vectora.draw(true, data,psa);
  vectorb.draw(true, data,psb);
  vectorc.draw(true, data,psc);

  vectorai.draw(true, data,psai);
  vectorbi.draw(true, data,psbi);
  vectorci.draw(true, data,psci);

};


update();
runningLine_I = svgOverlay_I.append('line').attr("class", "guideLine");
runningLine_V = svgOverlay_V.append('line').attr("class", "guideLine");
runningLine_I_O = svgOverlay_I_O.append('line').attr("class", "guideLine");

        handleInputData(numsample, lineFunc1, lineFunc2, lineFunc3, lineFunc4, lineFunc5, lineFunc6,lineFuncI_O, phaseShift, update,updateOutput,updatePowerSC,
          updatePowerYC,
          updatePowerSI,
          updatePowerSCV,
          updatePowerPPV,
          updatePowerPPI,
          updatePowerPPZ,
          updatePowerZaids);

        d3.select("#svg1>p").remove();
        d3.select("#svg2>p").remove();
        d3.select("#svg3>p").remove();
        d3.select("#viz_polar>p").remove();      
        let dimension_I = document.getElementById("svg1_svg_y-axis").getBoundingClientRect().height;
        let dimension_V = document.getElementById("svg2_svg_y-axis").getBoundingClientRect().height;
        let dimension_I_O = dimension_V;
        let startPoint = null;
        let tempLine = null;    
        let tempLineStart = null;    
        let tempLineMove = null;    

         widthOverlay = document.getElementById("svg1_svg_x-axis").getBoundingClientRect().width;      

         function calculateDistance(start, end) {
          // Convert pixel coordinates to data domain
          const startX = start[0];
          const startY = start[1];
          const endX = end[0];
          const endY = end[1];
        
          // Calculate distance in data units
          return (endX - startX);
        }
        
        
        function displayDistance(distance) {
          console.log(`Distance: ${distance.toFixed(2)}`);
        } 

        svgOverlay.each(function() {
        
          d3.select(this)
            .append('rect') // append a rect element to each g
            .attr("y",-10)
            .attr('width', widthOverlay + 'px') // make it cover the whole g
            .attr('height', '100%')
            .style('opacity', 0); // make it transparent
            
        })
        .on("mousemove", (event) => {
          var container = event.currentTarget;
          var mousePosition = d3.pointer(event);
          
          const mergedContainer = document.getElementById("merged-svg-container");

          const hoveredIndex = Math.round(xScale.invert(mousePosition[0]));
          const hoveredDatumI = I_dataset[0].data[hoveredIndex];
          const hoveredDatumV = V_dataset[0].data[hoveredIndex];

          function updateVectors(hoveredIndex) {
            if (hoveredIndex < 0 || hoveredIndex >= VA_dataset.dataset.length) return;
            
            vectorsData.VA.x = VA_dataset.dataset[hoveredIndex][1];
            vectorsData.VA.y = VA_dataset.dataset[hoveredIndex][2];
        
            vectorsData.IA.x = IA_dataset.dataset[hoveredIndex][1];
            vectorsData.IA.y = IA_dataset.dataset[hoveredIndex][2];
        
            update();  // Ensures both sets of vectors get updated
        }

          P_Line.moveLine(hoveredIndex,updatePowerSC,
          updatePowerYC,
          updatePowerSI,
          updatePowerSCV,
          updatePowerPPV,
          updatePowerPPI,
          updatePowerPPZ,
          updatePowerZaids,update,vectorsData,IA_dataset,IB_dataset,IC_dataset,VA_dataset,VB_dataset,VC_dataset,ia,ib,ic,va,vb,vc);


          if (startPoint) {
            const point = d3.pointer(event);
            tempLine.attr('x2', point[0]).attr('y2', yScale(0)/2);
          
            d3.selectAll(".distanceText").remove();
            d3.selectAll(".distanceTextEnd").remove();
   
            svgOverlay.append('text') // Append text to the line
              .attr('x', startPoint[0] + (point[0] - startPoint[0]) /2) // x-coordinate of the text
              .attr('y', yScale(0)/2) // y-coordinate of the text
              .attr('fill',"white")
              .attr('class','distanceText')
              .text(''+ xScale.invert(calculateDistance(startPoint, point)).toFixed(0)+"ms");
           
            // Update the position of the line
            tempLineMove
              .attr('x1', point[0])
              .attr('y1', 0)
              .attr('x2', point[0])
              .attr('y2', yScale(0)*2)
              .attr("class","guideLine");          
          }
          
          d3.selectAll('.mylineIA-hovered-data-points').attr("fill","none");
          d3.selectAll('.mylineIB-hovered-data-points').attr("fill","none");
          d3.selectAll('.mylineIC-hovered-data-points').attr("fill","none");
          d3.selectAll('.mylineVA-hovered-data-points').attr("fill","none");
          d3.selectAll('.mylineVB-hovered-data-points').attr("fill","none");
          d3.selectAll('.mylineVC-hovered-data-points').attr("fill","none");
          d3.selectAll('.mylineI_O-hovered-data-points').attr("fill","none");       

          d3.select('#mylineIA-hovered-data-points-' + Math.round(xScale.invert(mousePosition[0]))).attr("fill","rgba(250,0,0,1");
          d3.select('#mylineIB-hovered-data-points-' + Math.round(xScale.invert(mousePosition[0]))).attr("fill","rgba(218, 165, 32,1");
          d3.select('#mylineIC-hovered-data-points-' + Math.round(xScale.invert(mousePosition[0]))).attr("fill","rgba(0,0,250,1");
if (mergedContainer.style.display === 'none')
          {
          d3.select('#svg2_svg #mylineVA-hovered-data-points-' + Math.round(xScale.invert(mousePosition[0]))).attr("fill","rgba(250,0,0,1");
          d3.select('#svg2_svg #mylineVB-hovered-data-points-' + Math.round(xScale.invert(mousePosition[0]))).attr("fill","rgba(218, 165, 32,1");
          d3.select('#svg2_svg #mylineVC-hovered-data-points-' + Math.round(xScale.invert(mousePosition[0]))).attr("fill","rgba(0,0,250,1");
          } else
          {
            d3.select('#mylineVA-hovered-data-points-' + Math.round(xScale.invert(mousePosition[0]))).attr("fill","rgba(250,0,0,1");
            d3.select('#mylineVB-hovered-data-points-' + Math.round(xScale.invert(mousePosition[0]))).attr("fill","rgba(218, 165, 32,1");
            d3.select('#mylineVC-hovered-data-points-' + Math.round(xScale.invert(mousePosition[0]))).attr("fill","rgba(0,0,250,1");
            };
          d3.selectAll('#mylineI_O-hovered-data-points-' + Math.round(xScale.invert(mousePosition[0]))).attr("fill","rgba(250, 130, 180,1");


          runningLine_I
              .attr('x1', mousePosition[0])
              .attr('y1', 0)
              .attr('x2', mousePosition[0])
              .attr('y2', dimension_I); 

              runningLine_V
              .attr('x1', mousePosition[0])
              .attr('y1', 0)
              .attr('x2', mousePosition[0])
              .attr('y2', dimension_V);   
              runningLine_I_O
              .attr('x1', mousePosition[0])
              .attr('y1', 0)
              .attr('x2', mousePosition[0])
              .attr('y2', dimension_I_O);      
                    
          // datum_I[0].value = IA_dataset.dataset[Math.round(xScale.invert(mousePosition[0]))][1];
        })

        svgOverlay
        .on('click', function(event) {
          const point = d3.pointer(event);
          if (!startPoint) {
            startPoint = point;
            
    // document.querySelectorAll('.guideLine').forEach(element => {
    //   element.parentNode.removeChild(element); // Ensures complete removal from the DOM
    // });
    d3.selectAll('#tempLine,#tempLineStart,#tempLineMove').remove();
            tempLine = svgOverlay.append('line') // Temporary line for visual guidance
               .attr('x1', startPoint[0])
               .attr('y1', yScale(0)/2)
               .attr('x2', startPoint[0])
               .attr('y2', yScale(0)/2)
               .attr('id','tempLine')
               .attr("class","guideLine");

              tempLineStart = svgOverlay.append('line')
            .attr('x1', startPoint[0])
            .attr('y1', 0)
            .attr('x2', startPoint[0])
            .attr('y2', yScale(0)*2)
               .attr('id','tempLineStart')
            .attr("class","guideLine");
            tempLineMove = svgOverlay.append('line')
            .attr('x1', startPoint[0])
            .attr('y1', 0)
            .attr('x2', startPoint[0])
               .attr('id','tempLineMove')
            .attr('y2', yScale(0)*2)
            .attr("class","guideLine");            
          } else {
            const endPoint = point;
            const distance = calculateDistance(startPoint, endPoint);
            svgOverlay.append('text') // Append text to the line
            .attr('x', startPoint[0] + (point[0] - startPoint[0]) /2) // x-coordinate of the text
            .attr('y', yScale(0)/2) // y-coordinate of the text
            .attr('fill',"white")
            .attr('class','distanceTextEnd')
            .text(''+ xScale.invert(calculateDistance(startPoint, point)).toFixed(0)+"ms");
         
            displayDistance(distance);
            startPoint = null; // Reset for next measurement
          }
        });

// Add a keydown event listener to the document
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') { // Check if the ESC key is pressed
    // Remove the temporary lines and any elements with specific classes/IDs
    d3.selectAll('#tempLine, #tempLineStart, #tempLineMove').remove();
    
    document.querySelectorAll('.distanceTextEnd').forEach(element => {
      element.parentNode.removeChild(element); // Ensures complete removal from the DOM
    });    
    document.querySelectorAll('.distanceText').forEach(element => {
      element.parentNode.removeChild(element); // Ensures complete removal from the DOM
    }); 
    document.querySelectorAll('.guideLine').forEach(element => {
      element.parentNode.removeChild(element); // Ensures complete removal from the DOM
    });

    // Reset startPoint if needed
  //  startPoint = null;
  }
});

legends(d3.select("#svg1_svg"));
legends(d3.select("#svg2_svg"));

// 1️⃣ Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const svgOverlays = d3.selectAll('#svg1_svg>g, #svg2_svg>g, #svg3_svg>g');
  let measuring = false;
  let startIdx = null;

  // 2️⃣ Create (and hide) the live-data list container
  const listContainer = document.createElement('div');
  listContainer.id = 'valueList';
  listContainer.hidden = true;
  listContainer.style.listStyle = 'none';
  document.getElementById('viz_polar').appendChild(listContainer);

const measure = { start: null };          // remembers the first click only

svgOverlays                              // ← PLURAL, whole collection
  .on('click.measure', function (e) {    // namespaced so you can unbind easily
    const idx = Math.round(xScale.invert(d3.pointer(e, this)[0]));

    // FIRST click ➜ set up measuring state
    if (measure.start == null) {
      measure.start = idx;
      measuring     = true;              // keeps your external flag intact
console.log('in toggle');

      // old DOM-toggling lines, unchanged
      document.getElementById('appendedPolar')
              .classList.toggle('hidden', true);
      listContainer.hidden = false;

      // start live updates on the overlay we actually clicked
      d3.select(this).on('mousemove.measure', onMove);
      return;                            // wait for the second click
    }

    // SECOND click ➜ calculate range, clean up, reset
    const [start, end] =
      idx < measure.start ? [idx, measure.start] : [measure.start, idx];

    measuring     = false;
    measure.start = null;                // auto-reset for next pair
    svgOverlays.on('mousemove.measure', null); // stop live updates

    updateValues(start, end);            // your own helper
  });

  // 4️⃣ Mouse-move handler: recalc on each move
  function onMove(e) {
    const currentIdx = Math.round(xScale.invert(d3.pointer(e)[0]));
    updateValues(startIdx, currentIdx);
  }

  // 5️⃣ Compute and render all five metrics
  function updateValues(i1, i2, f = 60, dt = 0.001) {
    const [start, end] = i1 < i2 ? [i1, i2] : [i2, i1];
    const N = end - start + 1;
    const segment = IA_dataset.dataset.slice(start, end + 1);
    const segmentA = IA_dataset.dataset.slice(start, end + 1);
    const segmentB = IB_dataset.dataset.slice(start, end + 1);
    const segmentC = IC_dataset.dataset.slice(start, end + 1);
    const R_Calc = parseFloat(R.value || 1);

    const samplesPerCycle = Math.round(1 / (f * dt));
    const cycles = N / samplesPerCycle;

    // === RMS, DC Offset, Energy (IA only) ===
    const rmsA = Math.sqrt(segmentA.reduce((s, [, i]) => s + i ** 2, 0) / N);
    const rmsB = Math.sqrt(segmentB.reduce((s, [, i]) => s + i ** 2, 0) / N);
    const rmsC = Math.sqrt(segmentC.reduce((s, [, i]) => s + i ** 2, 0) / N);
    const meanA = segmentA.reduce((s, [, i]) => s + i, 0) / N;
    const meanB = segmentB.reduce((s, [, i]) => s + i, 0) / N;
    const meanC = segmentC.reduce((s, [, i]) => s + i, 0) / N;
    const energy = segment.reduce((s, [, i]) => s + i ** 2 * R_Calc * dt, 0);

    // === Helpers ===
    const computeDFT = (samples) => {
      const ω = 2 * Math.PI * f;
      let real = 0, imag = 0;
      for (let n = 0; n < samples.length; n++) {
        real += samples[n] * Math.cos(ω * n * dt);
        imag += samples[n] * Math.sin(ω * n * dt);
      }
      return new Complex(2 * real / samples.length, 2 * imag / samples.length);
    };

    const sequenceComponents = (IA, IB, IC) => { 
      const I_3 = new Complex(3,0);
      const a = new Complex(-0.5, Math.sqrt(3) / 2);
      const a2 = new Complex(-0.5, -Math.sqrt(3) / 2);
      const I0 = IA.add(IB).add(IC).divide(I_3);
      const I1 = IA.add(a2.multiply(IB)).add(a.multiply(IC)).divide(I_3);
      const I2 = IA.add(a.multiply(IB)).add(a2.multiply(IC)).divide(I_3);
      console.log('I0, I1, I2',I0, I1, I2);
      
      return [I0, I1, I2];
    };

    // === Method 1: Full Window Sequence Components ===
    const getPhasorsFrom = (ds, s, e) => ds.dataset.slice(s, e + 1).map(([t, val]) => val);
    const IA_full = getPhasorsFrom(IA_dataset, start, end);
    const IB_full = getPhasorsFrom(IB_dataset, start, end);
    const IC_full = getPhasorsFrom(IC_dataset, start, end);

    const phA_full = computeDFT(IA_full);
    const phB_full = computeDFT(IB_full);
    const phC_full = computeDFT(IC_full);
    const [I0_full, I1_full, I2_full] = sequenceComponents(phA_full, phB_full, phC_full);
    const I2_I1_full = I1_full.abs() > 0 ? I2_full.abs() / I1_full.abs() : Infinity;

    // === Method 2: Midpoint 1-Cycle ===
    const mid = Math.floor((start + end) / 2);
    const half = Math.floor(samplesPerCycle / 2);
    const sMid = Math.max(mid - half, 0);
    const eMid = Math.min(mid + half, IA_dataset.dataset.length - 1);

    const phA_mid = computeDFT(getPhasorsFrom(IA_dataset, sMid, eMid));
    const phB_mid = computeDFT(getPhasorsFrom(IB_dataset, sMid, eMid));
    const phC_mid = computeDFT(getPhasorsFrom(IC_dataset, sMid, eMid));
    const [I0_mid, I1_mid, I2_mid] = sequenceComponents(phA_mid, phB_mid, phC_mid);
    const I2_I1_mid = I1_mid.abs() > 0 ? I2_mid.abs() / I1_mid.abs() : Infinity;

    // === Method 3: Sliding Window Max I2/I1 ===
    let maxRatio = 0;
    for (let i = start; i <= end - samplesPerCycle; i++) {
      const pa = computeDFT(getPhasorsFrom(IA_dataset, i, i + samplesPerCycle - 1));
      const pb = computeDFT(getPhasorsFrom(IB_dataset, i, i + samplesPerCycle - 1));
      const pc = computeDFT(getPhasorsFrom(IC_dataset, i, i + samplesPerCycle - 1));
      const [, I1, I2] = sequenceComponents(pa, pb, pc);
      const ratio = I1.abs() > 0 ? I2.abs() / I1.abs() : 0;
      if (ratio > maxRatio) maxRatio = ratio;
    }

    // === Update Table ===
    listContainer.innerHTML = '';
    const table = document.createElement('table');
    table.id = 'valueListTable';


    const entries = {
      'Cycles': [cycles.toFixed(2), 'Number of cycles between selected markers.'],
      'RMS (IA)': [rmsA.toFixed(2), 'Root Mean Square of phase A over selected region.'],
      'RMS (IB)': [rmsB.toFixed(2), 'Root Mean Square of phase B over selected region.'],
      'RMS (IC)': [rmsC.toFixed(2), 'Root Mean Square of phase C over selected region.'],
      'DC Offset (IA)': [meanA.toFixed(2), 'Average (DC) value of IA over region.'],
      'DC Offset (IB)': [meanB.toFixed(2), 'Average (DC) value of IB over region.'],
      'DC Offset (IC)': [meanC.toFixed(2), 'Average (DC) value of IC over region.'],
      'Energy (IA)': [energy.toFixed(2), 'Energy dissipated in R ohms by IA over region.'],

      'Seq. 0 (Full Avg)': [I0_full.abs().toFixed(2), 'Zero-sequence current over entire window.'],
      'Seq. 1 (Full Avg)': [I1_full.abs().toFixed(2), 'Positive-sequence current over entire window.'],
      'Seq. 2 (Full Avg)': [I2_full.abs().toFixed(2), 'Negative-sequence current over entire window.'],
      'Unbalance (I2/I1 Full)': [I2_I1_full.toFixed(3), 'Ratio of negative to positive sequence over full region.'],

      'Seq. 1 (Midpoint)': [I1_mid.abs().toFixed(2), 'Positive-sequence at midpoint (1 cycle).'],
      'Unbalance (I2/I1 Mid)': [I2_I1_mid.toFixed(3), 'Ratio of I2/I1 at midpoint 1-cycle.'],

      'Max I2/I1 (Sliding)': [maxRatio.toFixed(3), 'Maximum I2/I1 ratio found in sliding 1-cycle windows.']
    };

    for (const [label, [val, tooltip]] of Object.entries(entries)) {
      const row = document.createElement('tr');
      const labelCell = document.createElement('td');
      const valueCell = document.createElement('td');
      labelCell.textContent = label;
      labelCell.title = tooltip;
      valueCell.textContent = val;
      valueCell.title = tooltip;
      labelCell.className = 'label-cell-inPolar';
      valueCell.className = 'value-cell-inPolar';
      row.appendChild(labelCell);
      row.appendChild(valueCell);
      table.appendChild(row);
    }

    listContainer.appendChild(table);
  }



  // 6️⃣ Abort on ESC: hide list, restore chart, remove listener
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' ) {
    measuring = false;

    document.getElementById('appendedPolar')
            .classList.toggle('hidden', false);
    listContainer.hidden = true;

    // remove *all* namespaced mouse-move handlers in one go
    svgOverlays.on('mousemove.measure', null);
    measure.start = null;    // if you used the helper object I suggested
  }
});
});

d3.select("#svg1_svg").node().getBoundingClientRect().width = plotWidth;
d3.select("#svg1_svg").node().getBoundingClientRect().height = plotHeight; 
function createSVG_withTwoYaxes() {
  d3.selectAll('#svg1_svg g path.mylineVA,#svg1_svg g path.mylineVB,#svg1_svg g path.mylineVC,#svg1_svg_y-axisRight').transition().duration(500).style("opacity","1");
}

function createSVG_forCurrentsOnly() {
  d3.selectAll('#svg1_svg g path.mylineVA,#svg1_svg g path.mylineVB,#svg1_svg g path.mylineVC,#svg1_svg_y-axisRight').transition().duration(500).style("opacity","0");
  document.getElementById("merged-svg-container").style.display = "none";
  document.getElementById("svg2").style.display = "block";
  document.getElementById("svg3").style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleZModeBtn = document.getElementById("toggleZMode");
  const svg2 = document.getElementById("svg2");
  const svg3 = document.getElementById("svg3");
  const mergedContainer = document.getElementById("merged-svg-container");

  // Use an explicit flag to track the current mode.
  let zModeActive = false;

  toggleZModeBtn.addEventListener("click", () => {
    if (!zModeActive) {
      // --- Activate Z Mode ---
      // Hide the separate SVG containers.
      svg2.style.display = "none";
      svg3.style.display = "none";

      // Call your helper function that prepares the merged view.
      createSVG_withTwoYaxes();

      // Show the merged container.
      mergedContainer.style.display = "flex";
      mergedContainer.style.justifyContent = 'center !important';

      // Remove any displayed extra elements and update the view.
      d3.selectAll('.zdisplayed').remove();
      
      faultType = updateOutput();
      IA_dataset = W_.generateDataset(numsample, I_peak_underFault, phaseShift.ia, true, POW, div, addsample, load, nominalVoltageSource, Z, Iac_rms, θ, XoverR_ratio, I_peak_underLoad,'A',θ_preFault);
      VA_dataset = W_.generateDataset(numsample, I_peak_underFault, phaseShift.va, false, POW, div, addsample, load, nominalVoltageSource, Z, Iac_rms, θ, XoverR_ratio, I_peak_underLoad,'A',θ_preFault);
      IB_dataset = W_.generateDataset(numsample, I_peak_underFault, phaseShift.ib, true, POW, div, addsample, load, nominalVoltageSource, Z, Iac_rms, θ, XoverR_ratio, I_peak_underLoad,'B',θ_preFault);
      IC_dataset = W_.generateDataset(numsample, I_peak_underFault, phaseShift.ic, true, POW, div, addsample, load, nominalVoltageSource, Z, Iac_rms, θ, XoverR_ratio, I_peak_underLoad,'C',θ_preFault);
      VB_dataset = W_.generateDataset(numsample, I_peak_underFault, phaseShift.vb, false, POW, div, addsample, load, nominalVoltageSource, Z, Iac_rms, θ, XoverR_ratio, I_peak_underLoad,'B',θ_preFault);
      VC_dataset = W_.generateDataset(numsample, I_peak_underFault, phaseShift.vc, false, POW, div, addsample, load, nominalVoltageSource, Z, Iac_rms, θ, XoverR_ratio, I_peak_underLoad,'C',θ_preFault);
            
      hideDiv(
        VA_dataset.dataset, IA_dataset.dataset,
        VB_dataset.dataset, IB_dataset.dataset,
        VC_dataset.dataset, IC_dataset.dataset,
        'noChange'
      );

      // Update the button text and style.
      toggleZModeBtn.textContent = "Close Z Mode";
      toggleZModeBtn.classList.add("active");

      zModeActive = true;
    } else {
      // --- Deactivate Z Mode ---
      mergedContainer.style.display = "none";
      svg2.style.display = "block";
      svg3.style.display = "block";

      // Call your helper function that resets the original (currents‑only) view.
      createSVG_forCurrentsOnly();

      // Update the button text and style.
      toggleZModeBtn.textContent = "Open Z Mode";
      toggleZModeBtn.classList.remove("active");

      zModeActive = false;
    }
  });
});

    let raisedIA = d3.select("#checkIA").raise()
    raisedIA.on("click", () => { 
      d3.selectAll(".mylineIA").attr("display", (d3.selectAll(".mylineIA").attr("display") === "none") ? "block" : "none")
      d3.selectAll(".vectorai").attr("display", (d3.selectAll(".vectorai").attr("display") === "none") ? "block" : "none")
      d3.selectAll(".textai").attr("display", (d3.selectAll(".textai").attr("display") === "none") ? "block" : "none")
      d3.select("#checkIA").attr("fill-opacity", (d3.select("#checkIA").attr("fill-opacity") === "0.1") ? "1" : "0.1")
    });
    let raisedIB = d3.select("#checkIB").raise()
    raisedIB.on("click", () => { 
      d3.selectAll(".mylineIB").attr("display", (d3.selectAll(".mylineIB").attr("display") === "none") ? "block" : "none")
      d3.selectAll(".vectorbi").attr("display", (d3.selectAll(".vectorbi").attr("display") === "none") ? "block" : "none")
      d3.selectAll(".textbi").attr("display", (d3.selectAll(".textbi").attr("display") === "none") ? "block" : "none")
      d3.select("#checkIB").attr("fill-opacity", (d3.select("#checkIB").attr("fill-opacity") === "0.1") ? "1" : "0.1")
    });
    let raisedIC = d3.select("#checkIC").raise()
    raisedIC.on("click", () => { 
      d3.selectAll(".mylineIC").attr("display", (d3.selectAll(".mylineIC").attr("display") === "none") ? "block" : "none")
      d3.selectAll(".vectorci").attr("display", (d3.selectAll(".vectorci").attr("display") === "none") ? "block" : "none")
      d3.selectAll(".textci").attr("display", (d3.selectAll(".textci").attr("display") === "none") ? "block" : "none")
      d3.select("#checkIC").attr("fill-opacity", (d3.select("#checkIC").attr("fill-opacity") === "0.1") ? "1" : "0.1")
    });
    let raisedVA = d3.select("#checkVA").raise()
    raisedVA.on("click", () => { 
      d3.selectAll(".mylineVA").attr("display", (d3.selectAll(".mylineVA").attr("display") === "none") ? "block" : "none")
      d3.selectAll(".vectora").attr("display", (d3.selectAll(".vectora").attr("display") === "none") ? "block" : "none")
      d3.selectAll(".texta").attr("display", (d3.selectAll(".texta").attr("display") === "none") ? "block" : "none")
      d3.select("#checkVA").attr("fill-opacity", (d3.select("#checkVA").attr("fill-opacity") === "0.1") ? "1" : "0.1")
    });
    let raisedVB = d3.select("#checkVB").raise()
    raisedVB.on("click", () => { 
      d3.selectAll(".mylineVB").attr("display", (d3.selectAll(".mylineVB").attr("display") === "none") ? "block" : "none")
      d3.selectAll(".vectorb").attr("display", (d3.selectAll(".vectorb").attr("display") === "none") ? "block" : "none")
      d3.selectAll(".textb").attr("display", (d3.selectAll(".textb").attr("display") === "none") ? "block" : "none")
      d3.select("#checkVB").attr("fill-opacity", (d3.select("#checkVB").attr("fill-opacity") === "0.1") ? "1" : "0.1")
    });
    let raisedVC = d3.select("#checkVC").raise()
    raisedVC.on("click", () => { 
      d3.selectAll(".mylineVC").attr("display", (d3.selectAll(".mylineVC").attr("display") === "none") ? "block" : "none")
      d3.selectAll(".vectorc").attr("display", (d3.selectAll(".vectorc").attr("display") === "none") ? "block" : "none")
      d3.selectAll(".textc").attr("display", (d3.selectAll(".textc").attr("display") === "none") ? "block" : "none")
      d3.select("#checkVC").attr("fill-opacity", (d3.select("#checkVC").attr("fill-opacity") === "0.1") ? "1" : "0.1")
    });
    let raisedRightVA = d3.select("#checkRightVA").raise()
    raisedRightVA.on("click", () => { 
      d3.selectAll(".mylineVA").attr("display", (d3.selectAll(".mylineVA").attr("display") === "none") ? "block" : "none")
      d3.selectAll(".vectora").attr("display", (d3.selectAll(".vectora").attr("display") === "none") ? "block" : "none")
      d3.selectAll(".texta").attr("display", (d3.selectAll(".texta").attr("display") === "none") ? "block" : "none")
      d3.select("#checkRightVA").attr("fill-opacity", (d3.select("#checkRightVA").attr("fill-opacity") === "0.1") ? "1" : "0.1")
    });
    let raisedRightVB = d3.select("#checkRightVB").raise()
    raisedRightVB.on("click", () => { 
      d3.selectAll(".mylineVB").attr("display", (d3.selectAll(".mylineVB").attr("display") === "none") ? "block" : "none")
      d3.selectAll(".vectorb").attr("display", (d3.selectAll(".vectorb").attr("display") === "none") ? "block" : "none")
      d3.selectAll(".textb").attr("display", (d3.selectAll(".textb").attr("display") === "none") ? "block" : "none")
      d3.select("#checkRightVB").attr("fill-opacity", (d3.select("#checkRightVB").attr("fill-opacity") === "0.1") ? "1" : "0.1")
    });
    let raisedRightVC = d3.select("#checkRightVC").raise()
    raisedRightVC.on("click", () => { 
      d3.selectAll(".mylineVC").attr("display", (d3.selectAll(".mylineVC").attr("display") === "none") ? "block" : "none")
      d3.selectAll(".vectorc").attr("display", (d3.selectAll(".vectorc").attr("display") === "none") ? "block" : "none")
      d3.selectAll(".textc").attr("display", (d3.selectAll(".textc").attr("display") === "none") ? "block" : "none")
      d3.select("#checkRightVC").attr("fill-opacity", (d3.select("#checkRightVC").attr("fill-opacity") === "0.1") ? "1" : "0.1")
    });

    document.addEventListener("DOMContentLoaded", () => {

setState();
      // // 1) Store element references
      // const svg1 = document.getElementById("svg1");
      // const svg2 = document.getElementById("svg2");
      // const svg3 = document.getElementById("svg3");
      // const mergedContainer = document.getElementById("merged-svg-container");
      // const scrollWrapper = document.getElementById("scrollWrapper");
    
      // const toggleZModeBtn = document.getElementById("toggleZMode");
      // const toggleHeaderButton = document.getElementById("toggle-header-button");
    
      // // 2) Define possible states
      // let currentState = "default"; 
      // // The page loads with #svg1, #svg2, #svg3 shown => so "default" is initial
    
      // // 3) Unified function to set the display for each state
      // function setState(newState) {
      //   // Hide/Show elements according to the new state
      //   if (newState === "default") {
        
      //     // Show #svg1, #svg2, #svg3
      //     svg1.style.display = "block";
      //     svg2.style.display = "block";
      //     svg3.style.display = "block";

      //     container.classList.add('default-mode');
      //     d3.selectAll('#svg1_svg g path.mylineVA,#svg1_svg g path.mylineVB,#svg1_svg g path.mylineVC,#svg1_svg_y-axisRight,.my-legend-circleRight,.legend-textRight').transition().duration(500).style("opacity","0");
      //     // Hide mosaic + impedance plane
      //     mergedContainer.style.display = "none";
      //     scrollWrapper.style.display = "none";
    
      //     // (Optional) Adjust button text or classes for returning to default
      //     toggleZModeBtn.textContent = "Open Z Mode";
      //     toggleZModeBtn.classList.remove("active");
    
      //   } else if (newState === "zplane") {
      //     // Show the impedance plane (#merged-svg-container) and #svg1
      //     svg1.style.display = "block";
      //     mergedContainer.style.display = "block";
    
      //     // Hide #svg2, #svg3, #scrollWrapper
      //     svg2.style.display = "none";
      //     svg3.style.display = "none";
      //     scrollWrapper.style.display = "none";
    
      //     // (Optional) Tweak the Z Mode button
      //     toggleZModeBtn.textContent = "Close Z Mode";
      //     toggleZModeBtn.classList.add("active");
    
      //     // Possibly call your "createSVG_withTwoYaxes()" 
      //     // or wave update logic right here if you want immediate creation:
      //     // createSVG_withTwoYaxes();
      //     container.classList.remove('default-mode');     
      //     d3.selectAll('#svg1_svg g path.mylineVA,#svg1_svg g path.mylineVB,#svg1_svg g path.mylineVC,#svg1_svg_y-axisRight,.my-legend-circleRight,.legend-textRight').transition().duration(500).style("opacity","1");              
      //   } else if (newState === "mosaic") {
      //     // Show #svg1 and #scrollWrapper (the mosaic)
      //     svg1.style.display = "block";
      //     scrollWrapper.style.display = "block";
    
      //     // Hide #svg2, #svg3, #merged-svg-container
      //     svg2.style.display = "none";
      //     svg3.style.display = "none";
      //     mergedContainer.style.display = "none";
    
      //     container.classList.remove('default-mode');    
      //     d3.selectAll('#svg1_svg g path.mylineVA,#svg1_svg g path.mylineVB,#svg1_svg g path.mylineVC,#svg1_svg_y-axisRight,.my-legend-circleRight,.legend-textRight').transition().duration(500).style("opacity","1");          
      //   }
    
      //   // 4) Update the global variable
      //   currentState = newState;
      // }
    
      // // 5) By default, we are in "default" state => show #svg2, #svg3
      // // If you want to ensure it on load:
      // setState("default");
    
      // // 6) Attach event listeners
    
      // // *** a) Z MODE BUTTON ***
      // toggleZModeBtn.addEventListener("click", () => {
      //   if (currentState === "default") {
      //     // From default => go to Z plane
      //     setState("zplane");
    
      //   } else if (currentState === "zplane") {
      //     // From zplane => go back to default
      //     setState("default");
    
      //   } else if (currentState === "mosaic") {
      //     // From mosaic => go to zplane
      //     setState("zplane");
      //   };
      //   console.log('currentState',currentState);
      
      // });
    
      // // *** b) HEADER BUTTON (MOSAIC) ***
      // toggleHeaderButton.addEventListener("click", () => {
      //   if (currentState === "default") {
      //     // From default => mosaic
      //     setState("mosaic");
    
      //   } else if (currentState === "mosaic") {
      //     // From mosaic => back to default
      //     setState("default");
    
      //   } else if (currentState === "zplane") {
      //     // From zplane => mosaic
      //     setState("mosaic");
      //   };
      // });
    });