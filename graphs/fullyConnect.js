/*
 *
 * Fully connect a list of nodes
 *
 */

const crypto = require('crypto')

class FullyConnectedGraph {
  constructor() {
    this.graph = {}
    this.size = 0
  }

  addNode(node) {
    node.hash = this.size

    node.connected = Object.values(this.graph).reduce(
      (graph, n) => {
        console.log(graph,n)
        n.connected[node.hash] = node
        graph[n.hash] = n

        return graph
      }, {})

    this.graph[node.hash] = node
    this.size++
  }
}

const list = ['zxcv','asdf','qwer']

console.log(
  list.reduce( (graph, el) => {
    graph.addNode({ value: el })
    return graph

  }, new FullyConnectedGraph()
  )
)
