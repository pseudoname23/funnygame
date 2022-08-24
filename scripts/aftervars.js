addEventListener('tick', updatePlayer);
const player = new Player(0, 0, 1, 1);
new SolidRect(-3, -4, 7, 3);
new SolidRect(4, -4, 2, 5.5);
onresize();
tick();
