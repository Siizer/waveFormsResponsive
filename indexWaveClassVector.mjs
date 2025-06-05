import * as C_ from './ComplexOperatorAid.mjs';
var polyline = function(d) {
    d = C_.allToArray(d)
          return d.map(function(x) { return x.join(",");}).join(" ");
          };
export class Vector {
    constructor(svg, vectorSelector, textSelector, ps, vectorMarker, label, vec, v, amp, angle,r) {
      this.svg = svg;
      this.vectorSelector = vectorSelector;
      this.textSelector = textSelector;
      this.ps = ps;
      this.vectorMarker = vectorMarker;
      this.label = label;
      this.vec = vec;
      this.v = v;
      this.amp = amp;
      this.angle = angle;
      this.r = r;
    }

    draw(hasText, data,ps,r) {      
      let vector = this.svg.selectAll("polyline." + this.vectorSelector)
        .data(ps);

      vector.enter().append("polyline")
        .attr("class", this.vectorSelector)
        .merge(vector) 
        .attr("points", (d, i) => {
          const start = data[(i + 1) % 3];
          const end = d;
          const dx = end[0] - start[0];
          const dy = end[1] - start[1];
          const len = Math.sqrt(dx * dx + dy * dy);
          // Use the marker's effective length as the offset
          const markerOffset = 6; // Adjust based on your marker size (e.g., arrowSize or refX)
          const newEnd = len > 0 
            ? [end[0] - (dx / len * markerOffset), end[1] - (dy / len * markerOffset)]
            : end;
          return polyline([start, newEnd]);
        })
        .attr("marker-end", "url(#" + this.vectorMarker + ")");

        if (hasText && this.textSelector) {
          let text = this.svg.selectAll("text." + this.textSelector)
            .data(ps);
        
          text.enter().append("text")
            .attr("class", this.textSelector)
            .text((d) => this.label + " = " + (this.r.invert(d[0])).toFixed(0) + " "+ ((this.r.invert(d[1]))>0 ? "+j " : "-j ") + Math.abs(this.r.invert(d[1])).toFixed(0) + ' ' + (this.label.charAt(0).toUpperCase() === 'I' ? 'A' : 'V'));
        
          text
            .text((d) => this.label + " = " + this.r.invert(d[0]).toFixed(0) + " "+ ((this.r.invert(d[1]))>0 ? "+j " : "-j ") + Math.abs(this.r.invert(d[1])).toFixed(0) + ' ' + (this.label.charAt(0).toUpperCase() === 'I' ? 'A' : 'V'))
            .attr("font-size", "1rem")
            .attr("transform", (d) => {
              let textWidth = text.node().getBoundingClientRect().width;
              let textHeight = text.node().getBoundingClientRect().height;              
              let angle = Math.atan2(d[1], d[0]);
              let x = d[0] + textWidth / 2 * Math.cos(angle);
              let y = d[1] + textHeight / 2 * Math.sin(angle);
              return "translate(" + x + "," + y + ")";
            });
        }
        const that = this;
        const thatTextSelector = this.textSelector;
        const thatVectorSelector = this.vectorSelector;
        
        // Attach event listeners to polylines
        // d3.selectAll("polyline." + thatVectorSelector)
        //   .on("mouseover", function(event, d, i) {
        //     console.log('event:',event,"mouseover on polyline index:", i, 'd: ',d);
        //     d3.selectAll("text." + thatTextSelector)
        //       .style("display", "block");
        //   })
        //   .on("mouseout", function(event, d, i) {
        //     d3.selectAll("text." + thatTextSelector)
        //       .style("display", "none");
        //   });       
    };
  }