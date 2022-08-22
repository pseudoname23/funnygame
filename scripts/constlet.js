window.onerror = (a,b,c,d,e) => alert(e.stack);
const 
  $ = id => document.getElementById(id),
  canvas = $('game'),
  canvasCtx = canvas.getContext('2d'),
  gravityConstant = 0.3,
  ticksPerSecond = 60,
  secondsPerTick = 1 / ticksPerSecond,
  solids = [], platforms = [];
