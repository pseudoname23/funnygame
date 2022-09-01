/*class Ability {
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
})*/

/* ability args template *//*
// isAttack: Boolean
// name: String
// allowRepeat: Boolean
// onUse: Function=>void
// condition: Function=>Boolean (optional)
// cooldown: Number (optional: default = 0)
// onAirborne:   Function=>void (optional)
// onGrounded:   Function=>void (optional)
// onTouchWall:  Function=>void (optional)
// onLeaveWall:  Function=>void (optional)
// onBeforeBonk: Function=>void (optional)
// onAfterBonk:  Function=>void (optional)
*/
class Ability {
  constructor(args) {
    switch(true) {
      case args.isAttack == undefined:
      case args.allowRepeat == undefined:
      case !args.name || !args.onUse:
        throw Error('Missing one or more mandatory arguments in Ability()');
    }
    args.isAttack ? (attacks[args.name] = this) : (schmooves[args.name] = this);
    this.repeat = args.allowRepeat;
    this.onUse = args.onUse;
    this.condition = args.condition ?? unconditional;
    this.cooldown = args.cooldown ?? 0;
    this.onAirborne = args.onAirborne ?? doNothing;
    this.onGrounded = args.onGrounded ?? doNothing;
    this.onTouchWall = args.onTouchWall ?? doNothing;
    this.onLeaveWall = args.onLeaveWall ?? doNothing;
    this.onBeforeBonk = args.onBeforeBonk ?? doNothing;
    this.onAfterBonk = args.onAfterBonk ?? doNothing;
  }
}