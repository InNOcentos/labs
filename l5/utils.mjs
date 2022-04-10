export function rndFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function measurePerformance(fn) {
  performance.mark("start");
  const result = fn();
  performance.mark("end");
  performance.measure("diff", "start", "end");
  return {
    result,
    time: performance.getEntriesByName("diff").pop().duration,
  };
}
