import { shakeSort } from './shakeSort.mjs';
import { promises as fs } from 'fs';
import { measurePerformance, getRandNum } from '../utils.mjs';
import os from 'os';

const options = {
  testCases: [1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000],
  testArrLength: 20,
  from: -1,
  to: 1,
};

class Main {
  async run() {
    const { testCases, testArrLength, from, to } = options;

    for (let testCase of testCases) {
      const result = [`==== ${testCase} ====`];
      let total = 0;

      for (let i = 0; i < testArrLength; i++) {
        let arr = this.genArr(testCase, from, to);
        const duration = measurePerformance(shakeSort.bind(null, arr));
        result.push(duration);
        total += duration;
      }

      result.push('average:~ ' + total.toFixed() / testArrLength);
      await this.commitResult(result);
      console.log('done: ', testCase);
    }
  }

  genArr(testCase, from, to) {
    const res = [];
    for (let i = 0; i < testCase; i++) {
      res.push(getRandNum(from, to));
    }
    return res;
  }

  async commitResult(values) {
    await fs.appendFile('result.txt', values.join(os.EOL) + os.EOL).catch((err) => reject(err));
  }
}

new Main().run();
