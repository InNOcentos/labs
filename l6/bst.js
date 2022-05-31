class Node {
  constructor(data) {
    this.left = null;
    this.right = null;
    this.value = data;
  }
}

class BST {
  constructor() {
    this.root = null;
  }
  insert(value) {
    var newNode = new Node(value);
    if (this.root === null) {
      this.root = newNode;
      return this;
    }
    let current = this.root;
    while (current) {
      if (value === current.value) return undefined;
      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }
  search(value) {
    if (!this.root) return false;

    let current = this.root;
    let found = false;
    while (current && !found) {
      if (value < current.value) {
        current = current.left;
      } else if (value > current.value) {
        current = current.right;
      } else {
        found = current;
      }
    }

    if (!found) return undefined;
    return found;
  }

  delete(value) {
    this.root = this.removeNode(this.root, value);
  }

  removeNode(current, value) {
    if (current === null) return current;

    if (value === current.value) {
      if (current.left === null && current.right === null) {
        return null;
      } else if (current.left === null) {
        return current.right;
      } else if (current.right === null) {
        return current.left;
      } else {
        let tempNode = this.kthSmallestNode(current.right);
        current.value = tempNode.value;

        current.right = this.removeNode(current.right, tempNode.value);
        return current;
      }
    } else if (value < current.value) {
      current.left = this.removeNode(current.left, value);
      return current;
    } else {
      current.right = this.removeNode(current.right, value);
      return current;
    }
  }

  kthSmallestNode(node) {
    while (!node.left === null) node = node.left;

    return node;
  }
}

module.exports = BST;
