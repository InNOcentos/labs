import fs from "fs";

export class Graph {
  vertices = new Set();
  adjacentList = new Map();
  edges = [];
  maxInOutVertEdges = 2;

  get vertices() {
    return Array.from(this.vertices);
  }

  get adjacentList() {
    const list = {};

    this.adjacentList.forEach((val, key) => {
      list[key] = Array.from(val);
    });

    return list;
  }
  addVertex(vertex = null) {
    if (!this.vertices.has(vertex) && vertex) {
      this.vertices.add(vertex);
      this.adjacentList.set(vertex, new Set());
    }
  }
  addEdge(vertex1 = null, vertex2 = null, directed = true) {
    if (vertex1 && vertex2 && vertex1 != vertex2) {
      this.addVertex(vertex1);
      this.addVertex(vertex2);
      const vertex1Connections = this.adjacentList.get(vertex1);
      const vertex2Connections = this.adjacentList.get(vertex2);
      if (
        vertex1Connections.size >= this.maxInOutVertEdges ||
        vertex2Connections.size >= this.maxInOutVertEdges
      ) {
        return;
      }
      this.edges.push([vertex1, vertex2]);
      vertex1Connections.add(vertex2);
      if (!directed) {
        vertex2Connections.add(vertex1);
      }
    }
  }

  get adjacencyMatrix() {
    const vertexes = Array.from(this.adjacentList.keys()).sort((a, b) => a - b);
    let matrix = [["*", ...vertexes]];

    vertexes.forEach((vert, idx) => {
      const vertAdjacents = Array.from(this.adjacentList.get(vert));
      const adjacents = vertexes.map((e, i) => {
        if (vertAdjacents.includes(e)) return 1;
        return 0;
      });
      matrix.push([vert, ...adjacents]);
    });

    return matrix;
  }

  get incidenceMatrix() {
    const vertexes = Array.from(this.adjacentList.keys()).sort((a, b) => a - b);
    let matrix = [["*", ...this.edges.map((e, i) => `edge_${i + 1}`)]];

    vertexes.forEach((vert, idx) => {
      const matches = this.edges.map((e, i) => {
        if (e.includes(vert)) return 1;
        return 0;
      });
      matrix.push([vert, ...matches]);
    });

    return matrix;
  }

  dfs(node = 1) {
    const stack = [];
    stack.push(node);
    let visited = {};

    while (stack.length) {
      node = stack.pop();

      if (!visited[node]) {
        visited[node] = true;

        for (
          let j = 0;
          j < Array.from(this.adjacentList.get(node)).length;
          j++
        ) {
          if (this.adjacentList.get(node)[j] === 1) {
            stack.push(j);
          }
        }
      }
    }
  }

  bfs(node = 1) {
    const queue = [];

    let visited = {};

    visited[node] = true;
    queue.push(node);

    while (queue.length) {
      let currNode = queue.shift();

      /*       console.log(`visiting ${currNode}`); */
      const destVerts = this.adjacentList.get(currNode);
      for (let j = 0; j < Array.from(destVerts).length; j++) {
        if (destVerts[j] === 1 && visited[j] === false) {
          visited[j] = true;
          queue.push(j);
        }
      }
    }
  }

  commitResult(value, method) {
    fs.appendFileSync(
      "result.txt",
      `${this.adjacentList.size}: ${method}  ${value}` + "\n"
    );
  }
}
