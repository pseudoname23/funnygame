class Player {
  constructor (x, y, width, height) {
    this.rect = new MobileRect(x, y, width, height);
    this.vx = this.vy = 0;
    this.grounded = false;
    this.canJump = this.grounded;
    this.contacts = [];
    this.stats = {
      jumpHeight: 3,
      maxSpeed: 16,
      ticksToFullSpeed: 2 * ticksPerSecond,
      ticksToFullStop: 0.5 * ticksPerSecond
    }
  }

  draw() {
    // todo: replace w sprite
    this.rect.debugDraw(ctxs.mobile);
  }

  erase() {
    this.rect.erase(ctxs.mobile);
  }

  updatePosition() {
    this.rect.translate(this.vx/ticksPerSecond, this.vy/ticksPerSecond);
    if (!this.grounded) this.vy -= gravityConstant / ticksPerSecond;
    for (let c of this.contacts) {
      if (!this.rect.intersects(c)) {
        this.grounded = false; // Better verbose than buggy
        this.contacts.splice(this.contacts.indexOf(c), 1);
      }
    }
    for (let solid of solids) {
      if (this.rect.intersects(solid)) {
        if (this.contacts.indexOf(solid)==-1) {
          this.contacts.push(solid);
        }
        if (this.grounded) continue;
        if (this.rect.nearestSideOf(solid) == 'top') {
          this.grounded = true;
          this.vy = 0;
          this.canJump = true;
          this.rect.moveTo(this.rect.x, solid.y + solid.height - 0.00001)
        }
      }
    }
  }
}

function updatePlayer() {
  player.erase()
  player.updatePosition();
  player.draw();
}

function jumpHeightToVelocity(height) {
  return Math.sqrt(2 * Math.abs(gravityConstant) * height);
}
