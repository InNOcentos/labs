import { Graph } from "./graph.mjs";
import { GraphGenerator } from "./generator.mjs";
import { measurePerformance } from "./utils.mjs";

class Runner {
  constructor(options) {
    this.options = options;
  }

  run() {
    for (let i = 0; i < this.options.length; i++) {
      const generator = new GraphGenerator(this.options[i], new Graph());

      const graph = generator.generateGraph();
      console.log("=== Матрица смежности ===");
      console.log(graph.adjacentList);

      graph.commitResult(
        measurePerformance(graph.dijkstra.bind(graph)),
        "dijkstra"
      );
    }
  }
}

const options = [
  {
    vertexesCount: 10,
    minEdgeToVertexCount: 3,
  },
  {
    vertexesCount: 20,
    minEdgeToVertexCount: 4,
  },
  {
    vertexesCount: 50,
    minEdgeToVertexCount: 10,
  },
  {
    vertexesCount: 100,
    minEdgeToVertexCount: 20,
  },
];

const runner = new Runner(options);

runner.run();
