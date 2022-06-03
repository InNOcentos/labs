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

  insert(tree, arr) {
    for (let el of arr) {
      tree.insert(el);
    }
  }

  deleteAVL(tree, arr) {
    for (let i = 0; i < 1000; i++) {
      tree.delete(arr.pop());
    }
  }

  deleteBST(tree, arr) {
    const root = tree.root;
    for (let i = 0; i < 1000; i++) {
      tree.delete(root, arr.pop());
    }
  }

  searchAvl(tree, el) {
    const root = tree.root;
    for (let i = 0; i < 1000; i++) {
      tree.search(root, el);
    }
  }

  searchBst(tree, el) {
    for (let i = 0; i < 1000; i++) {
      tree.search(el);
    }
  }

  async execTest(series) {
    function getRandomNumberFromInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    const insertionResults = [];
    const searchResults = [];
    const deletionResults = [];

    this.commitResult([`${Math.pow(2, 10 + series)} ЭЛЕМЕНТОВ:`]);

    const insertSorted = [];
    const insertUnsorted = [];
    const searchUnsorted = [];
    const searchSorted = [];
    const deleteSorted = [];
    const deleteUnsorted = [];

    // работаем с массивом из чисел в случайном порядке и с отсортированным
    for (let i = 0; i < 20; i++) {
      const [randomNumbersArr, sortedNumbersArr] = this.generateArrays(series);
      const elCount = randomNumbersArr.length;

      const avlTreeRandomArr = [...randomNumbersArr];
      const avlTreeSortedArr = [...sortedNumbersArr];
      const bstTreeRandomArr = [...randomNumbersArr];
      const bstTreeSortedArr = [...sortedNumbersArr];

      const isSortArrIdx = i > 9;

      let avlTreeRandom = new Avl();
      let bsTreeRandom = new Bst();

      let avlTreeSorted = new Avl();
      let bsTreeSorted = new Bst();

      console.log("insert");
      if (!isSortArrIdx) {
        const avlInsertRandomTime = this.measurePerformance(
          this.insert.bind(null, avlTreeRandom, avlTreeRandomArr)
        );
        const bstInsertRandomTime = this.measurePerformance(
          this.insert.bind(null, bsTreeRandom, bstTreeRandomArr)
        );
        insertUnsorted.push(
          `ВСТАВКА НЕСОРТИРОВАННЫЙ AST : ${avlInsertRandomTime}`,
          `ВСТАВКА НЕСОРТИРОВАННЫЙ BST : ${bstInsertRandomTime}`
        );
      } else {
        const avlInsertSortedTime = this.measurePerformance(
          this.insert.bind(null, avlTreeSorted, avlTreeSortedArr)
        );
        const bstInsertSortedTime = this.measurePerformance(
          this.insert.bind(null, bsTreeSorted, bstTreeSortedArr)
        );
        insertSorted.push(
          `ВСТАВКА СОРТИРОВАННЫЙ AST : ${avlInsertSortedTime}`,
          `ВСТАВКА СОРТИРОВАННЫЙ BST : ${bstInsertSortedTime}`
        );
      }

      console.log("search");
      if (!isSortArrIdx) {
        const rndElement = function (arr) {
          arr[getRandomNumberFromInterval(0, arr.length - 1)];
        };

        const avlSearchRandomTime = this.measurePerformance(
          this.searchAvl.bind(null, avlTreeRandom, rndElement(avlTreeRandomArr))
        );

        const bstSearchRandomTime = this.measurePerformance(
          this.searchBst.bind(null, bsTreeRandom, rndElement(bstTreeRandomArr))
        );

        searchUnsorted.push(
          `ПОИСК НЕСОРТИРОВАННЫЙ AST : ${avlSearchRandomTime}`,
          `ПОИСК НЕСОРТИРОВАННЫЙ BST : ${bstSearchRandomTime}`
        );
      } else {
        const rndElement = function (arr) {
          arr[getRandomNumberFromInterval(0, arr.length - 1)];
        };

        const avlSearchSortedTime = this.measurePerformance(
          this.searchAvl.bind(null, avlTreeSorted, rndElement(avlTreeSortedArr))
        );

        const bstSearchSortedTime = this.measurePerformance(
          this.searchBst.bind(null, bsTreeSorted, rndElement(bstTreeSortedArr))
        );
        searchSorted.push(
          `ПОИСК СОРТИРОВАННЫЙ AST : ${avlSearchSortedTime}`,
          `ПОИСК СОРТИРОВАННЫЙ BST : ${bstSearchSortedTime}`
        );
      }

      console.log("delete");
      if (!isSortArrIdx) {
        const avlDeleteRandomTime = this.measurePerformance(
          this.deleteAVL.bind(null, avlTreeRandom, avlTreeRandomArr)
        );
        const bstDeleteRandomTime = this.measurePerformance(
          this.deleteBST.bind(null, bsTreeRandom, bstTreeRandomArr)
        );
        deleteUnsorted.push(
          `УДАЛЕНИЕ НЕСОРТИРОВАННЫЙ AST : ${avlDeleteRandomTime}`,
          `УДАЛЕНИЕ НЕСОРТИРОВАННЫЙ BST : ${bstDeleteRandomTime}`
        );
      } else {
        const avlDeleteSortedTime = this.measurePerformance(
          this.deleteAVL.bind(null, avlTreeSorted, avlTreeSortedArr)
        );
        const bstDeleteSortedTime = this.measurePerformance(
          this.deleteBST.bind(null, bsTreeSorted, bstTreeSortedArr)
        );
        deleteSorted.push(
          `УДАЛЕНИЕ СОРТИРОВАННЫЙ AST : ${avlDeleteSortedTime}`,
          `УДАЛЕНИЕ СОРТИРОВАННЫЙ BST : ${bstDeleteSortedTime}`
        );
      }
    }

    //const insertSorted = [];
    //const insertUnsorted = [];
    //const searchUnsorted = [];
    //const searchSorted = [];
    //const deleteSorted = [];
    //const deleteUnsorted = [];

    await this.commitResult(insertUnsorted);
    await this.commitResult(insertSorted);
    await this.commitResult(searchUnsorted);
    await this.commitResult(searchSorted);
    await this.commitResult(deleteUnsorted);
    await this.commitResult(deleteSorted);
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
