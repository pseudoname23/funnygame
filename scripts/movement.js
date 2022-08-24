new BindableFunction('jump', true, function(){
  if (!player.canJump) return;
  player.canJump = false;
  player.vy = jumpHeightToVelocity(player.stats.jumpHeight);
}).bind('Space');
