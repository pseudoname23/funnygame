class Player {
  constructor (x, y, width, height) {
    this.rect = new MobileRect(x, y, width, height);
    this.vx = this.vy = 0;
    this.grounded = false;
  }

  draw() {
    this.rect.draw(ctxs.mobile);
    this.rect.labelCoordinates(ctxs.mobile);
    this.rect.labelCenter(ctxs.mobile);
  }

  erase() {
    this.rect.erase(ctxs.mobile);
  }

  updatePosition() {
    this.rect.translate(this.vx, this.vy);
    if (this.grounded) {
      this.vy = 0;
    } else {
      this.vy -= gravityConstant / ticksPerSecond;
    }
  }
}

function updatePlayer() {
  player.erase()
  player.updatePosition();
  player.draw();
}
