class Player {
  constructor (x, y, width, height) {
    this.rect = new MobileRect(x, y, width, height);
    this.vx = this.vy = 0;
    this.grounded = false;
    this.contacts = [];
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
    if (!this.grounded) this.vy -= gravityConstant / ticksPerSecond;
    for (let c of this.contacts) {
      if (!this.rect.intersects(c)) {
        this.grounded = false; // Better verbose than buggy
        this.contacts.splice(this.contacts.indexOf(c), 1);
      }
    }
    for (let s of solids) {
      if (this.rect.intersects(s)) {
        if (this.contacts.indexOf(s)==-1) {
          this.contacts.push(s);
        }
        if (this.grounded) continue;
        if (this.rect.nearestSideOf(s) == 'top') {
          this.grounded = true;
          this.vy = 0;
          this.rect.moveTo(this.rect.x, s.y+s.height-0.00001)
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

// temp
addEventListener('keydown', ()=>{
  player.vy += 0.2;
})