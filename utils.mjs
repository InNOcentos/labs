export function getRandNum(min, max) {
  return Math.random() * (max - min) + min;
}

export function measurePerformance(fn) {
  performance.mark('start');
  fn();
  performance.mark('end');
  performance.measure('diff', 'start', 'end');
  return performance.getEntriesByName('diff').pop().duration;
}
