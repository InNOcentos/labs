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

        return destVert?.length || "";
      });

      matrix.push([vert, ...lengths]);
    });

    return matrix;
  }

  shortestDistanceNode = (distances, visited) => {
    // create a default value for shortest
    var shortest = null;

    // for each node in the distances object
    for (var node of distances.keys()) {
      // if no node has been assigned to shortest yet
      // or if the current node's distance is smaller than the current shortest
      var currentIsShortest =
        shortest == null || distances.get(node) < distances.get(shortest);

      // and if the current node is in the unvisited set
      if (currentIsShortest && visited[node] != true) {
        //visited[node] == false
        // update shortest to be the current node
        shortest = node;
      }
    }
    return shortest;
  };

  dijkstra(startNode = 1) {
    var distances = new Map();

    var parents = new Map();

    for (var child of this.adjacentList.get(startNode).keys()) {
      distances.set(child, child);
      //console.log(child)
      //console.log(child)
      parents.set(child, startNode);
    }

    // collect visited nodes
    var visited = {};
    visited[startNode] = true;

    // find the nearest node
    var node = this.shortestDistanceNode(distances, visited);
    while (node) {
      // find its distance from the start node & its child nodes
      var distance = distances.get(node);
      var children = this.adjacentList.get(node);
      // for each of those child nodes:
      for (var child of children.entries()) {
        // save the distance from the start node to the child node
        var newdistance = distance + child[1];
        // if there's no recorded distance from the start node to the child node in the distances object
        // or if the recorded distance is shorter than the previously stored distance from the start node to the child node
        if (!distances.get(child[0]) || distances.get(child[0]) > newdistance) {
          // save the distance to the object
          distances.set(child[0], newdistance);
          // record the path
          parents.set(child[0], node);
        }
      }

      // move the current node to the visited set
      visited[node] = true;
      // move to the nearest neighbor node
      node = this.shortestDistanceNode(distances, visited);
    }
    return distances;
  }

  commitResult(value, method) {
    fs.appendFileSync(
      "result.txt",
      `${this.adjacentList.size}: ${method}  ${value}` + "\n"
    );
  }
}
