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

/* ability args req.s *//*
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

/* ability args minimal template *//*
{
  isAttack: true,
  name: 'theFunny',
  allowRepeat: true,
  onUse: () => {
    // function body...
  },
}
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
    this.isAttack = args.isAttack;
    this.equipped = false;
    this.repeat = args.allowRepeat;
    this.onUse = function() {
      if (!this.ready) return;
      args.onUse();
      player[this.cooldownProp] = this.cooldown;
    };
    this.condition = args.condition ?? unconditional;
    this.cooldown = args.cooldown ?? 0;
    this.onAirborne = args.onAirborne ?? doNothing;
    this.onGrounded = args.onGrounded ?? doNothing;
    this.onTouchWall = args.onTouchWall ?? doNothing;
    this.onLeaveWall = args.onLeaveWall ?? doNothing;
    this.onBeforeBonk = args.onBeforeBonk ?? doNothing;
    this.onAfterBonk = args.onAfterBonk ?? doNothing;
  }

  get slot() {
    if (!this.equipped) return null;
    if (!this.isAttack) return 'moveAbility';
    return player.primaryAttack == this ? 'primaryAttack' : 'secondaryAttack';
  }

  get cooldownProp() {
    switch(this.slot) {
      case null: return null;
      case 'moveAbility': return 'moveCooldown';
      case 'primaryAttack': return 'primaryCooldown';
      case 'secondaryAttack': return 'secondaryCooldown';
    }
  }

  equip(asPrimary) {
    if (this.equipped) return;
    this.equipped = true;

    if (!this.isAttack) {
      if (player.moveAbility != null) {
        player.moveAbility.dequip();
      } player.moveAbility = this;

    } else {
      if (asPrimary) {
        if (player.primaryAttack != null) {
          player.primaryAttack.dequip();
        } player.primaryAttack = this;

      } else {
        if (player.secondaryAttack != null) {
          player.secondaryAttack.dequip();
        } player.secondaryAttack = this;
      }
    }
  }

  dequip() {
    if (!this.equipped) return;
    this.equipped = false;
    player[this.slot] = null;
  }

  get ready() {
    return (player[this.cooldownProp] === 0) && this.condition();
  }
}

new Ability({
  isAttack: false,
  name: 'walljump',
  allowRepeat: false,
  onUse: () => {
    player._walljumpFlag = false;
    player.vy = jumpHeightToVelocity(player.stats.jumpHeight * 0.75);
    player.vx = player.canMoveLeft ? -4 : 4;
  },
  condition: () => {return (
    player._walljumpFlag && player.airborne && 
    (player.canMoveRight != player.canMoveLeft)
  )},
  onGrounded: () => {
    player._walljumpFlag = true;
  }
})