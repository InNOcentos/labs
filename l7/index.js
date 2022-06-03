const Cart = require("./cartesian");
const Avl = require("./avl");
const fs = require("fs/promises");
const os = require("os");

class Main {
  async start() {
    for (let i = 10; i <= 18; i++) {
      await this.runTest(i);
    }
  }

  async runTest(multiplier) {
    for (let i = 0; i < 50; i++) {
      const values = this.generateElements(multiplier);

      const cartTree = new Cart();
      const avlTree = new Avl();

      for (let i = 0; i < values.length; i++) {
        cartTree.insert(values[i]);
        avlTree.insert(values[i]);
      }

      const valuesToInsert = Array.from({ length: 1000 }).map((e) =>
        Math.random()
      );
      let newValues = [...values, ...valuesToInsert];
      const valuesToDelete = Array.from({ length: 1000 }).map((e) => {
        return newValues.pop();
      });
      newValues = newValues.slice(0, 1000);

      // Вставка 1000 элементов
      const cartTreeInsertTime = this.measurePerformance(
        this.insertValues.bind(null, cartTree, valuesToInsert)
      );
      const avlTreeInsertTime = this.measurePerformance(
        this.insertValues.bind(null, avlTree, valuesToInsert)
      );

      // Удаление 1000 элементов
      const cartTreeDeleteTime = this.measurePerformance(
        this.deleteValues.bind(null, cartTree, valuesToDelete)
      );
      const avlTreeDeleteTime = this.measurePerformance(
        this.deleteValues.bind(null, avlTree, valuesToDelete)
      );

      // Поиск 1000 элементов
      const cartTreeSearchTime = this.measurePerformance(
        this.searchValues.bind(null, cartTree, newValues)
      );
      const avlTreeSearchTime = this.measurePerformance(
        this.searchValues.bind(null, avlTree, newValues)
      );

      const results = [
        `Cart insert 1000 elements time: ${cartTreeInsertTime} on militplier: ${multiplier}, i: ${i}`,
        `Avl insert 1000 elements time: ${avlTreeInsertTime} on militplier: ${multiplier}, i: ${i}`,
        `Cart delete 1000 elements time: ${cartTreeDeleteTime} on militplier: ${multiplier}, i: ${i}`,
        `Avl delete 1000 elements time: ${avlTreeDeleteTime} on militplier: ${multiplier}, i: ${i}`,
        `Cart find 1000 elements time: ${cartTreeSearchTime} on militplier: ${multiplier}, i: ${i}`,
        `Avl find 1000 elements time: ${avlTreeSearchTime} on militplier: ${multiplier}, i: ${i}`,
      ];

      console.log(results);

      await this.commitResult(results);
    }
  }

  insertValues(tree, arr) {
    for (let i = 0; i < arr.length; i++) {
      tree.insert(arr[i]);
    }
  }

  deleteValues(tree, arr) {
    const newArr = [...arr];
    for (let i = 0; i < newArr.length; i++) {
      tree.delete(newArr.pop());
    }
  }

  searchValues(tree, arr) {
    for (let i = 0; i < arr.length; i++) {
      tree.search(arr[i]);
    }
  }

  measurePerformance(fn) {
    performance.mark("start");
    fn();
    performance.mark("end");
    performance.measure("diff", "start", "end");
    return performance.getEntriesByName("diff").pop().duration;
  }

  generateElements(multiplier) {
    const result = [];
    for (let i = 0; i < Math.pow(2, multiplier); i++) {
      result.push(Math.random());
    }

    return result;
  }

  async commitResult(values) {
    await fs
      .appendFile("result.txt", values.join(os.EOL) + os.EOL)
      .catch((err) => reject(err));
  }
}

const main = new Main();

main.start();
