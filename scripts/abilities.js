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
  if (player.moveAbility.checkCondition()) {}
}, function() {
  if (player.abilityReadyStates.movement) return true;
  if (player.grounded) return false;
  if (player.canMoveRight == player.canMoveLeft) return false;
  if (player._walljumpFlag) 
})