import PriorityQueue from "js-priority-queue";

export function astar(startNode, endNode, graph, heuristic, size) {
  let visited = Array(size).fill(false);
  let pq = new PriorityQueue(); //states??
  let actions = [];
  pq.enqueue((startNode, []), heuristic(startNode));
  let nCost = 0;
  while (pq.length !== 0) {
    let node = pq.dequeue();
    actions.push(node);
    if (node === endNode) {
      return actions;
    }
    if (!visited[node]) {
      let nb = getNeighboors(graph[node]);
      for (let j = 0; j < nb.length; j++) {
        if (!visited[j]) {
          let distToNode = graph[node][j];
          let distances = node[j] + distToNode;
          nCost = distances + heuristic[j];
          actions.push((nb[j], distances), nCost);
        }
      }
    }
    visited[node] = true;
  }
  return actions;
}

function getNeighboors(arr) {
  let neighboors = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      neighboors.push(i);
    }
  }
  return neighboors;
}
// def aStarSearch(problem, heuristic=nullHeuristic):
//     "Search the node that has the lowest combined cost and heuristic first."
//     start = problem.getStartState()
//     exploredState = []
//     states = util.PriorityQueue()
//     states.push((start, []), nullHeuristic(start, problem))
//     nCost = 0
//     while not states.isEmpty():
//         state, actions = states.pop()
//         if problem.isGoalState(state):
//             return actions
//         if state not in exploredState:
//             successors = problem.getSuccessors(state)
//             for succ in successors:
//                 coordinates = succ[0]
//                 if coordinates not in exploredState:
//                     directions = succ[1]
//                     nActions = actions + [directions]
//                     nCost = problem.getCostOfActions(nActions) + heuristic(coordinates, problem)
//                     states.push((coordinates, actions + [directions]), nCost)
//         exploredState.append(state)
//     return actions
//     util.raiseNotDefined()
