onresize();
addEventListener('tick', updatePlayer);
const player = new Player(0, 0, 1, 1);
new SolidRect(-3, -4, 3.25, 2);

drawAll();
tick();
