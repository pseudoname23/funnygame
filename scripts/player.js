class Player {
  constructor (x, y, width, height) {
    this.rect = new MobileRect(x, y, width, height);
    this.vx = this.vy = 0;
    this.grounded = false;
  }

  // Draws and labels the player's internal rectangle.
  // returns undefined
  draw() {
    this.rect.draw();
    this.rect.labelCoordinates();
    this.rect.labelCenter();
  }

  // Erases the player's internal rectangle.
  // returns undefined
  erase() {
    this.rect.erase();
  }

  // Updates the player's position and velocity.
  // returns undefined
  updatePosition() {
    this.rect.translate(this.vx, this.vy);
    if (this.grounded) {
      this.vy = 0;
    } else {
      this.vy -= gravityConstant / ticksPerSecond;
    }
  }
}

// Updates the player's position and redraws the player accordingly.
// returns undefined
function updatePlayer() {
  player.erase()
  player.updatePosition();
  player.draw();
  //console.log(`${player.rect.y} tiles = ${tileCoordToPixelCoord(player.rect.y, true)} px`)
}
