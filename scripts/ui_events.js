function onresize() {
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
addEventListener('resize', onresize);

function pauseUnpause() {
  if (state === states.IN_GAME) {
    state = states.PAUSED;
    $('pause-menu').classList.remove('hidden');
  } else if (state === states.PAUSED) {
    state = states.IN_GAME;
    $('pause-menu').classList.add('hidden');
  }
}
$('pause-continue-btn').addEventListener('pointerup', pauseUnpause);