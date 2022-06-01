const getRandom = (max, min = 1) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

class Node {
  constructor(data) {
    this.data = data;
    this.priority = getRandom(100);
    this.left = this.right = null;
  }
}

class CartTree {
  root = null;

  rotateLeft(root) {
    const R = root.right;
    const X = root.right.left;

    R.left = root;
    root.right = X;

    return R;
  }

  rotateRight(root) {
    const L = root.left;
    const Y = root.left.right;

    L.right = root;
    root.left = Y;

    return L;
  }

  insert(data) {
    const insertNodeHelper = (root, data) => {
      // base case
      if (root === null) {
        return new Node(data);
      }

      if (data < root.data) {
        root.left = insertNodeHelper(root.left, data);

        if (root.left != null && root.left.priority > root.priority) {
          root = this.rotateRight(root);
        }
      } else {
        root.right = insertNodeHelper(root.right, data);

        if (root.right != null && root.right.priority > root.priority) {
          root = this.rotateLeft(root);
        }
      }

      return root;
    };

    this.root = insertNodeHelper(this.root, data);
  }

  delete(key) {
    const deleteNodeHelper = (root, key) => {
      if (root === null) {
        return null;
      }

      if (key < root.data) {
        root.left = deleteNodeHelper(root.left, key);
      } else if (key > root.data) {
        root.right = deleteNodeHelper(root.right, key);
      } else {
        if (root.left == null && root.right == null) {
          root = null;
        } else if (root.left != null && root.right != null) {
          if (root.left.priority < root.right.priority) {
            root = this.rotateLeft(root);

            root.left = deleteNodeHelper(root.left, key);
          } else {
            root = this.rotateRight(root);

            root.right = deleteNodeHelper(root.right, key);
          }
        } else {
          const child = root.left != null ? root.left : root.right;
          root = child;
        }
      }

      return root;
    };

    this.root = deleteNodeHelper(this.root, key);
  }

  search(key) {
    const searchNodeHelper = (root, key) => {
      if (root === null) {
        return false;
      }

      if (root.data == key) {
        return root;
      }

      if (key < root.data) {
        return searchNodeHelper(root.left, key);
      }

      return searchNodeHelper(root.right, key);
    };

    return searchNodeHelper(this.root, key);
  }
}

module.exports = CartTree;
