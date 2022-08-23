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
      top: this.y + this.height,
      right: this.x + this.width,
      bottom: this.y,
      left: this.x
    }
  }

  draw() {
    canvasCtx.strokeRect(
      tileCoordToPixelCoord(this.x, false),
      tileCoordToPixelCoord(this.y, true), 
      this.width * zoom.PPT, -this.height * zoom.PPT
    )
  }

  labelCenter(){
    canvasCtx.save();
    canvasCtx.fillStyle = '#FF0000';
    canvasCtx.fillRect(
      tileCoordToPixelCoord(this.center.x, false) - 2, 
      tileCoordToPixelCoord(this.center.y, true) - 2, 
      4, 4
    )
    canvasCtx.restore();
  }
  
  labelCoordinates() {
    canvasCtx.save();
    canvasCtx.fillStyle = '#0000FF';
    canvasCtx.fillRect(
      tileCoordToPixelCoord(this.x, false) - 2, 
      tileCoordToPixelCoord(this.y, true) - 2, 
      4, 4
    )
    canvasCtx.restore();
  }

  erase() {
    canvasCtx.clearRect(
      tileCoordToPixelCoord(this.x, false) - 3, 
      tileCoordToPixelCoord(this.y, true) + 3, 
      this.width * zoom.PPT + 6, -this.height * zoom.PPT - 6
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

class SolidRect extends Rectangle {
  constructor(x,y,w,h) {
    super(x,y,w,h);
    solids.push(this);
  }
}

function eraseAll() {
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
}
function drawAll() {
  for(let s of solids) {
    s.draw();
    s.labelCoordinates();
    s.labelCenter();
  }
}
