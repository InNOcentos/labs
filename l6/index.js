const Bst = require("./bst");
const Avl = require("./avl");
const fs = require("fs/promises");
const os = require("os");

class Main {
  randomNumbersMin = 1;
  randomNumbersMax = 10000;

  async run() {
    for (let i = 1; i <= 20; i++) {
      await this.execTest(i);
    }
  }

  measurePerformance(fn) {
    performance.mark("start");
    fn();
    performance.mark("end");
    performance.measure("diff", "start", "end");
    return performance.getEntriesByName("diff").pop().duration;
  }

  async execTest(series) {
    const [randomNumbersArr, sortedNumbersArr] = this.generateArrays(series);
    const elCount = randomNumbersArr.length;

    const insertionResults = [];
    const searchResults = [];
    const deletionResults = [];

    // работаем с массивом из чисел в случайном порядке и с отсортированным
    for (let i = 0; i < 20; i++) {
      let avlTree = new Avl();
      let bsTree = new Bst();

      // до i == 9 -> случайный порядок, i>= 10 -> отсортированный массив
      const selectedArray = i < 10 ? randomNumbersArr : sortedNumbersArr;
      const isSorted = i < 10 ? false : true;

      const selectedArrayAVL = [...selectedArray];
      const selectedArrayBST = [...selectedArray];

      // замеряем время на вставку avl
      performance.mark("start");
      for (let j = 0; j < selectedArrayAVL.length; j++) {
        avlTree.root = avlTree.insert(selectedArrayAVL[j]);
      }
      performance.mark("end");
      performance.measure("diff", "start", "end");
      const avlInsertionTime = performance
        .getEntriesByName("diff")
        .pop().duration;

      insertionResults.push(
        `AVL insertion time: series ${series}, i: ${i}, time: ${avlInsertionTime}}, IS_SORTED: ${isSorted}`
      );

      // замеряем время на поиск avl
      performance.mark("start");
      for (let j = 0; j < 1000; j++) {
        const rndElement =
          selectedArrayAVL[
            this.getRandomNumberFromInterval(0, selectedArrayAVL.length - 1)
          ];

        avlTree.search(avlTree.root, rndElement);
      }
      performance.mark("end");
      performance.measure("diff", "start", "end");
      const avlSearchTime = performance.getEntriesByName("diff").pop().duration;
      const avlSearchTimeAvg = avlSearchTime / 1000;

      searchResults.push(
        `AVL search total time: series ${series}, i: ${i}, time: ${avlSearchTime}}, IS_SORTED: ${isSorted}`,
        `AVL search avg time: series ${series}, i: ${i}, time: ${avlSearchTimeAvg}}, IS_SORTED: ${isSorted}`
      );

      // замеряем время на удаление avl
      performance.mark("start");
      for (let j = 0; j < 1000; j++) {
        // удаляем с начала
        avlTree.delete(selectedArrayAVL.shift());
      }
      performance.mark("end");
      performance.measure("diff", "start", "end");
      const avlDeleteTime = performance.getEntriesByName("diff").pop().duration;
      const avlDeleteTimeAvg = avlSearchTime / 1000;
      deletionResults.push(
        `AVL delete total time: series ${series}, i: ${i}, time: ${avlDeleteTime}}, IS_SORTED: ${isSorted} `,
        `AVL delete avg time: series ${series}, i: ${i}, time: ${avlDeleteTimeAvg}}, IS_SORTED: ${isSorted}`
      );

      // замеряем время на вставку bst
      performance.mark("start");
      for (let j = 0; j < selectedArrayBST.length; j++) {
        bsTree.insert(selectedArrayBST[j]);
      }
      performance.mark("end");
      performance.measure("diff", "start", "end");
      const bstInsertionTime = performance
        .getEntriesByName("diff")
        .pop().duration;
      insertionResults.push(
        `BST insertion time: series ${series}, i: ${i}, time: ${bstInsertionTime}}, IS_SORTED: ${isSorted}`
      );

      // замеряем время на поиск bst
      performance.mark("start");
      for (let j = 0; j < 1000; j++) {
        const rndElement =
          selectedArrayBST[
            this.getRandomNumberFromInterval(0, selectedArrayBST.length - 1)
          ];

        bsTree.search(rndElement);
      }
      performance.mark("end");
      performance.measure("diff", "start", "end");
      const bstSearchTime = performance.getEntriesByName("diff").pop().duration;
      const bstSearchTimeAvg = bstSearchTime / 1000;

      searchResults.push(
        `BST search total time: series ${series}, i: ${i}, time: ${bstSearchTime}}, IS_SORTED: ${isSorted}`,
        `BST search avg time: series ${series}, i: ${i}, time: ${bstSearchTimeAvg}}, IS_SORTED: ${isSorted}`
      );

      // замеряем время на удаление bst
      performance.mark("start");
      for (let j = 0; j < 1000; j++) {
        bsTree.delete(selectedArrayBST.shift());
      }
      performance.mark("end");
      performance.measure("diff", "start", "end");
      const bstDeleteTime = performance.getEntriesByName("diff").pop().duration;
      const bstDeleteTimeAvg = bstSearchTime / 1000;
      deletionResults.push(
        `BST delete total time: series ${series}, i: ${i}, time: ${bstDeleteTime}}, IS_SORTED: ${isSorted}`,
        `BST delete avg time: series ${series}, i: ${i}, time: ${bstDeleteTimeAvg}}, IS_SORTED: ${isSorted}`
      );
    }

    await this.commitResult(["TOTAL ELEMENTS: ", elCount]);
    await this.commitResult(insertionResults);
    await this.commitResult(searchResults);
    await this.commitResult(deletionResults);
  }

  async commitResult(values) {
    await fs
      .appendFile("result.txt", values.join(os.EOL) + os.EOL)
      .catch((err) => reject(err));
  }

  generateArrays(seriesNumber) {
    let randomNumbersArr = [];
    let sortedNumbersArr = [];

    for (let i = 0; i < Math.pow(2, 10 + seriesNumber); i++) {
      const randomNumber = this.getRandomNumberFromInterval(
        this.randomNumbersMin,
        this.randomNumbersMax
      );

      randomNumbersArr.push(randomNumber);
      sortedNumbersArr.push(i);
    }

    return [randomNumbersArr, sortedNumbersArr];
  }

  getRandomNumberFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

const main = new Main();

main.run();
