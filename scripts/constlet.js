window.onerror = (a,b,c,d,e) => alert(e.stack);
const 
  $ = id => document.getElementById(id),
  canv = {
    static: $('static'),
    mobile: $('mobile'),
  },
  ctxs = {
    static: canv.static.getContext('2d'),
    mobile: canv.mobile.getContext('2d'),
  },
  gravityConstant = 0.3,
  ticksPerSecond = 60,
  secondsPerTick = 1 / ticksPerSecond,
  solids = [];
