import * as C_ from "./ComplexOperatorAid.mjs";

var dist = function(va,p) {
    var x = va[0] - p[0];
    var y = va[1] - p[1];
    
    return Math.sqrt(x * x + y * y);
    };

var angle = function(va) {
    return Math.atan2(va[1],va[0]) *180/Math.PI;
    };

export let ps_ = function sequenceComponentsEndPoint(va,vb,vc,ia,ib,ic,po){
    function baseVectors(a,b,c,p){ 
      let aObj = {x:a[0] - p[0], y: a[1] - p[1]}, bObj = {x:b[0] - p[0], y: b[1] - p[1]}, cObj = {x:c[0] - p[0], y: c[1] - p[1]};
      let ampa = dist(a,po), ampb = dist(b,po), ampc = dist(c,po), anglea = angle(C_.objectToArrayFormatted(aObj)), angleb = angle(C_.objectToArrayFormatted(bObj)), anglec = angle(C_.objectToArrayFormatted(cObj)); 
          return {a:aObj,b:bObj,c:cObj,ampa:ampa,ampb:ampb,ampc:ampc,anglea:anglea,angleb:angleb,anglec:anglec}
    }
    function calculateSequenceComponents(ve,vs){
      if(Array.isArray(vs)){vs=vs[0]}
      let [v,v__,v_] = [ve, C_.complexMultiplication(C_.a2,ve), C_.complexMultiplication(C_.a,ve)]
    
      let [p_v,p_v__,p_v_] = [{x:v.x+vs.x,y: v.y+vs.y}, {x:v__.x+vs.x,y: v__.y+vs.y},{x:v_.x+vs.x,y: v_.y+vs.y}]
    
      return [p_v,p_v__,p_v_]
    }
  let vs = baseVectors(va,vb,vc,po)
  let is = baseVectors(ia,ib,ic,po)
  let vs123 = C_.multiplyMatrices(C_.matrix_abcTo123,[[vs.a,is.a],[vs.b,is.b],[vs.c,is.c]])

  return[
      calculateSequenceComponents(vs123[2][0],C_.allToObj([po]),"ps2"),
      calculateSequenceComponents(vs123[2][1],C_.allToObj([po]),"ps2i"),
      calculateSequenceComponents(vs123[1][0],C_.complexAdd(vs123[2][0],po),"ps1"),
      calculateSequenceComponents(vs123[1][1],C_.complexAdd(vs123[2][1],po),"ps1i"),
      calculateSequenceComponents(vs123[0][0],C_.complexAdd3(vs123[1][0],vs123[2][0],po),"ps0"),
      calculateSequenceComponents(vs123[0][1],C_.complexAdd3(vs123[1][1],vs123[2][1],po),"ps0i"),
      vs,
      is
    ]
}

export function generateDataset(numSample, I_peak_underFault, Φ, I_V, POW, div, addsample, load, Vnominal, Z, Iac_rms, θ, XoverR_ratio, I_peak_underLoad, phaseSelected, θ_preFault) {
  const dataset = [];
  let max = 0;

  function sin(angle) {
    return Math.sin(angle);
  }
  function cos(angle) {
    return Math.cos(angle);
  }
  function exp(x) {
    return Math.exp(x);
  }

  const t_fault = ((POW / (2 * Math.PI)) + 5) * 1000 / f; 
  let faultPhases = [];
  if (faultType === '1Ph') {
    faultPhases = [Z.faultedPhase]; // e.g. ['A']
  } else if (faultType === '2Ph' || faultType === '2PhGr') {
    faultPhases = Z.faultedPhase.split(''); // e.g. 'AB' -> ['A','B']
    
  } else if (faultType === '3Ph') {
    faultPhases = ['A', 'B', 'C'];
  }  
  
  const involvedInFault = faultPhases.includes(phaseSelected);
  
  for (let t = 0; t < numSample + addsample; t++) {
    const timeStamp = t;
    let Sin;
    let Cos;
    let I_O = 0;

    if (t < t_fault) {
    
      if (I_V) {
        Sin = I_peak_underLoad * sin(ω * t + Φ - θ_preFault);
        Cos = I_peak_underLoad * cos(ω * t + Φ - θ_preFault);
      } else {
        Sin = nominalVoltageSource * sin(ω * t + Φ) - I_peak_underLoad * Zs_complex_load.abs() * sin(ω * t + Φ - θ_preFault + θs);
        Cos = nominalVoltageSource * cos(ω * t + Φ) - I_peak_underLoad * Zs_complex_load.abs() * cos(ω * t + Φ - θ_preFault + θs);
      }
    } else {
      

      if (!involvedInFault) {
        if (I_V) {
          Sin = I_peak_underLoad * sin(ω * t + Φ - θ_preFault);
          Cos = I_peak_underLoad * cos(ω * t + Φ - θ_preFault);
        } else {
          Sin = nominalVoltageSource * sin(ω * t + Φ) - I_peak_underLoad * Zs_complex_load.abs() * sin(ω * t + Φ - θ_preFault + θs);
          Cos = nominalVoltageSource * cos(ω * t + Φ) - I_peak_underLoad * Zs_complex_load.abs() * cos(ω * t + Φ - θ_preFault + θs);
        }
      } else {
        const sinusUnderFault_AC = I_peak_underFault * sin(ω * t + Φ - θ);
        const sinusUnderFault_DC = -I_peak_underFault * sin(Φ - θ) * exp(-(t - t_fault) / (τ));
        const cosinusUnderFault_AC = I_peak_underFault * cos(ω * t + Φ - θ);
        const cosinusUnderFault_DC = -I_peak_underFault * cos(Φ - θ) * exp(-(t - t_fault) / (τ));

        // If voltage waveform
        if (I_V) {
          Sin = sinusUnderFault_AC + sinusUnderFault_DC;
          Cos = cosinusUnderFault_AC + cosinusUnderFault_DC;
        } else {
          Sin = nominalVoltageSource * sin(ω * t + Φ) 
                - (I_peak_underFault * sin(ω * t + Φ - θ + θs)) * Z.ZsModule 
                - sinusUnderFault_DC * Z.Zs.r;
          Cos = nominalVoltageSource * cos(ω * t + Φ) 
                - (I_peak_underFault * cos(ω * t + Φ - θ + θs)) * Z.ZsModule 
                - sinusUnderFault_DC * Z.Zs.r;
        }
        I_O = 5;
      }
    }

    const magnitude = Math.sqrt(Sin * Sin + Cos * Cos);
    if (magnitude > max) {
      max = magnitude;
    }
    dataset.push([timeStamp, Cos, Sin, I_O]);
  }

  return { dataset, max };
}


export function addLineWaveform(svg,dataset, lineClass,xScale,yScale, lineFunc) {
  
  const path = svg.append('path')
  .datum(dataset)
  .attr('class', lineClass)
  .attr('d', lineFunc(dataset))
    .attr('stroke-width', (lineClass!=="mylineI_O") ? 2 : 10)
    .attr('fill', 'none');

    return path;
    
}
