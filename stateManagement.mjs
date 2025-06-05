export function setState() {

      // 1) Store element references
      const svg1 = document.getElementById("svg1");
      const svg2 = document.getElementById("svg2");
      const svg3 = document.getElementById("svg3");
      const mergedContainer = document.getElementById("merged-svg-container");
      const scrollWrapper = document.getElementById("scrollWrapper");
    
      const toggleZModeBtn = document.getElementById("toggleZMode");
      const toggleHeaderButton = document.getElementById("toggle-header-button");
    
      // 2) Define possible states
      let currentState = "default"; 
      // The page loads with #svg1, #svg2, #svg3 shown => so "default" is initial
    
      // 3) Unified function to set the display for each state
      function setNewState(newState) {
        // Hide/Show elements according to the new state
        if (newState === "default") {
        
          // Show #svg1, #svg2, #svg3
          svg1.style.display = "block";
          svg2.style.display = "block";
          svg3.style.display = "block";

          container.classList.add('default-mode');
          d3.selectAll('#svg1_svg g path.mylineVA,#svg1_svg g path.mylineVB,#svg1_svg g path.mylineVC,#svg1_svg_y-axisRight,.my-legend-circleRight,.legend-textRight').transition().duration(500).style("opacity","0");
          // Hide mosaic + impedance plane
          mergedContainer.style.display = "none";
          scrollWrapper.style.display = "none";
    
          // (Optional) Adjust button text or classes for returning to default
          toggleZModeBtn.textContent = "Open Z Mode";
          toggleZModeBtn.classList.remove("active");
    
        } else if (newState === "zplane") {
          // Show the impedance plane (#merged-svg-container) and #svg1
          svg1.style.display = "block";
          mergedContainer.style.display = "block";
    
          // Hide #svg2, #svg3, #scrollWrapper
          svg2.style.display = "none";
          svg3.style.display = "none";
          scrollWrapper.style.display = "none";
    
          // (Optional) Tweak the Z Mode button
          toggleZModeBtn.textContent = "Close Z Mode";
          toggleZModeBtn.classList.add("active");
    
          // Possibly call your "createSVG_withTwoYaxes()" 
          // or wave update logic right here if you want immediate creation:
          // createSVG_withTwoYaxes();
          container.classList.remove('default-mode');     
          d3.selectAll('#svg1_svg g path.mylineVA,#svg1_svg g path.mylineVB,#svg1_svg g path.mylineVC,#svg1_svg_y-axisRight,.my-legend-circleRight,.legend-textRight').transition().duration(500).style("opacity","1");              
        } else if (newState === "mosaic") {
          // Show #svg1 and #scrollWrapper (the mosaic)
          svg1.style.display = "block";
          scrollWrapper.style.display = "block";
    
          // Hide #svg2, #svg3, #merged-svg-container
          svg2.style.display = "none";
          svg3.style.display = "none";
          mergedContainer.style.display = "none";
    
          container.classList.remove('default-mode');    
          d3.selectAll('#svg1_svg g path.mylineVA,#svg1_svg g path.mylineVB,#svg1_svg g path.mylineVC,#svg1_svg_y-axisRight,.my-legend-circleRight,.legend-textRight').transition().duration(500).style("opacity","1");          
        }
    
        // 4) Update the global variable
        currentState = newState;
      }
    
      // 5) By default, we are in "default" state => show #svg2, #svg3
      // If you want to ensure it on load:
      setNewState("default");
    
      // 6) Attach event listeners
    
      // *** a) Z MODE BUTTON ***
      toggleZModeBtn.addEventListener("click", () => {
        if (currentState === "default") {
          // From default => go to Z plane
          setNewState("zplane");
    
        } else if (currentState === "zplane") {
          // From zplane => go back to default
          setNewState("default");
    
        } else if (currentState === "mosaic") {
          // From mosaic => go to zplane
          setNewState("zplane");
        };
        console.log('currentState',currentState);
      
      });
    
      // *** b) HEADER BUTTON (MOSAIC) ***
      toggleHeaderButton.addEventListener("click", () => {
        if (currentState === "default") {
          // From default => mosaic
          setNewState("mosaic");
    
        } else if (currentState === "mosaic") {
          // From mosaic => back to default
          setNewState("default");
    
        } else if (currentState === "zplane") {
          // From zplane => mosaic
          setNewState("mosaic");
        };
      });    

      return currentState;      

}