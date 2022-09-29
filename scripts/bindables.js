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