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

    // количество вершин
    let vertexesCount = rndFromInterval(minVertexes, maxVertexes);
    // количество ребер
    let edgesCountToAdd = rndFromInterval(minEdges, maxEdges);
    // количество выходящих и входящх ребере к вершине
    this.graph.maxInOutVertEdges = maxInOutVertEdges;

    for (let i = 1; i <= vertexesCount; i++) {
      if (!edgesCountToAdd) {
        this.graph.addVertex(i);
        continue;
      }

      // сколько ребер будет у вершины
      let toVertexesCount = rndFromInterval(1, maxEdgeToVertexCount); //2

      const vertexesToSkip = [i];

      for (let j = 0; j < toVertexesCount; j++) {
        if (!edgesCountToAdd) return;
        let destVertex = rndFromInterval(1, vertexesCount);
        // проверяем что наша вершина новая
        while (vertexesToSkip.includes(destVertex)) {
          destVertex = rndFromInterval(1, vertexesCount);
        }
        // создание дуги
        this.graph.addEdge(i, destVertex, isDirected);
        edgesCountToAdd--;
        vertexesToSkip.push(destVertex);
      }
    }

    return this.graph;
  }
}
