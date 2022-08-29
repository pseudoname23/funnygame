const schmooves = {}, attacks = {};
class Ability {
  constructor(name, fn, isAttack, checkCondition) {
    isAttack ? (attacks[name] = this) : (schmooves[name] = this);
    this.fn = fn;
    this.checkCondition = checkCondition;
  }
}
class MoveAbility extends Ability {
  constructor(name, fn, condition) {
    super(name, fn, false, condition);
  }
}
class AtkAbility extends Ability {
  constructor(name, fn, condition) {
    super(name, fn, true, condition);
  }
}

new MoveAbility('walljump', function() {
  // this function will only be called if walljump is the player's move ability
  if (player.moveAbility.checkCondition()) {
    player._walljumpFlag = false;
    player.vy = jumpHeightToVelocity(player.stats.jumpHeight * 0.75);
    player.vx = player.canMoveLeft ? -4 : 4;
  }
}, function() {
  if (player.grounded || (player.canMoveRight == player.canMoveLeft)) {
    if (player.abilityReadyStates.movement) player.abilityReadyStates.movement = false;
    return false;
  }
  if (player._walljumpFlag) {
    player.abilityReadyStates.movement = true;
    return true;
  }
})