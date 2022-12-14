const zoom = {
  kBasePPT: 25,
  factor: 1,
  PPT: 25,
  screenDimensions: {
    width: 0, height: 0
  },
  center: {
    x: 0,  y: 0
  },      
  screenBounds: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
};
let zoomChangedThisTick = false;
function computeScreenSidesInUnits() {
  zoomChangedThisTick = true;
  zoom.screenBounds.top = zoom.center.y + zoom.screenDimensions.height/2 / zoom.PPT;
  zoom.screenBounds.right = zoom.center.x + zoom.screenDimensions.width/2 / zoom.PPT;
  zoom.screenBounds.bottom = zoom.center.y - zoom.screenDimensions.height/2 / zoom.PPT;
  zoom.screenBounds.left = zoom.center.x - zoom.screenDimensions.width/2 / zoom.PPT;
}
function setPan(x, y) {
  zoom.center.x = x;
  zoom.center.y = y;
  computeScreenSidesInUnits();
}
function setZoom(factor) {
  zoom.factor = factor;
  zoom.PPT = zoom.kBasePPT * factor;
  computeScreenSidesInUnits();
}
function tileCoordToPixelCoord(tiles, isY) {
  if (isY) return -((tiles - zoom.screenBounds.top) * zoom.PPT);
  return (tiles - zoom.screenBounds.left) * zoom.PPT;
} // Soon(TM)
