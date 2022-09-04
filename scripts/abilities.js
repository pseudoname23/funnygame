/* ability args properties guide *//*
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
    this.name = args.name;
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
    return this;
  }

  dequip() {
    if (!this.equipped) return;
    this.equipped = false;
    player[this.slot] = null;
  }

  get ready() {
    return (player[this.cooldownProp] === 0) && this.condition();
  }

  bindable() {
    if (bindableFunctions[this.name]) return bindableFunctions[this.name];

    // BindableFunction.onDown will call Ability.onUse in the context of the BindableFunction
    // so we must introduce a wrapper function to correct it
    let safeOnUse = () => this.onUse.call(this);
    return new BindableFunction(
      this.name, this.repeat, safeOnUse
    )
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
}).bindable().bind('Space');