// var crypto = require("crypto");
const RIPEMD160 = require("./ripemd160");

function rndFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

String.prototype.replaceAt = function (index, replacement, skipIdx = 1) {
  if (index >= this.length) {
    return this.valueOf();
  }

  return (
    this.substring(0, index) + replacement + this.substring(index + skipIdx)
  );
};

class Main {
  hashes = {};
  diffValue = [1, 2, 4, 8, 16];
  strLength = 128;
  strCount = 3;

  get alphabet() {
    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    return alpha.map((x) => String.fromCharCode(x).toLocaleLowerCase());
  }

  runC() {
    const strLengths = [64, 128, 256, 512, 1024, 2048, 4096, 8192];
    const res = {};

    for (let i = 0; i < strLengths.length; i++) {
      let str = "";

      for (let k = 0; k < strLengths[i]; k++) {
        str += this.alphabet[rndFromInterval(0, this.alphabet.length - 1)];
      }

      const diffResults = [];
      for (let j = 0; j < 1000; j++) {
        performance.mark("start");
        let shasum = new RIPEMD160();
        let hash = shasum.update(str).digest("hex");
        performance.mark("end");
        const measure = performance.measure("diff", "start", "end");
        const diff = performance.getEntriesByName("diff").pop().duration;
        diffResults.push(diff);
      }
      res[strLengths[i]] =
        diffResults.reduce((acc, res) => acc + res) / diffResults.length;
    }

    console.log(res);
  }

  runB() {
    for (let i = 2; i <= 6; i++) {
      const hashes = [];

      for (let j = 0; j < Math.pow(10, i); j++) {
        let str = "";

        for (let i = 0; i < 256; i++) {
          str += this.alphabet[rndFromInterval(0, this.alphabet.length - 1)];
        }

        let shasum = new RIPEMD160();
        let hash = shasum.update(str).digest("hex");
        hashes.push(hash);
      }

      const hL = hashes.length;
      const hU = new Set([...hashes]).size;
      console.log("hashes total: ", hL);
      console.log("hashes unique: ", hU);
      console.log("diff: ", hL - hU);
    }
  }

  runA() {
    // ?????????????? ???????????? - 128 ?????????????????? ????????????????
    let str = "";
    for (let i = 0; i < this.strLength; i++) {
      str += this.alphabet[rndFromInterval(0, this.alphabet.length - 1)];
    }

    // ???????????? ???????????????? - ?????????? ???????????????????? ?????????? ???????????????? ?? ????????????
    for (let j = 0; j < this.diffValue.length; j++) {
      let hashes = [];

      // ?????????? ?????????????????? strCount (3) ??????????
      for (let i = 0; i < this.strCount; i++) {
        let shasum = new RIPEMD160();
        let replacedStr = "";

        // diffValue[j] ??????????
        for (let k = 0; k < this.diffValue[j]; k++) {
          //???????????? ?? ??????????
          //let newLetters = '';
          //Array.from({ length: this.diffValue[j] }).forEach((_) => {
          //newLetters += this.alphabet[rndFromInterval(0, this.alphabet.length - 1)];
          //});
          //replacedStr = str.replaceAt(str.length - this.diffValue[j], newLetters, this.diffValue[j]);

          // ???????????? ?? ?????????????????? ??????????
          for (let i = 0; i < this.diffValue[j]; i++) {
            replacedStr = str.replaceAt(
              rndFromInterval(0, str.length - 1),
              this.alphabet[rndFromInterval(0, this.alphabet.length - 1)]
            );
          }
        }

        let hash = shasum.update(replacedStr).digest("hex");
        hashes.push(hash);
      }

      this.hashes[this.diffValue[j]] = hashes;
    }
  }

  compareA() {
    let results = {};
    for (let key in this.hashes) {
      const hashes = this.hashes[key];
      const symbols = [];

      for (let i = 0; i < hashes.length; i++) {
        for (let k = 0; k < hashes[i].length; k++) {
          symbols.push(hashes[i].split("").slice(k).join(""));
        }
      }

      console.log(symbols);

      results[key] = {
        max: 0,
      };

      // ?????????????????? ???? ???????????????????????? ???????????????? ?? ???????? ?????????? ???? ????????????
      symbols.forEach((pattern) => {
        let max = hashes.every((hash) => {
          return hash.match(pattern);
        });

        if (!max) return;

        if (results[key]["max"] <= pattern.length) {
          results[key]["max"] = pattern.length;
          results[key]["hashes"] = hashes;
          results[key]["pattern"] = pattern;
        }
      });
    }
    console.log(results);
  }
}

let a = new Main();

console.log("================ A ==============");
a.runA();
a.compareA();

console.log("================ C ==============");
a.runC();

console.log("================ B ==============");
a.runB();
