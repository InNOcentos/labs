import { Graph } from "./graph.mjs";
import { GraphGenerator } from "./generator.mjs";
import { measurePerformance } from "./utils.mjs";

class Runner {
  constructor(options) {
    this.options = options;
  }

  run() {
    for (let i = 0; i < 1; i++) {
      const generator = new GraphGenerator(
        {
          ...this.options,
          maxVertexes: this.options.maxVertexes + i * this.options.maxVertexes,
          minVertexes: this.options.minVertexes + i * this.options.minVertexes,
          maxEdges: this.options.maxEdges + i * this.options.maxEdges,
          minEdges: this.options.minEdges + i * this.options.minEdges,
        },
        new Graph()
      );

      const graph = generator.generateGraph();
      console.log("=== Матрица смежности ===");
      console.table(graph.adjacencyMatrix);
      console.log("=== Матрица инциндентности ===");
      console.table(graph.incidenceMatrix);
      console.log("=== Список смежности ===");
      /*       console.log(graph.adjacentList); */
      console.log("=== Дуги ===");
      /*       console.log(graph.edges); */

      graph.commitResult(measurePerformance(graph.dfs.bind(graph)), "dfs");
      graph.commitResult(measurePerformance(graph.bfs.bind(graph)), "bfs");
    }
  }
}

const runner = new Runner({
  maxEdges: 12,
  minEdges: 12,
  maxVertexes: 7,
  minVertexes: 7,
  maxEdgeToVertexCount: 2,
  isDirected: false,
  maxInOutVertEdges: 2,
});

runner.run();
