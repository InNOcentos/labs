import fs from "fs";

export class Graph {
  vertices = new Set(); // вершины
  adjacentList = new Map(); // список смежности
  edges = []; // дуги
  maxInOutVertEdges = 2; // макс вход и исход дуг из вершины

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
  // добавление дуги
  addEdge(vertex1 = null, vertex2 = null, directed = true) {
    if (!vertex1 || !vertex2 || vertex1 == vertex2) return;

    // добавляем вершины
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
    // добавляем вторую
    vertex1Connections.add(vertex2);
    // если граф не направленный - добавляем для второй вершины
    if (!directed) {
      vertex2Connections.add(vertex1);
    }
  }

  // матрица смежности, приводим к нормальному виду
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

  //матрца инцидентности
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

  dfs(start = 1) {
    const result = [];
    const stack = [start];
    const visited = {};
    visited[start] = true;
    let currentVertex;

    while (stack.length) {
      currentVertex = stack.pop();
      result.push(currentVertex);
      Array.from(this.adjacentList.get(currentVertex)).forEach((neighbor) => {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          stack.push(neighbor);
        }
      });
    }
    return result;
  }

  bfs(start = 1) {
    const queue = [start];
    const result = [];
    const visited = {};
    visited[start] = true;
    let currentVertex;

    while (queue.length) {
      currentVertex = queue.shift();
      result.push(currentVertex);
      Array.from(this.adjacentList.get(currentVertex)).forEach((neighbor) => {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.push(neighbor);
        }
      });
    }
    return result;
  }

  commitResult(value, method) {
    fs.appendFileSync(
      "result.txt",
      `${this.adjacentList.size}: ${method}  ${value}` + "\n"
    );
  }
}
