export function greedyBFS(grid, startNode, finishNode) {
  let openList = []; //open list unvisited Noted
  let closedList = []; //closed list visited Nodes
  startNode.distance = 0;
  openList.push(startNode);

  while (!!openList.length) {
    openList.sort((a, b) => a.totalDistance - b.totalDistance);
    let closestNode = openList.shift();
    if (closestNode === finishNode) return closedList;

    closestNode.isVisited = true;
    closedList.push(closestNode);

    let neighbours = getNeighbours(closestNode, grid);
    for (let neighbour of neighbours) {
      let distance = closestNode.distance + 1;
      //f(n) = h(n)
      if (neighbourNotInopenList(neighbour, openList)) {
        openList.unshift(neighbour);
        neighbour.distance = distance;
        neighbour.totalDistance = manhattenDistance(neighbour, finishNode);
        neighbour.previousNode = closestNode;
      } else if (distance < neighbour.distance) {
        neighbour.distance = distance;
        neighbour.totalDistance = manhattenDistance(neighbour, finishNode);
        neighbour.previousNode = closestNode;
      }
    }
  }
  return closedList;
}

function getNeighbours(node, grid) {
  let neighbours = [];
  let { row, col } = node;
  if (row !== 0) neighbours.push(grid[row - 1][col]);
  if (col !== grid[0].length - 1) neighbours.push(grid[row][col + 1]);
  if (row !== grid.length - 1) neighbours.push(grid[row + 1][col]);
  if (col !== 0) neighbours.push(grid[row][col - 1]);
  return neighbours.filter(
    (neighbour) => !neighbour.isWall && !neighbour.isVisited
  );
}

function manhattenDistance(node, finishNode) {
  let x = Math.abs(node.row - finishNode.row);
  let y = Math.abs(node.col - finishNode.col);
  return x + y;
}

function neighbourNotInopenList(neighbour, openList) {
  for (let node of openList) {
    if (node.row === neighbour.row && node.col === neighbour.col) {
      return false;
    }
  }
  return true;
}

export function getNodesInShortestPathOrderGreedyBFS(finishNode) {
  let nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}