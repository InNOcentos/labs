import { Graph } from "./graph.mjs";
import { GraphGenerator } from "./generator.mjs";
import { measurePerformance } from "./utils.mjs";

class Runner {
  constructor(options) {
    this.options = options;
  }

  run() {
    const results = {};
    for (let i = 0; i < 4; i++) {
      const data = [];
      const generator = new GraphGenerator(this.options[i], new Graph());

      const graph = generator.generateGraph();
      console.table(graph.adjacencyMatrix);
      /*console.log("=== Матрица смежности ===");
      console.log(graph.adjacencyMatrix);
      console.table(graph.adjacencyMatrix);
      console.log(graph.adjacentList); */

      for (let i = 0; i < 5; i++) {
        data.push({
          [`dijkstra_${i + 1}`]: measurePerformance(graph.dijkstra.bind(graph)),
        });
      }

      results[this.options[i].vertexesCount] = data;
    }

    Graph.commitResult(results);
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
