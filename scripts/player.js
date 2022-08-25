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
  updatePosition() {
    this.rect.translate(this.vx / ticksPerSecond, this.vy / ticksPerSecond);
    for (let contact of this.contacts) {
      if (!this.rect.intersects(contact)) {
        let prevPosition = new MobileRect(
          this.rect.x - this.rect.lastTranslation[0],
          this.rect.y - this.rect.lastTranslation[1],
          this.rect.width, this.rect.height
        );
        switch (prevPosition.nearestSideOf(contact)) {
          case 'top': this.airborne = true; break;
          case 'left': this.canMoveRight = true; break;
          case 'right': this.canMoveLeft = true; break;
          case 'bottom': console.log('bonk'); break;
        }
        this.contacts.splice(this.contacts.indexOf(contact), 1);
      }
    }
    for (let solid of solids) {
      if (this.contacts.indexOf(solid) > -1) continue;
      if (this.rect.intersects(solid)) {
        if (this.contacts.indexOf(solid) == -1) {
          this.contacts.push(solid);
        }
        let nearestSide = this.rect.nearestSideOf(solid);
        if (nearestSide == 'top' && this.airborne) {
          this.grounded = true;
          this.airborneFromJump = this.airborne;
          this.vy = 0;
          this.rect.moveTo(this.rect.x, solid.y + solid.height - 0.00001);
        } else if (nearestSide == 'right' && this.canMoveLeft) {
          this.canMoveLeft = false;
          this.vx = 0;
          this.rect.moveTo(solid.x + solid.width - 0.00001, this.rect.y);
        } else if (nearestSide == 'left' && this.canMoveRight) {
          this.canMoveRight = false;
          this.vx = 0;
          this.rect.moveTo(solid.x - this.rect.width + 0.00001, this.rect.y);
        } else if (nearestSide == 'bottom') {
          this.vy = -2; // doonk
          this.rect.moveTo(this.rect.x, solid.y - this.rect.height);
        }
      }
    }
    if (this.airborne) this.vy -= gravityConstant / ticksPerSecond;
    if (this.movementState.holdLeft == this.movementState.holdRight) {
      if (Math.abs(this.vx) < this.decel) { this.vx = 0 } else {
        this.vx > 0 ? (this.vx -= this.decel) : (this.vx += this.decel);
      }
    } else {
      if (this.movementState.holdLeft && this.canMoveLeft) {
        if (this.vx > -this.stats.maxHoldSpeed) {
          this.vx -= this.vx > 0 ? (this.decel+this.accel) : this.accel;
        } else {
          this.vx = -this.stats.maxHoldSpeed
        }
      } else if (this.movementState.holdRight && this.canMoveRight) {
        if (this.vx < this.stats.maxHoldSpeed) {
          this.vx += this.vx<0 ? (this.decel+this.accel) : this.accel;
        } else { 
          this.vx = this.stats.maxHoldSpeed
         }
      }
    }
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
