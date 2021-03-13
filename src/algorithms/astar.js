export function astar(grid, startNode, finishNode, size) {
  const closedlist = [];
  const openlist = [];

  startNode.cost = {
    F: 0,
    G: 0,
    H: 0
  };

  openlist.push(startNode);

  while (!!openlist.length) {
    openlist.sort((a, b) => a.cost.F - b.cost.F);
    const current = openlist.shift();

    closedlist.push(current);

    if (current === finishNode) return [closedlist, calculatePath(node)];

    const neighbors = getAllNeighbors(grid, current, size);

    for (let i = 0; i < neighbors.length; i++) {
      const nNode = neighbors[i];
      nNode.isVisited = true;
      if (closedlist.includes(nNode)) continue;

      nNode.cost.G = calculateCost(nNode, startNode, "E");
      nNode.cost.H = calculateCost(nNode, finishNode, "E");
      nNode.cost.F = nNode.cost.G + nNode.cost.H;

      if (!openlist.includes(nNode)) {
        nNode.previousNode = current;
        openlist.push(nNode);
      }
    }
  }
  return [closedlist, calculatePath(finishNode)];
}

function calculateCost(currentNode, node, distanceType) {
  switch (distanceType) {
    // Euclidean Distance
    case "E":
      return Math.floor(
        Math.sqrt(
          Math.pow(currentNode.row - node.row, 2) +
            Math.pow(currentNode.col - node.col, 2)
        ) * 10
      );

    // Manhattan Distance
    case "M":
      return (
        Math.abs(currentNode.row - node.row) +
        Math.abs(currentNode.col - node.col)
      );

    // Diagonal Distance
    case "D":
      return Math.max(
        Math.abs(currentNode.row - node.row),
        Math.abs(currentNode.col - node.col)
      );
    default:
      return 0;
  }
}

function getAllNeighbors(grid, node, size) {
  const neighbors = [];
  const point2 = node.point2;

  for (let i = 0; i < size; i++) {
    var tempNode = grid[point2][i];
    if (!tempNode.isVisited && tempNode.distance > 0) {
      grid[i][point2].isVisited = true;
      neighbors.push(tempNode);
    }
  }
  return neighbors;
}

function calculatePath(finishNode) {
  const shortestPathNodes = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    shortestPathNodes.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return shortestPathNodes;
}
