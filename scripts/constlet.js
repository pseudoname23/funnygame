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
  gravityConstant = 9.8,
  ticksPerSecond = 60,
  secondsPerTick = 1 / ticksPerSecond,
  solids = [];
