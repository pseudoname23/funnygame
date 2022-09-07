new SolidRect(-4.5, -8,   9, 2  );
new SolidRect(-6,   -4,   4, 0.5)
new SolidRect( 2,   -1.5, 4, 0.5)
new SolidRect(-6,    1,   4, 0.5)
new SolidRect( 2,    3.5, 4, 0.5)
new SolidRect(-15, -10, 31, 1.5)
onresize();
const player = new Player(-0.5, -0.5, 1, 1);

function start() {
  window.addEventListener('tick', updatePlayer);
  schmooves.walljump.equip();
  tick();
  $('main-menu').classList.add('hidden');
}

$('play').addEventListener('pointerup', start);

function setPlayerName() {
  // `this` refers to the element `input#in-game-name`
  player.name = this.value;
}

$('in-game-name').addEventListener('input', setPlayerName);