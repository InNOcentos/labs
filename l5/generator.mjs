import { rndFromInterval } from "./utils.mjs";

export class GraphGenerator {
  constructor(options, graph) {
    this.options = options;
    this.graph = graph;
  }

  generateGraph() {
    const { vertexesCount, minEdgeToVertexCount } = this.options;

    for (let i = 1; i <= vertexesCount; i++) {
      let toVertexesCount = rndFromInterval(
        minEdgeToVertexCount,
        minEdgeToVertexCount + 3
      );

      const vertexesToSkip = [i];

      for (let j = 0; j < toVertexesCount; j++) {
        let destVertex = rndFromInterval(1, vertexesCount);
        while (vertexesToSkip.includes(destVertex)) {
          destVertex = rndFromInterval(1, vertexesCount);
        }

        const edgeLength = rndFromInterval(1, 20);
        this.graph.addEdge(i, destVertex, edgeLength);
        vertexesToSkip.push(destVertex);
      }
    }

    return this.graph;
  }
}
