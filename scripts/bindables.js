new BindableFunction('jump', true,
  function () {
    if (player.airborne || state !== states.IN_GAME) return;
    player.vy = jumpHeightToVelocity(player.stats.jumpHeight);
    player.airborneFromJump = true;
  }, function () {
    if (player.vy > 0 && player.airborneFromJump) player.vy /= 2;
    player.airborneFromJump = false;
  }
).bind('Space');

new BindableFunction('moveRight', false,
  function () {
    if (state !== states.IN_GAME) return;
    player.movementState.holdRight = true;
  }, function () {
    player.movementState.holdRight = false;
  }
).bind('KeyD');

new BindableFunction('moveLeft', false,
  function () {
    if (state !== states.IN_GAME) return;
    player.movementState.holdLeft = true;
  }, function () {
    player.movementState.holdLeft = false;
  }
).bind('KeyA');

new BindableFunction('pauseContinue', false, 
  function() {
    if (state === states.IN_GAME) {
      state = states.PAUSED;
      $('pause-menu').classList.remove('hidden');
    } else if (state === states.PAUSED) {
      state = states.IN_GAME;
      $('pause-menu').classList.add('hidden');
    }
  }
).bind('Escape');

$('pause-continue-btn').addEventListener('pointerup', bindableFunctions.pauseContinue.down);
