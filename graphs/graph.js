class GraphNode {
  constructor(id) {
  }
}

class Graph {
  constructor() {
    this.nodes = {}
    this.autoincrement = 0
  }

  get newId() {
    return this.autoincrement++
  }

  addNode(value) {
    newNode =
    node.id = this.newId

    this.nodes[node.id] = node

  }
}
