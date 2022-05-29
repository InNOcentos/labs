const { rndFromInterval, getRandomDate } = require("./utils");
const mockData = require("./mock-data");

class Node {
  constructor(val) {
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  push(val) {
    const node = new Node(val);
    if (this.length === 0) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this.length++;
    return this;
  }

  pop() {
    if (!this.head) {
      return undefined;
    }
    const deletedNode = this.tail;
    if (this.length === 1) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = deletedNode.prev;
      this.tail.next = null;
      deletedNode.prev = null;
    }
    this.length--;
    return deletedNode;
  }

  sortedInsert(head_ref, newNode) {
    var current;

    // if list is empty
    if (head_ref == null) head_ref = newNode;
    // if the node is to be inserted at the beginning
    // of the doubly linked list
    else if (head_ref.data >= newNode.data) {
      newNode.next = head_ref;
      newNode.next.prev = newNode;
      head_ref = newNode;
    } else {
      current = head_ref;

      // locate the node after which the new node
      // is to be inserted
      while (current.next != null && current.next.data < newNode.data)
        current = current.next;

      // Make the appropriate links /

      newNode.next = current.next;

      // if the new node is not inserted
      // at the end of the list
      if (current.next != null) newNode.next.prev = newNode;

      current.next = newNode;
      newNode.prev = current;
    }
    return head_ref;
  }

  insertionSort(head_ref) {
    // Initialize 'sorted' - a sorted doubly linked list
    var sorted = null;

    // Traverse the given doubly linked list and
    // insert every node to 'sorted'
    var current = head_ref;
    while (current != null) {
      // Store next for next iteration
      var next = current.next;

      // removing all the links so as to create 'current'
      // as a new node for insertion
      current.prev = current.next = null;

      // insert current in 'sorted' doubly linked list
      sorted = this.sortedInsert(sorted, current);

      // Update current
      current = next;
    }

    // Update head_ref to point to sorted doubly linked list
    head_ref = sorted;

    return head_ref;
  }

  shift() {
    if (!this.head) {
      return undefined;
    }
    const deletedNode = this.head;
    if (this.length === 1) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = deletedNode.next;
      this.head.prev = null;
      deletedNode.next = null;
    }
    this.length--;
    return deletedNode;
  }

  unshift(val) {
    const node = new Node(val);
    if (this.length === 0) {
      this.head = node;
      this.tail = node;
    } else {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    }
    this.length++;
    return this;
  }

  // O(N)
  get(idx) {
    if (idx < 0 || idx >= this.length) {
      return null;
    }

    let node = null;

    if (idx < this.length / 2) {
      node = this.head;
      for (let i = 0; i < idx; i++) {
        node = node.next;
      }
    } else {
      node = this.tail;
      for (let i = this.length - 1; i > idx; i--) {
        node = node.prev;
      }
    }

    return node;
  }

  set(idx, val) {
    const node = this.get(idx);
    if (node) {
      node.val = val;
      return true;
    }
    return false;
  }

  bubbleSort(start) {
    var swapped;
    var ptr1;
    var lptr = null;

    // Checking for empty list
    if (start == null) return null;

    do {
      swapped = 0;
      ptr1 = start;

      while (ptr1.next != lptr) {
        if (ptr1.val > ptr1.next.val) {
          var t = ptr1.val;
          ptr1.val = ptr1.next.val;
          ptr1.next.val = t;
          swapped = 1;
        }
        ptr1 = ptr1.next;
      }
      lptr = ptr1;
    } while (swapped != 0);
    return start;
  }

  reverse() {
    if (this.length <= 1) {
      return this;
    }

    let node = null;
    let prev = null;
    let next = null;
    let head = this.head;
    let tail = this.tail;

    for (let i = 0; i < this.length; i++) {
      if (i === 0) {
        node = this.head;
      }
      prev = node.prev;
      next = node.next;
      node.prev = next;
      node.next = prev;
      node = next;
    }

    this.head = tail;
    this.head.prev = null;
    this.tail = head;
    this.tail.next = null;

    return this;
  }

  reverseDLL(head) {
    let temp = null;
    let current = head;

    while (current) {
      temp = current.prev;
      current.prev = current.next;
      current.next = temp;
      current = current.prev;
    }

    if (temp != null) {
      head = temp.prev;
    }
  }

  // O(1)
  insert(idx, val) {
    if (idx === 0) {
      return !!this.unshift(val);
    }
    if (idx === this.length) {
      return !!this.push(val);
    }
    const previous = this.get(idx - 1); // 13
    if (!previous) {
      return false;
    }

    const next = previous.next; // 0
    const inserted = new Node(val); // (1)
    inserted.prev = previous; //
    inserted.next = next;
    next.prev = inserted;
    previous.next = inserted;
    this.length++;
    return next;
  }

  // O(1)
  remove(idx) {
    if (idx === 0) {
      return this.shift();
    }
    if (idx === this.length - 1) {
      return this.pop();
    }
    const removed = this.get(idx);
    if (!removed) {
      return undefined;
    }
    const next = removed.next;
    const prev = removed.prev;
    prev.next = next;
    next.prev = prev;
    removed.next = null;
    removed.prev = null;
    this.length--;
    return removed;
  }
}

