class Player {
  constructor(x, y, width, height) {
    this.rect = new MobileRect(x, y, width, height);
    this.vx = this.vy = 0;
    this.movementState = {
      blockedOn: {
        bottom: false, // grounded if true, airborne if false
        left: false, // can move left if false
        right: false // can move right if false
      },
      holdRight: false,
      holdLeft: false,
      holdJump: false,
      airborneFromJump: false,
    }
    this.contacts = [];
    this.stats = {
      jumpHeight: 3,
      maxHoldSpeed: 16,
      ticksToMaxHoldSpeed: 2 * ticksPerSecond,
      ticksToGroundStop: 0.5 * ticksPerSecond,
      ticksToAirStop: 5 * ticksPerSecond,
    }
    this.moveAbility = schmooves.walljump;
    this.primaryAttack = undefined;
    this.secondaryAttack = undefined;
    this.abilityReadyStates = {
      movement: false,
      primary: false,
      secondary: false
    }
  }
  get airborne() { return !this.movementState.blockedOn.bottom };
  set airborne(bool) { this.movementState.blockedOn.bottom = !bool };
  get grounded() { return this.movementState.blockedOn.bottom };
  set grounded(bool) { this.movementState.blockedOn.bottom = bool };
  get canMoveRight() { return !this.movementState.blockedOn.right };
  set canMoveRight(bool) { this.movementState.blockedOn.right = !bool };
  get canMoveLeft() { return !this.movementState.blockedOn.left };
  set canMoveLeft(bool) { this.movementState.blockedOn.left = !bool };
  get decel() {
    return this.stats.maxHoldSpeed / (
      this.airborne ? this.stats.ticksToAirStop : this.stats.ticksToGroundStop
    );
  };
  get accel() { return this.stats.maxHoldSpeed / this.stats.ticksToMaxHoldSpeed };
  
  draw() { this.rect.debugDraw(ctxs.mobile) }
  erase() { this.rect.erase(ctxs.mobile) }

  onGrounded(solid){
    this.grounded = true;
    this.airborneFromJump = this.airborne;
    this.vy = 0;
    this.rect.moveTo(this.rect.x, solid.y + solid.height - 0.00001);
  }
  onAirborne(){
    this.airborne = true;
  }
  onTouchWall(solid, nearestSide){
    if(nearestSide == 'left') {
      this.canMoveRight = false;
      this.vx = 0;
      this.rect.moveTo(solid.x - this.rect.width + 0.00001, this.rect.y);
    } else {
      this.canMoveLeft = false;
      this.vx = 0;
      this.rect.moveTo(solid.x + solid.width - 0.00001, this.rect.y);
    }
  }
  onLeaveWall(dirToWall){
    if (dirToWall == 'left') {
      this.canMoveRight = true;
    } else {
      this.canMoveLeft = true;
    }
  }
  onBeforeBonk(solid) {
    this.vy = -2; // doonk
    this.rect.moveTo(this.rect.x, solid.y - this.rect.height);
  }
  onAfterBonk(){
    console.log('bonk');
  }
  onLoseContact(contact){
    let prevPosition = new MobileRect(
      this.rect.x - this.rect.lastTranslation[0],
      this.rect.y - this.rect.lastTranslation[1],
      this.rect.width, this.rect.height
    );
    switch (prevPosition.nearestSideOf(contact)) {
        case 'top': 
          this.onAirborne(); 
          break;
        case 'left': 
          this.onLeaveWall('left'); 
          break;
        case 'right': 
          this.onLeaveWall('right'); 
          break;
        case 'bottom': 
          this.onAfterBonk(); 
          break;
    }
    this.contacts.splice(this.contacts.indexOf(contact), 1);
  }
  onGainContact(solid) {
    this.contacts.push(solid);
    let nearestSide = this.rect.nearestSideOf(solid);
    if (nearestSide == 'top' && this.airborne) {
      this.onGrounded(solid);
    } else if (
      (nearestSide == 'right' && this.canMoveLeft) || (nearestSide == 'left' && this.canMoveRight)
    ) {
      this.onTouchWall(solid, nearestSide);
    } else if (nearestSide == 'bottom') {
      this.onBeforeBonk(solid);
    }
  }
  move() {
    if (this.airborne) this.vy -= gravityConstant / ticksPerSecond;
    if (this.movementState.holdLeft == this.movementState.holdRight) {
    // If neither or both directions are held, decelerate
      if (Math.abs(this.vx) < this.decel) { 
        this.vx = 0;
      } else {
        this.vx > 0 ? (this.vx -= this.decel) : (this.vx += this.decel);
      }
    } else {
      if (this.movementState.holdLeft && this.canMoveLeft) {
        if (this.vx > -this.stats.maxHoldSpeed) {
          this.vx -= this.vx > 0 ? this.decel+this.accel : this.accel;
        } else {
          this.vx = -this.stats.maxHoldSpeed;
        }
      } else if (this.movementState.holdRight && this.canMoveRight) {
        if (this.vx < this.stats.maxHoldSpeed) {
          this.vx += this.vx < 0 ? this.decel+this.accel : this.accel;
        } else { 
          this.vx = this.stats.maxHoldSpeed;
        }
      }
    }
  }
  updatePosition() {
    this.rect.translate(this.vx / ticksPerSecond, this.vy / ticksPerSecond);
    for (let contact of this.contacts) {
      if (!this.rect.intersects(contact)) this.onLoseContact(contact);
    }
    for (let solid of solids) {
      if (this.contacts.indexOf(solid) > -1) continue;
      if (this.rect.intersects(solid)) this.onGainContact(solid);
    }
    this.move();
  }
}
function updatePlayer() {
  player.erase();
  repeatHeldKeys();
  player.updatePosition();
  player.draw();
}
function jumpHeightToVelocity(height) {
  return Math.sqrt(2 * Math.abs(gravityConstant) * height);
}
