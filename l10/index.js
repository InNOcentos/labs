/* const probability = require("./probability");

class Player {
  static get combination() {
    let str = "";
    for (let i = 0; i <= 2; i++) {
      str += Math.round(Math.random());
    }

    return str;
  }
}

class Game {
  eage = 0;
  tail = 1;

  static run() {
    let p1 = Player.combination;
    let p2 = Player.combination;
    while (p1 === p2) {
      p2 = Player.combination;
    }

    let resStr = "";
    let matrixRes = [[`${p1}/${p2}`]];

    let idx = 0;
    while (true) {
      resStr += Math.round(Math.random());
      if (resStr.length >= 3) {
        let toCompare = resStr.slice(-3);
        const aProb = probability[p1][toCompare];
        const bProb = probability[p2][toCompare];
        matrixRes[0].push(toCompare);
        if (!matrixRes[idx + 1]) matrixRes[idx + 1] = [];
        matrixRes[idx + 1].push(toCompare);
        matrixRes[idx + 1][idx] = aProb;
        console.log(p1);
        if (p1 === resStr || p2 === resStr) return matrixRes;
      }
      idx++;
    }
  }

  saveToFile() {}
}

console.table(Game.run()); */
function rndFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class Main {
  maxStonesCount = 20;
  maxStoneWeight = 10000;

  run() {
    const stonesCount = rndFromInterval(1, this.maxStonesCount);
    let stones = Array.from({ length: stonesCount }).map((_) => rndFromInterval(1, this.maxStoneWeight));
    let val = stones.map((e) => rndFromInterval(3, 50));

    /*     stones = [3, 4, 5, 8, 9];
    val = [1, 6, 4, 7, 6]; */

    const totalWeight = stones.reduce((acc, e) => {
      return acc + e;
    }, 0);
    let knapSackWeight = totalWeight / 2;
    /*     knapSackWeight = 13; */

    const K = Array.from({ length: stones.length + 1 }).map((_) => [knapSackWeight + 1]);

    for (let i = 0; i <= stones.length; i++) {
      for (let w = 0; w <= knapSackWeight; w++) {
        if (i == 0 || w == 0) {
          K[i][w] = 0;
        } else if (stones[i - 1] <= w) {
          K[i][w] = Math.max(stones[i - 1] + K[i - 1][w - stones[i - 1]], K[i - 1][w]);
        } else {
          K[i][w] = K[i - 1][w];
        }
      }
    }

    let knapSackStones = [];
    let usedKnapSackWeight = 0;
    let idx = K[0].length - 1;
    for (let i = K.length; i >= 0; i--) {
      if (typeof K[i - 2] !== 'undefined' && K[i - 1][idx] !== K[i - 2][idx]) {
        usedKnapSackWeight += stones[i - 2];
        idx = knapSackWeight - usedKnapSackWeight - 1;
        knapSackStones.push(stones[i - 2]);
      }
    }

    return {
      total: totalWeight,
      sumOfFirstKnapSack: knapSackStones.reduce((acc, e) => {
        return acc + e;
      }, 0),
      diff: usedKnapSackWeight === knapSackWeight ? 0 : (knapSackWeight - usedKnapSackWeight) * 2,
      stones: knapSackStones,
    };
  }
}

const a = new Main().run();
console.log(a);
