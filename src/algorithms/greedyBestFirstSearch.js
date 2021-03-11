// import PriorityQueue from 'js-priority-queue'

// export function greedyBestFirstSearch(startNode, endNode, graph, heuristic, size){
//   let visited = Array(size).fill(false);
//   visited[startNode] = true;
//   let pq = new PriorityQueue();
//   pq.queue((0, startNode));
//   let path = [];
//   while(pq.length !== 0){
//       var node = pq.dequeue();
//       path.push(node);
//       if(node === endNode){
//         break;
//       }

//       for(let i = 0; i< size; i++){
//         if(!visited[i]){
//           visited[i] = true;
//           pq.enqueue((graph[i], i));
//         }
//       }


//   }
//   return path;

// }

// // def best_first_search(source, target, n):
// //     visited = [0] * n
// //     visited = True
// //     pq = PriorityQueue()
// //     pq.put((0, source))
// //     while pq.empty() == False:
// //         u = pq.get()[1]
// //         # Displaying the path having lowest cost
// //         print(u, end=" ")
// //         if u == target:
// //             break
 
// //         for v, c in graph[u]:
// //             if visited[v] == False:
// //                 visited[v] = True
// //                 pq.put((c, v))
// //     print()
 