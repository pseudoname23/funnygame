function tick() {
  dispatchEvent(new CustomEvent('tick'));
  setTimeout(tick, secondsPerTick * 10000)
}
