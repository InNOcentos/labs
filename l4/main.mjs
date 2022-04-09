import { Graph } from "./graph.mjs";
import { GraphGenerator } from "./generator.mjs";
import { measurePerformance } from "./utils.mjs";

class Runner {
  constructor(options) {
    this.options = options;
  }

  run() {
    for (let i = 0; i < 10; i++) {
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

      graph.commitResult(measurePerformance(graph.dfs.bind(graph)), "dfs");
      graph.commitResult(measurePerformance(graph.bfs.bind(graph)), "bfs");
    }
  }
}

const runner = new Runner({
  maxEdges: 7500,
  minEdges: 6000,
  maxVertexes: 6000,
  minVertexes: 4000,
  maxEdgeToVertexCount: 150,
  isDirected: false,
  maxInOutVertEdges: 150,
});

runner.run();
