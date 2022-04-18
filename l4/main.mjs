import { Graph } from "./graph.mjs";
import { GraphGenerator } from "./generator.mjs";
import { measurePerformance } from "./utils.mjs";

class Runner {
  constructor(options) {
    this.options = options;
  }

  run() {
    for (let i = 0; i < 1; i++) {
      // создание генератора с настройками для конкретного графа
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
      //  создаем граф
      const graph = generator.generateGraph();

      console.log("=== Матрица смежности ===");
      console.table(graph.adjacencyMatrix);

      console.log("=== Матрица инциндентности ===");
      console.table(graph.incidenceMatrix);

      console.log("=== Список смежности ===");
      console.log(graph.adjacentList);

      console.log("=== Дуги ===");
      console.log(graph.edges);

      // записываем в файл то что замерили в методах bfs и dfs
      graph.commitResult(measurePerformance(graph.dfs.bind(graph)), "dfs");
      graph.commitResult(measurePerformance(graph.bfs.bind(graph)), "bfs");
    }
  }
}

const runner = new Runner({
  maxEdges: 12, // максимальное количество дуг
  minEdges: 12, // минимальное количество дуг
  maxVertexes: 7, // максимальное количество  вершин
  minVertexes: 7, // минимальное количество вершин
  maxEdgeToVertexCount: 3, // максимально дуг у вершины
  isDirected: false, // направленный/ненаправленный
  maxInOutVertEdges: 3, // максимальное количество входящих и выходящих дуг из вершины
});

runner.run();
