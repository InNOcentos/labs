export function rndFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function measurePerformance(fn) {
  performance.mark("start");
  fn();
  performance.mark("end");
  performance.measure("diff", "start", "end");
  return performance.getEntriesByName("diff").pop().duration;
}
