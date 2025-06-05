// dragManager.js – Unified draggable module
const DragManager = (() => {
  // Map to store draggable elements.
  const draggables = new Map();

  // Initializes a draggable element.
  function initDraggable(element, callbacks = {}) {
    let state = { dragging: false, offsetX: 0, offsetY: 0 };
    // Proxy automatically updates style on property change.
    const stateProxy = new Proxy(state, {
      set(target, prop, value) {
        target[prop] = value;
        if (prop === "left" || prop === "top") {
          element.style.left = target.left + "px";
          element.style.top = target.top + "px";
        }
        return true;
      }
    });

    element.addEventListener("pointerdown", (e) => {
      // Ignore sliders or buttons.
      if (e.target.closest("input[type='range']") || e.target.closest("button")) return;
      stateProxy.dragging = true;
      stateProxy.offsetX = e.clientX - element.offsetLeft;
      stateProxy.offsetY = e.clientY - element.offsetTop;
      document.body.style.cursor = "grabbing";
      callbacks.onDragStart && callbacks.onDragStart(e);
      element.setPointerCapture(e.pointerId);
    });

    element.addEventListener("pointermove", (e) => {
      if (!stateProxy.dragging) return;
      const newX = e.clientX - stateProxy.offsetX;
      const newY = e.clientY - stateProxy.offsetY;
      stateProxy.left = newX;
      stateProxy.top = newY;
      callbacks.onDragMove && callbacks.onDragMove(e);
    });

    element.addEventListener("pointerup", (e) => {
      stateProxy.dragging = false;
      document.body.style.cursor = "";
      callbacks.onDragEnd && callbacks.onDragEnd(e);
      element.releasePointerCapture(e.pointerId);
    });
    return stateProxy;
  }

  // Unified function accepts multiple selectors.
  function makeDraggableUnified(selectors, callbacks = {}) {
    const elements = selectors.map(selector => document.querySelector(selector)).filter(el => el);
    elements.forEach(el => {
      if (el.id) {
        draggables.set(el.id, initDraggable(el, callbacks));
      }
    });
    return draggables;
  }

  return {
    makeDraggableUnified,
    draggables
  };
})();

export default DragManager;
