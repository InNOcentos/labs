function getRandNum(min, max) {
  return Math.random() * (max - min) + min;
}

function measurePerformance(fn) {
  performance.mark('start');
  fn();
  performance.mark('end');
  performance.measure('diff', 'start', 'end');
  return performance.getEntriesByName('diff').pop().duration;
}

module.exports = {
  measurePerformance,
  getRandNum,
};
