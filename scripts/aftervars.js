onresize();
addEventListener('tick', updatePlayer);
const player = new Player(0, 0, 1, 1);
new SolidRect(-3, -1, 6, 2);

drawAll();
tick();
