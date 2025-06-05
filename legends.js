// Example of a more dynamic, less repetitive approach:
export function legends(svg) {
    const circleSelectorRadius = 5;
    const circleY = 10;
    const translationObj = { C: 30, B: 60, A: 100 };
    const id = svg.attr('id');
    
    // Determine if this is an I-based legend or V-based legend
    const isCurrent = id.charAt(3) * 1 === 1; // e.g. "svg1"
    
    // Data structure for the phases
    const phases = [
      { phase: 'C', fill: 'var(--Cphase)', label: isCurrent ? 'IC' : 'VC' },
      { phase: 'B', fill: 'var(--Bphase)', label: isCurrent ? 'IB' : 'VB' },
      { phase: 'A', fill: 'var(--Aphase)', label: isCurrent ? 'IA' : 'VA' },
    ];
    const phasesRight = [
      { phase: 'C', fill: 'var(--Cphase)', label: 'VC' },
      { phase: 'B', fill: 'var(--Bphase)', label: 'VB' },
      { phase: 'A', fill: 'var(--Aphase)', label: 'VA' },
    ];
    
    // Loop through phases to append circle + text
    phases.forEach(({ phase, fill, label }) => {
      const cx = plotWidth - translationObj[phase];
      // Append the circle
      svg.append('circle')
        .attr('cx', cx)
        .attr('cy', circleY)
        .attr('fill', fill)
        .attr('stroke', fill)
        .attr('class', 'my-legend-circle')
        .attr('id', `check${label}`)
        .attr('r', circleSelectorRadius);
        
      // Append the text
      const textEl = svg.append('text')
        .attr('class', `legend-text text-${phase}`)
        .text(label)
        .style('fill', fill);
      
      // Get bounding box after text is rendered
      const { height } = textEl.node().getBBox(); 
      
      textEl.attr('transform', `translate(${cx + 3 * circleSelectorRadius}, ${circleY + height / 3})`);
    });

    if (id === 'svg1_svg' ) { phasesRight.forEach(({ phase, fill, label }) => {
      const cx = plotWidth - translationObj[phase] - 125;
      // Append the circle
      svg.append('circle')
        .attr('cx', cx)
        .attr('cy', circleY)
        .attr('fill', fill)
        .attr('stroke', fill)
        .attr('class', 'my-legend-circleRight')
        .attr('id', `checkRight${label}`)
        .attr('r', circleSelectorRadius);
        
      // Append the text
      const textEl = svg.append('text')
        .attr('class', `legend-textRight text-Right${phase}`)
        .text(label)
        .style('fill', fill);
      
      // Get bounding box after text is rendered
      const { height } = textEl.node().getBBox(); 
      
      textEl.attr('transform', `translate(${cx + 3 * circleSelectorRadius}, ${circleY + height / 3})`);
    }) 
  };
  }
  