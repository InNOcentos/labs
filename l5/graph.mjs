import fs from "fs";

export class Graph {
  vertices = new Set();
  adjacentList = new Map();
  edges = [];

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
  addEdge(vertex1 = null, vertex2 = null, edgeLength) {
    if (vertex1 && vertex2 && vertex1 != vertex2) {
      this.addVertex(vertex1);
      this.addVertex(vertex2);
      const vertex1Connections = this.adjacentList.get(vertex1);
      this.edges.push({ length: edgeLength, vertex1, vertex2 });
      vertex1Connections.add(vertex2);
      /*if (!directed) {
        vertex2Connections.add(vertex1);
      }*/
    }
  }

  get adjacencyMatrix() {
    const vertexes = Array.from(this.adjacentList.keys()).sort((a, b) => a - b);
    let matrix = [["*", ...vertexes]];

    vertexes.forEach((vert, idx) => {
      const lengths = vertexes.map((vertex, i) => {
        const vertEdges = this.edges.filter((edge) => {
          return edge.vertex1 === vert;
        });

        const destVert = vertEdges.find((e) => {
          return e.vertex2 === vertex;
        });

        return destVert?.length || null;
      });

      matrix.push([vert, ...lengths]);
    });

    return matrix;
  }

  findNearestVertex(distances, visited) {
    let minDistance = Infinity;
    let nearestVertex = null;

    Object.keys(distances).forEach((vertex) => {
      if (!visited[vertex] && distances[vertex] < minDistance) {
        minDistance = distances[vertex];
        nearestVertex = vertex;
      }
    });

    return nearestVertex;
  }

  dijkstra(startVertex = 1) {
    let edgesLengths = this.adjacencyMatrix.slice(1);
    let objGraph = {};

    [...this.adjacentList.keys()]
      .sort((a, b) => a - b)
      .forEach((e, i, arr) => {
        const values = edgesLengths[i].slice(1);
        objGraph[e] = arr.reduce((acc, v, ix) => {
          if (values[ix]) {
            return {
              ...acc,
              [v]: values[ix] ? Number(values[ix]) : values[ix],
            };
          }

          return acc;
        }, {});
      });

    let visited = {};
    let distances = {}; // кратчайшие пути из стартовой вершины
    let previous = {}; // предыдущие вершины

    let vertices = Object.keys(objGraph); // список вершин графа

    // по умолчанию все расстояния неизвестны (бесконечны)
    vertices.forEach((vertex) => {
      distances[vertex] = Infinity;
      previous[vertex] = null;
    });

    // расстояние до стартовой вершины равно 0
    distances[startVertex] = 0;

    function handleVertex(vertex) {
      // расстояние до вершины
      let activeVertexDistance = distances[vertex];

      // смежные вершины (с расстоянием до них)
      let neighbours = objGraph[activeVertex];

      // для всех смежных вершин пересчитать расстояния
      Object.keys(neighbours).forEach((neighbourVertex) => {
        // известное на данный момент расстояние
        let currentNeighbourDistance = distances[neighbourVertex];
        // вычисленное расстояние
        let newNeighbourDistance =
          activeVertexDistance + neighbours[neighbourVertex];

        if (newNeighbourDistance < currentNeighbourDistance) {
          distances[neighbourVertex] = newNeighbourDistance;
          previous[neighbourVertex] = vertex;
        }
      });

      // пометить вершину как посещенную
      visited[vertex] = 1;
    }

    // ищем самую близкую вершину из необработанных
    let activeVertex = this.findNearestVertex(distances, visited);

    // продолжаем цикл, пока остаются необработанные вершины
    while (activeVertex) {
      handleVertex(activeVertex);
      activeVertex = this.findNearestVertex(distances, visited);
    }

    console.log({ distances, previous });
    return { distances, previous };
  }

  static commitResult(results) {
    console.log(results);
    fs.appendFileSync("result.json", JSON.stringify(results));
  }
}
