function swap(arr, i, j) {
  let tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

export function shakeSort(arr) {
  let left = 0;
  let right = arr.length - 1;
  let hasSwapped = false;
  let loopIterationCount = 0;

  while (left < right) {
    loopIterationCount++;

    for (let i = left; i < right; i++) {
      if (arr[i] > arr[i + 1]) {
        swap(arr, i, i + 1);
        hasSwapped = true;
      }
    }

    right--;

    for (let i = right; i > left; i--) {
      if (arr[i] < arr[i - 1]) {
        swap(arr, i, i - 1);
        hasSwapped = true;
      }
    }
    left++;

    if (!hasSwapped) return { arr, loopIterationCount };

    hasSwapped = false;
  }
  return { arr, loopIterationCount };
}
