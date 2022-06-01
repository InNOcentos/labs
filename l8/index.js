const binomialHeap = require("./binomialHeap");
const binaryMax = require("./binaryHeapMax");
const fs = require("fs/promises");
const os = require("os");

class Main {
  findMin1000(heap) {
    for (let i = 0; i < 1000; i++) {
      heap.min();
    }
  }

  findMax1000(heap) {
    for (let i = 0; i < 1000; i++) {
      heap.min();
    }
  }

  deleteMin1000(heap) {
    for (let i = 0; i < 1000; i++) {
      heap.extractMin();
    }
  }

  deleteMax1000(heap) {
    for (let i = 0; i < 1000; i++) {
      heap.extractMax();
    }
  }

  addNew(heap, arr) {
    for (let i = 0; i < arr.length; i++) {
      heap.add(arr[i]);
    }
  }

  measurePerformance(fn) {
    performance.mark("start");
    fn();
    performance.mark("end");
    performance.measure("diff", "start", "end");
    return performance.getEntriesByName("diff").pop().duration;
  }

  async runA(multiplier, binomialHeap, binaryMaxHeap) {
    //заполняем кучу n элементами
    const elements = this.generateElements(multiplier);

    for (let element of elements) {
      binomialHeap.add(element);
      binaryMaxHeap.add(element);
    }

    const findMinTimeBinomial = this.measurePerformance(
      this.findMin1000(null, binomialHeap)
    );
    const findMinTimeBinary = this.measurePerformance(
      this.findMin1000(null, binaryMaxHeap)
    );
    const findMaxTimeBinomial = this.measurePerformance(
      this.findMax1000(null, binomialHeap)
    );
    const findMaxTimeBinary = this.measurePerformance(
      this.findMax1000(null, binaryMaxHeap)
    );

    const deleteMinTimeBinomial = this.measurePerformance(
      this.findMin1000(null, binomialHeap)
    );
    const deleteMinTimeBinary = this.measurePerformance(
      this.findMin1000(null, binaryMaxHeap)
    );
    const deleteMaxTimeBinomial = this.measurePerformance(
      this.findMin1000(null, binomialHeap)
    );
    const deleteMaxTimeBinary = this.measurePerformance(
      this.findMin1000(null, binaryMaxHeap)
    );

    const elementsToAdd = Array.from({ length: 1000 }).map((e) =>
      Math.random()
    );

    const addBinomial = this.measurePerformance(
      this.addNew(null, binomialHeap, elementsToAdd)
    );
    const addBinary = this.measurePerformance(
      this.addNew(null, binaryMaxHeap, elementsToAdd)
    );

    const results = [
      `Binomial find min x1000 elements time: ${findMinTimeBinomial} on militplier: ${multiplier}`,
      `Binary find min x1000 elements time: ${findMinTimeBinary} on militplier: ${multiplier}`,
      `Binomial find max x1000 elements time: ${findMaxTimeBinomial} on militplier: ${multiplier}`,
      `Binary find max x1000 elements time: ${findMaxTimeBinary} on militplier: ${multiplier}`,
      `Binomial delete min x1000 elements time: ${deleteMinTimeBinomial} on militplier: ${multiplier}`,
      `Binary delete min x1000 elements time: ${deleteMinTimeBinary} on militplier: ${multiplier}`,
      `Binomial delete max x1000 elements time: ${deleteMaxTimeBinomial} on militplier: ${multiplier}`,
      `Binary delete max x1000 elements time: ${deleteMaxTimeBinary} on militplier: ${multiplier}`,
      `Binomial ann new x1000 elements time: ${addBinomial} on militplier: ${multiplier}`,
      `Binary add new x1000 elements time: ${addBinary} on militplier: ${multiplier}`,
    ];

    console.log(results);

    await this.commitResult(results);
  }

  generateElements(multiplier) {
    const arr = [];
    for (let i = 0; i < Math.pow(10, multiplier); i++) {
      arr.push(i);
    }

    return arr;
  }

  async run() {
    for (let i = 3; i <= 7; i++) {
      const binoHeap = new binomialHeap();
      const binaryMaxHeap = new binaryMax();
      await this.runA(i, binoHeap, binaryMaxHeap);
    }
  }
}

new Main().run();
