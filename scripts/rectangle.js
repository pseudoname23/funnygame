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

  debugDraw(ctx) {
    ctx.strokeRect(
      tileCoordToPixelCoord(this.x, false),
      tileCoordToPixelCoord(this.y, true), 
      this.width * zoom.PPT, -this.height * zoom.PPT
    )
    ctx.save();
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(
      tileCoordToPixelCoord(this.center.x, false) - 2, 
      tileCoordToPixelCoord(this.center.y, true) - 2, 
      4, 4
    )
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(
      tileCoordToPixelCoord(this.x, false) - 2, 
      tileCoordToPixelCoord(this.y, true) - 2, 
      4, 4
    )
    ctx.restore();
  }

  erase(ctx) {
    ctx.clearRect(
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

  // I have no idea why I'm doing this 
  // but it might be important eventually
  // Update: this just saved my ass. Thanks, past me!
  saveTranslation(x, y) {
    this.lastTranslation[0] = x;
    this.lastTranslation[1] = y;
  }

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

  moveTo(x, y) {
    let dx, dy;
    dx = dy = 0;
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

  intersects(rect) {
    return (this.sides.bottom < rect.sides.top && rect.sides.bottom < this.sides.top)
        && (this.sides.left < rect.sides.right && rect.sides.left < this.sides.right)
  }

  nearestSideOf(rect) {
    const isVerticalAligned = 
          rect.sides.left < this.center.x && this.center.x < rect.sides.right;
    const isHorizontalAligned = 
          rect.sides.bottom < this.center.y && this.center.y < rect.sides.top;
    
    //alert(`${rect.sides.bottom} < ${this.center.y} && ${this.center.y} < ${rect.sides.top}`)

    if (isVerticalAligned && isHorizontalAligned) return 'inside';

    let isRightSide = Math.abs(rect.sides.left - this.center.x) > Math.abs(rect.sides.right - this.center.x);
    let isAbove = Math.abs(rect.sides.bottom - this.center.y) > Math.abs(rect.sides.top - this.center.y);

    if (!isVerticalAligned && !isHorizontalAligned) {
      const nearestCorner = [
        isRightSide ? rect.sides.right : rect.sides.left,
        isAbove ? rect.sides.top : rect.sides.bottom
      ];
      const angleToCorner = Math.atan2(
        this.center.y - nearestCorner[1], this.center.x - nearestCorner[0]
      ) * 180/Math.PI;
      if (-135 < angleToCorner && angleToCorner <= -45) return 'bottom';
      if (-45 < angleToCorner && angleToCorner <= 45) return 'right';
      if (45 < angleToCorner && angleToCorner <= 135) return 'top';
      return 'left';
    }

    if (isHorizontalAligned) return isRightSide ? 'right' : 'left';
    return isAbove ? 'top' : 'bottom';
  }

}

class SolidRect extends Rectangle {
  constructor(x,y,w,h) {
    super(x,y,w,h);
    solids.push(this);
  }
}

function eraseAll(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
function drawAll() {
  for(let s of solids) {
    s.debugDraw(ctxs.static);
  }
}
