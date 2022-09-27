new SolidRect(-4.5, -8,   9, 2  );
new SolidRect(-6,   -4,   4, 0.5)
new SolidRect( 2,   -1.5, 4, 0.5)
new SolidRect(-6,    1,   4, 0.5)
new SolidRect( 2,    3.5, 4, 0.5)
new SolidRect(-15, -10, 31, 1.5)
onresize();
const player = new Player(-0.5, -0.5, 1, 1);

function start() {
  if (state !== states.MAIN_MENU) return;
  window.addEventListener('tick', updatePlayer);
  schmooves.walljump.equip();
  tick();
  $('main-menu').classList.add('hidden');
  state = states.IN_GAME;
}

$('title-play-btn').addEventListener('pointerup', start);
new BindableFunction('startGame', false, start).bind('Enter');