class Main {
  A() {
    const numbers = [];
    for (let i = 0; i < 1000; i++) {
      numbers.push(rndFromInterval(-1000, 1000));
    }

    const list = new DoublyLinkedList();

    for (let number of numbers) {
      list.push(number);
    }

    return this.getIndicators(list.head);
  }

  getIndicators(node) {
    const res = {
      sum: 0,
      count: 0,
      avg: 0,
      min: 0,
      max: 0,
    };

    let current = node;

    while (current) {
      res.count++;
      if (res.max < current.val) {
        res.max = current.val;
      }
      if (res.min > current.val) {
        res.min = current.val;
      }

      res.sum += current.val;
      current = current.next;
    }

    res.avg = res.sum / res.count;

    return res;
  }

  // возможно переделать
  B() {
    let letters = ["a", "b", "c", "d", "e", "f", "g", "k", "m", "n"];

    const list = new DoublyLinkedList();
    const listArr = [];

    for (let i = 0; i < letters.length; i++) {
      listArr.push(letters[i]);
      list.push(letters[i]);
    }

    console.log("list arr: ", listArr);

    console.log(`Добавляем элемент по индексу 0 в конец: ${list.get(0).val}`);
    list.insert(letters.length, list.get(0).val);

    console.log(`Удаляем элемент по индексу 2: ${list.get(2).val}`);
    list.remove(2);

    console.log("Новый элемент в конце списка: ", list.tail.val);
    console.log("Новый элемент по индексу 2: ", list.get(2).val);

    const res = [];

    let current = list.head;
    while (current) {
      res.push(current.val);
      current = current.next;
    }

    console.log("результат: ", res);
  }

  C() {
    const list = new DoublyLinkedList();

    const { names, surnames, patronymic, birthDateRange } = mockData;

    for (let i = 0; i < 100; i++) {
      const data = {};
      data.name = names[rndFromInterval(0, names.length - 1)];
      data.surname = surnames[rndFromInterval(0, surnames.length - 1)];
      data.patronymic = patronymic[rndFromInterval(0, patronymic.length - 1)];
      data.date = getRandomDate(
        new Date(birthDateRange.from),
        new Date(birthDateRange.to)
      );

      list.push(data);
    }

    const currDate = Date.now();

    const under20 = new DoublyLinkedList();
    const older30 = new DoublyLinkedList();
    const others = new DoublyLinkedList();

    let current = list.head;
    while (current) {
      if (
        Math.abs(
          new Date(currDate - current.val.date).getUTCFullYear() - 1970
        ) < 20
      ) {
        under20.push(current.val);
      } else if (
        Math.abs(
          new Date(currDate - current.val.date).getUTCFullYear() - 1970
        ) > 30
      ) {
        older30.push(current.val);
      } else {
        others.push(current.val);
      }

      current = current.next;
    }

    let totalUnder20 = 0;
    let totalOlder30 = 0;
    let totalOthers = 0;

    current = under20.head;
    while (current) {
      totalUnder20 += 1;
      current = current.next;
    }

    current = older30.head;
    while (current) {
      totalOlder30 += 1;
      current = current.next;
    }

    current = others.head;
    while (current) {
      totalOthers += 1;
      current = current.next;
    }

    console.log("total: ", 100);
    console.log("under 20: ", totalUnder20);
    console.log("older 30: ", totalOlder30);
    console.log("others: ", totalOthers);
    console.log(
      `${totalUnder20} + ${totalOlder30} + ${totalOlder30} = 100: `,
      totalUnder20 + totalOlder30 + totalOthers === 100 ? true : false
    );
  }

  D() {
    const numbers = Array.from({ length: 1000 }).map((_) =>
      rndFromInterval(0, 100)
    );

    const list = new DoublyLinkedList();

    for (let number of numbers) {
      list.push(number);
    }

    const sortedList = list.bubbleSort(list.head);

    const sortedListArr = [];

    let current = sortedList;
    while (current) {
      sortedListArr.push(current.val);
      current = current.next;
    }

    const sortedNumbers = numbers.sort((a, b) => a - b);

    const arraysEqual = sortedNumbers.every((e, i) => {
      return sortedListArr[i] === e;
    });

    console.log(sortedListArr);
    console.log(sortedNumbers);
    console.log("arrays are equal: ", arraysEqual);

    return sortedList;
  }

  async E() {
    const list = new DoublyLinkedList();
    const listLength = 18;

    let listElements = [];
    for (let i = 0; i < listLength; i++) {
      listElements.push(i);
      list.push(i);
    }

    let min = 0;
    let max = list.length;

    while (Math.abs(max - min) !== 1) {
      if (min === max) break;
      list.insert(max, list.get(min).val);
      const elToInsert = list.get(max - 1);
      list.remove(max - 1);
      list.insert(min, elToInsert.val);
      list.remove(min + 1);
      min++;
      max--;
    }

    const reversedListElements = [];

    let current = list.head;
    while (current) {
      reversedListElements.push(current.val);
      current = current.next;
    }

    console.log("list elements: ", listElements);
    console.log("reversed list elements: ", reversedListElements);

    //list.reverseDLL(list.head);

    //console.log(list.tail);
  }
}
const a = new Main();

console.log("============ A =============");
console.log(a.A());
console.log("============ B =============");
a.B();
console.log("============ C =============");
a.C();
console.log("============ D =============");
const head = a.D();
console.log("============ E =============");
a.E();
