//import { measurePerformance } from '../utils.mjs';
const { measurePerformance } = require('./utils.js');

function merge(left, right) {
  let result = [];
  let leftIdx = 0;
  let rightIdx = 0;

  while (leftIdx < left.length && rightIdx < right.length) {
    if (left[leftIdx] < right[rightIdx]) {
      result.push(left[leftIdx]);
      leftIdx++;
    } else {
      result.push(right[rightIdx]);
      rightIdx++;
    }
  }
  return result.concat(left.slice(leftIdx)).concat(right.slice(rightIdx));
}

function mergeSort(array) {
  if (array.length === 1) {
    return array;
  }

  const middle = Math.floor(array.length / 2);
  const left = array.slice(0, middle);
  const right = array.slice(middle);

  return merge(mergeSort(left), mergeSort(right));
}

process.on('message', (msg) => {
  const { arr } = msg;
  const duration = measurePerformance(mergeSort.bind(null, arr));

  process.send({
    memUsage: process.memoryUsage().heapUsed,
    duration,
  });
});
