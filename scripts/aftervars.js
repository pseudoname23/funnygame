addEventListener('tick', updatePlayer);
const player = new Player(-0.5, -0.5, 1, 1);
new SolidRect(-4.5, -8,   9, 2  );
new SolidRect(-6,   -4,   4, 0.5)
new SolidRect( 2,   -1.5, 4, 0.5)
new SolidRect(-6,    1,   4, 0.5)
new SolidRect( 2,    3.5, 4, 0.5)
onresize();
tick();
