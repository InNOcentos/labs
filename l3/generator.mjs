import { rndFromInterval } from "./utils.mjs";

export class GraphGenerator {
  constructor(options, graph) {
    this.options = options;
    this.graph = graph;
  }

  generateGraph() {
    const {
      maxEdges,
      minEdges,
      maxVertexes,
      minVertexes,
      maxEdgeToVertexCount,
      maxInOutVertEdges,
      isDirected,
    } = this.options;

    let vertexesCount = rndFromInterval(minVertexes, maxVertexes); // 10
    let edgesCountToAdd = rndFromInterval(minEdges, maxEdges); // 10
    this.graph.maxInOutVertEdges = maxInOutVertEdges;

    for (let i = 1; i <= vertexesCount; i++) {
      if (!edgesCountToAdd) {
        this.graph.addVertex(i);
        continue;
      }

      let toVertexesCount = rndFromInterval(1, maxEdgeToVertexCount); // 2

      const vertexesToSkip = [i];

      for (let j = 0; j < toVertexesCount; j++) {
        let destVertex = rndFromInterval(1, vertexesCount);
        while (vertexesToSkip.includes(destVertex)) {
          destVertex = rndFromInterval(1, vertexesCount);
        }
        this.graph.addEdge(i, destVertex, isDirected);
        edgesCountToAdd--;
        vertexesToSkip.push(destVertex);
      }
    }

    return this.graph;
  }
}
