class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.center = {
      x: this.x + this.width/2,
      y: this.y + this.height/2
    };
    this.sides = {
      top: this.y,
      right: this.x + this.width,
      bottom: this.y + this.height,
      left: this.x
    }
  }

  get pixelatedX() {
    return this.x * zoom.PPU - (zoom.center.x * zoom.PPU - canvas.width / 2);
  }
  get pixelatedY() {
    return this.y * zoom.PPU - (zoom.center.y * zoom.PPU - canvas.height / 2);
  }

  // Draws the rectangle.
  // returns undefined
  draw() {
    canvasCtx.strokeRect(
      this.pixelatedX, this.pixelatedY, 
      this.width * zoom.PPU, -this.height * zoom.PPU
    )
  }

  // Labels the center of the rectangle in red.
  // returns undefined
  labelCenter(){
    canvasCtx.save();
    canvasCtx.fillStyle = '#FF0000';
    canvasCtx.fillRect(
      (this.center.x - zoom.sides.left) * zoom.PPU - 2, 
      (this.center.y - zoom.sides.top) * zoom.PPU - 2, 
      4, -4
    )
    canvasCtx.restore();
  }
  
  // Labels the stored position of the rectangle in blue.
  // returns undefined
  labelCoordinates(){
    canvasCtx.save();
    canvasCtx.fillStyle = '#0000FF';
    canvasCtx.fillRect(
      this.pixelatedX - 2, this.pixelatedY - 2, 4, -4
    )
    canvasCtx.restore();
  }

  // Erases the rectangle and a 3px margin around it.
  // returns undefined
  erase() {
    canvasCtx.clearRect(
      this.pixelatedX - 3, this.pixelatedY - 3, 
      this.width * zoom.PPU + 6, -this.height * zoom.PPU - 6
    )
  }
}




class MobileRect extends Rectangle {
  constructor(x,y,w,h) {
    super(x,y,w,h);
    this.lastTranslation = [null, null];
  }

  // Stores the most recent translation of the rectangle.
  // param [x, y]: Number
  // returns undefined
  saveTranslation(x, y) {
    this.lastTranslation[0] = x;
    this.lastTranslation[1] = y;
  }

  // Translates the position of the rectangle.
  // param [x, y]: Number
  // returns undefined
  translate(x, y) {
    if (x !== 0) {
      this.x += x;
      this.center.x += x;
      this.sides.right += x;
      this.sides.left += x;
    }
    if (y !== 0) {
      this.y += y;
      this.center.y += y;
      this.sides.top += y;
      this.sides.bottom += y;
    }
    this.saveTranslation(x, y);
  }

  // Moves the rectangle to the specified coordinates.
  // param [x, y]: Number
  // returns undefined
  moveTo(x, y) {
    let dx = dy = 0;
    if (this.x !== x) {
      dx = x - this.x;
      this.x += dx;
      this.center.x += dx;
      this.sides.right += dx;
      this.sides.left += dx;
    }
    if (this.y !== y) {
      dy = y - this.y;
      this.y += dy;
      this.center.y += dy;
      this.sides.top += dy;
      this.sides.bottom += dy;
    }
    this.saveTranslation(dx, dy);
  }
}
