var createRingBuffer = function (length) {
  /* https://stackoverflow.com/a/4774081 */
  var pointer = 0,
    buffer = [];

  return {
    get: function (key) {
      if (key < 0) {
        return buffer[pointer + key];
      } else if (!key) {
        return buffer[pointer];
      } else {
        return buffer[key];
      }
    },
    push: function (item) {
      buffer[pointer] = item;
      pointer = (pointer + 1) % length;
      return item;
    },
    prev: function () {
      var tmp_pointer = (pointer - 1) % length;
      if (tmp_pointer === -1) tmp_pointer = buffer.length - 1;
      if (buffer[tmp_pointer]) {
        pointer = tmp_pointer;
        return buffer[pointer];
      }
    },
    next: function () {
      if (buffer[pointer]) {
        pointer = (pointer + 1) % length;
        return buffer[pointer];
      }
    },
  };
};

// Создать буфер из указанного количества элементов, заполнить его полностью случайными числами в диапазоне от 1 до 100, Дважды пройти по буферу из n элементов, каждый раз обращаясь к его следующему элементу. Замерить скорость работы метода получения данных из всех буферов (разной размерности)

function getRandomNumberFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class Main {
  tests = [1000, 10000, 100000, 1000000, 10000000, 100000000];

  run() {
    for (let i = 0; i < this.tests.length; i++) {
      const buffer = createRingBuffer();

      // Циклический буфер из tests[i] элементов
      for (let j = 0; j < this.tests[i]; j++) {
        buffer.push(this.getRandomNumberFromRange(1, 100));
      }

      performance.mark("start");
      for (let i = 0; i < this.tests[i] * 2; i++) {
        buffer.next();
      }
      performance.mark("end");
      performance.measure("diff", "start", "end");
      const time = performance.getEntriesByName("diff").pop().duration;

      console.log(this.tests[i], " elements: ", time);
    }
  }

  getRandomNumberFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  measurePerformance(fn) {
    performance.mark("start");
    fn();
    performance.mark("end");
    performance.measure("diff", "start", "end");
    return performance.getEntriesByName("diff").pop().duration;
  }
}

new Main().run();
