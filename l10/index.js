function rndFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class Main {
  maxStonesCount = 20;
  maxStoneWeight = 100;

  run() {
    // количество камней - случайное до 20
    const stonesCount = rndFromInterval(1, this.maxStonesCount);
    // массив с камнями (веса)
    let stones = Array.from({ length: stonesCount }).map((_) =>
      rndFromInterval(1, this.maxStoneWeight)
    );

    console.log("Все камни:  ", stones);
    console.log("Всего камней:  ", stones.length);

    // общий вес
    const totalWeight = stones.reduce((acc, e) => {
      return acc + e;
    }, 0);
    let knapSackWeight = Math.floor(totalWeight / 2);

    const K = Array.from({ length: stones.length + 1 }).map((_) => [
      knapSackWeight + 1,
    ]);

    for (let i = 0; i <= stones.length; i++) {
      for (let w = 0; w <= knapSackWeight; w++) {
        if (i == 0 || w == 0) {
          K[i][w] = 0;
        } else if (stones[i - 1] <= w) {
          K[i][w] = Math.max(
            stones[i - 1] + K[i - 1][w - stones[i - 1]],
            K[i - 1][w]
          );
        } else {
          K[i][w] = K[i - 1][w];
        }
      }
    }

    let knapSackStones = [];
    let usedKnapSackWeight = 0;
    let idx = K[0].length - 1;
    for (let i = K.length; i >= 0; i--) {
      if (typeof K[i - 2] !== "undefined" && K[i - 1][idx] !== K[i - 2][idx]) {
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
      diff:
        usedKnapSackWeight === knapSackWeight
          ? 0
          : (knapSackWeight - usedKnapSackWeight) * 2,
      stones: knapSackStones,
    };
  }
}

const a = new Main().run();
console.log(a);
