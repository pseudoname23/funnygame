onresize = ()=>{
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
onbeforeunload = ()=>1;

function start() {
  if (state !== states.MAIN_MENU) return;
  window.addEventListener('tick', updatePlayer);
  schmooves.walljump.equip();
  tick();
  $('main-menu').classList.add('hidden');
  state = states.IN_GAME;
  window.removeEventListener('keyup', _start);
}
function _start(ev) {
  if (ev.code === "Enter") start();
}

$('title-play-btn').addEventListener('pointerup', start);
addEventListener('keyup', _start);

function pauseUnpause() {
  if (state === states.IN_GAME) {
    state = states.PAUSED;
    $('pause-menu').classList.remove('hidden');
  } else if (state === states.PAUSED) {
    state = states.IN_GAME;
    $('pause-menu').classList.add('hidden');
  }
}
new BindableFunction('pauseContinue', false, pauseUnpause).bind('Escape');
$('pause-continue-btn').addEventListener('pointerup', pauseUnpause);
// todo: split pauseUnpause() into pause() and exitMenu()