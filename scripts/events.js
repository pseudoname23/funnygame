function tick() {
  dispatchEvent(new CustomEvent('tick'));
  setTimeout(tick, secondsPerTick * 1000)
}
function onresize() {
  const pageRect = document.body.getClientRects()[0];
  zoom.screenDimensions.width = pageRect.width;
  zoom.screenDimensions.height = pageRect.height;
  for (let canvas of Object.values(canv)) {
    canvas.width = pageRect.width;
    canvas.height = pageRect.height;
  }
  computeScreenSidesInUnits();
  drawAll();
}
window.addEventListener('resize', onresize);
function mouseEventToEventCode(ev) {
  switch (ev.button) {
    case 0: return 'mouseLeft';
    case 1: return 'mouseWheel';
    case 2: return 'mouseRight';
  }
}
function doNothing() { }; // Do not remove
class ActiveKey {
  constructor(code, ctrl, alt, shift) {
    this.ctrl = ctrl;
    this.alt = alt;
    this.shift = shift;
    if (!activeKeys[code]) activeKeys[code] = this;
  }
}
class BindableFunction {
  constructor(name, allowRepeat, onDown, onUp = doNothing) {
    this.down = onDown;
    this.up = onUp;
    this.binding = null;
    this.allowRepeat = allowRepeat;
    bindableFunctions[name] = this;
  }
  bind(eventCode) {
    if (this.binding !== null) {
      if (confirm('This button is already bound. Replace binding?')) {
        bindings[eventCode].unbind();
      } else { return; }
    }
    bindings[eventCode] = this;
    this.binding = eventCode;
  }
  unbind() {
    bindings[this.binding] = undefined;
    this.binding = null;
  }
}
function onkeydown(ev) {
  if (!bindings[ev.code] || ev.repeat) return;
  if (!bindings[ev.code].allowRepeat) bindings[ev.code].down();
  new ActiveKey(ev.code, ev.ctrlKey, ev.altKey, ev.shiftKey);
}
function onkeyup(ev) {
  if (!bindings[ev.code]) return;
  bindings[ev.code].up();
  delete activeKeys[ev.code];
}
function onmousedown(ev) {
  const code = mouseEventToEventCode(ev);
  if (!bindings[code]) return;
  new ActiveKey(code, ev.ctrlKey, ev.altKey, ev.shiftKey)
}
function onmouseup(ev) {
  const code = mouseEventToEventCode(ev);
  if (!bindings[code]) return;
  bindings[code].up();
  delete activeKeys[code];
}
addEventListener('keydown', onkeydown);
addEventListener('keyup', onkeyup);
addEventListener('mousedown', onmousedown);
addEventListener('mouseup', onmouseup);
function repeatHeldKeys() {
  for (let key of Object.keys(activeKeys)) {
    if (bindings[key] && bindings[key].allowRepeat) bindings[key].down();
  }
}