<template>
  <div class="container">
    <div
      class="btn-group"
      role="group"
      aria-label="Button group with nested dropdown"
    >
      <button type="button" class="btn btn-secondary" @click="clearScreen">
        Clear
      </button>
      <button type="button" class="btn btn-secondary" @click="addingVertex">
        Add Vertex
      </button>
      <button type="button" class="btn btn-secondary" @click="addingConnection">
        Add Connection
      </button>

      <b-dropdown :text="selectedItem" v-model="selectedItem">
        <b-dropdown-item @click="selectedItem = 'BFS'">BFS</b-dropdown-item>
        <b-dropdown-item @click="selectedItem = 'DFS'">DFS</b-dropdown-item>
        <b-dropdown-item @click="selectedItem = 'Uniform Cost'">Uniform Cost</b-dropdown-item
        >
        <b-dropdown-item @click="selectedItem = 'Greedy BFS'"
          >Greedy BFS</b-dropdown-item
        >
        <b-dropdown-item @click="selectedItem = 'A*'">A*</b-dropdown-item>
        <b-dropdown-item @click="selectedItem = 'CSP'">CSP</b-dropdown-item>
        <b-dropdown-item @click="selectedItem = 'Generic Algorithm'">Generic Algorithm</b-dropdown-item>
        
        
      </b-dropdown>
      
    </div>
    <div class="row m-auto p-4 d-flex justify-content-center">
      <b-form inline>
          <label class="mr-sm-2" for="start-node">Start node:</label>
          <b-form-select
            @change="changeColorStart"
            id="start-node"
            class="mb-2 mr-sm-2 mb-sm-0"
            :options="optionsStartNode"
            v-model="startNode"
            :value="null"
          ></b-form-select>
          <label class="mr-sm-2" for="end-node">Goal node:</label>
          <b-form-select
            id="end-node"
            class="mb-2 mr-sm-2 mb-sm-0"
            @change="changeColorGoal"
            :options="optionsGoalNode"
            v-model="goalNode"
            :value="null"
          ></b-form-select>
          
          <b-button class="btn btn-secondary" @click="runGraph">Visualize Algo</b-button>
        </b-form>
    </div>
    <div class="row pt-5">
      <b-card class="col-12 drawArea" style="height: 30rem">
        <!-- <b-card class="col-12 drawArea" style="height: 30rem;"  @mouseover="showCoords" > -->
        <v-stage
          :config="stageSize"
          @click="handleClick"
          ref="konva"
          @mousedown="handleMouseDown"
          @mouseup="handleMouseUp"
          @mousemove="handleMouseMove"
        >
          <v-layer>
            <v-line
              v-for="line in connections"
              :key="line.id"
              :config="{
                stroke: 'black',
                points: line.points,
                id: line.id
                
              }"
            />

            <v-circle
              
              v-for="(item, index) in list"
              :key="item.id"

              :config="{
                x: item.x,
                y: item.y,
                
                radius: 15,
                fill: '#a20417',
                //draggable:true,
                stroke: '#a20417',
                strokeWidth: 2,
                id:'circle'+index
              }"
            ></v-circle>
            <v-text
              v-for="(item, index) in list"
              :key="item.id"
              :config="{
                x: item.x + 11,
                y: item.y + 11,
                text: index,
                fontSize: 15,
                width: 300,
              }" 
            ></v-text>
            <v-text
              v-for="label in distances"
              :key="label.id"
              :config="{
                x: label.x,
                y: label.y,
                text: label.distance,
              }"
            />
          </v-layer>
        </v-stage>
      </b-card>
    </div>
  </div>
</template>
<script>
import {bfs} from '../algorithms/breadthFirstSearch';
import {dfs} from '../algorithms/depthFirstSearch';
import {greedyBFS} from '../algorithms/greedyBestFirstSearch';
import {astar} from '../algorithms/astar';
import {uniformCost} from '../algorithms/uniformCost';
// import csp from '../algorithms/csp';
// import generic from '../algorithms/generic';

export default {
  data() {
    return {
      grid: null,
      startNode: null,
      goalNode: null,
      prevStartNode: '',
      prevGoalNode:'',
      optionsStartNode:[],   
      list: [],
      edges: [],
      distances: [],
      connection: false,
      vertex: false,

      connections: [],
      drawningLine: false,
      runnableGraph: false,
      selectedItem: "Select Graph",
      coor: "",
      stageSize: {
        width: 200,
        height: 200,
      },
      theStage:[]
    };
  },
  created: function() {
     this.initializeGrid();
  },
  mounted: function () {
    //For Dynamic Stage Size
    const container = document.querySelector(".drawArea");
    const observer = new ResizeObserver(() => {
      this.stageSize.width = container.offsetWidth;
      this.stageSize.height = container.offsetHeight;
    });
    observer.observe(container);
  },
 
  computed:{
   
    optionsGoalNode(){
        return this.optionsStartNode.filter((node) => {
            return node !== this.startNode;
        
        });
    }   
  },

  
  methods: {
    
    addingConnection() {
      this.connection = !this.connection;
      this.vertex = false;
      
    },
    addingVertex() {
      this.connection = false;
      this.vertex = !this.vertex;
    },

    handleClick(evt) {
      if (this.vertex && this.list.length < 20) {
        this.optionsStartNode.push(this.list.length);
        const stage = evt.target.getStage();
        const pos = stage.getPointerPosition();
        this.list.push(pos);
        this.theStage = stage;
      
      }
    },
    changeColorStart(){
        var tween;
       
        var id = "#circle"+this.startNode;
        
        console.log(id);
        const stage = this.theStage;

       
        var shape = stage.findOne(id);
         

        if (tween) {
          tween.destroy();
        }

        if(this.prevStartNode !== ''){
          console.log(this.prevStartNode);
          var prevShape = stage.findOne(this.prevStartNode);
          tween = new Konva.Tween({
            node: prevShape,
            fill:"#a20417",
            stroke:"#a20417"
          }).play();
          
        }

        tween = new Konva.Tween({
          node: shape,
          fill:"#2f9c6e",
          stroke:"#2f9c6e"
        }).play();
        
        this.prevStartNode = id;

    },
    changeColorGoal(){
        var tween;
       
        var id = "#circle"+this.goalNode;
        console.log(id);
        const stage = this.theStage;

       
        var shape = stage.findOne(id);
         

        if (tween) {
          tween.destroy();
        } 
        
        if(this.prevGoalNode !== ''){
          var prevShape = stage.findOne(this.prevGoalNode);
          tween = new Konva.Tween({
            node: prevShape,
            fill:"#a20417",
            stroke:"#a20417"
          }).play();
         
        }

        tween = new Konva.Tween({
          node: shape,
          fill:"#004019",
          stroke:"#004019"
        }).play();
        
        this.prevGoalNode = id;
    },
    handleMouseDown(e) {
      if (this.connection) {
        const onCircle = e.target instanceof Konva.Circle;
        if (!onCircle) {
          return;
        }
        this.drawningLine = true;
        this.connections.push({
          id: Date.now(),
          points: [e.target.x(), e.target.y()],
        });
      }
    },
    handleMouseMove(e) {
      if (this.connection) {
        if (!this.drawningLine) {
          return;
        }
        const pos = e.target.getStage().getPointerPosition();
        const lastLine = this.connections[this.connections.length - 1];
        lastLine.points = [
          lastLine.points[0],
          lastLine.points[1],
          pos.x,
          pos.y,
        ];
      }
    },
    handleMouseUp(e) {
      if (this.connection) {
        const onCircle = e.target instanceof Konva.Circle;
        if (!onCircle) {
          return;
        }
        this.drawningLine = false;
        const lastLine = this.connections[this.connections.length - 1];
        const indexOfPoint1 = this.list.findIndex(function (point) {
          return (
            point.x === lastLine.points[0] && point.y === lastLine.points[1]
          );
        });
        const indexOfPoint2 = this.list.findIndex(function (point) {
          return point.x === e.target.x() && point.y === e.target.y();
        });
        console.log("Point1 = " + indexOfPoint1 + " Point2 = " + indexOfPoint2);
        var dist = Math.sqrt(
          Math.pow(e.target.x() - lastLine.points[0], 2) +
            Math.pow(e.target.y() - lastLine.points[1], 2)
        );
        this.distances.push({
          id: Date.now(),
          distance: dist.toFixed(2),
          x:
            Math.min(e.target.x(), lastLine.points[0]) +
            Math.abs(e.target.x() - lastLine.points[0]) / 2 +
            4,
          y:
            Math.min(e.target.y(), lastLine.points[1]) +
            Math.abs(e.target.y() - lastLine.points[1]) / 2 +
            4,
        });
        this.grid[indexOfPoint1][indexOfPoint2] = this.createNode(indexOfPoint1, indexOfPoint2, dist.toFixed(2));
        this.grid[indexOfPoint2][indexOfPoint1] = this.createNode(indexOfPoint2, indexOfPoint1, dist.toFixed(2));
        console.log(this.grid);
        console.log(this.distances);
        lastLine.id= "line"+indexOfPoint1+indexOfPoint2;
        lastLine.points = [
          lastLine.points[0],
          lastLine.points[1],
          e.target.x(),
          e.target.y(),
        ];
        console.log("The connections");
        console.log(this.connections);
        console.log(this.list);
        if(this.connections.length < 2){
            this.runnableGraph = true
        }
      }
    },
    clearScreen() {
      this.list = [];
      this.connections = [];
      this.distances = [];
      this.startNode = 0;
      this.goalNode = 0;
      this.optionsGoalNode = [];
      this.optionsStartNode = [];
    },
    createHeuristic(node){
       const size = this.list.length;
       const endNode= this.list[node];
       let heuristic = [];
       

       for(let i =0; i < size; i++){
         var dist = Math.sqrt(
            Math.pow(endNode.x - this.list[i].x, 2) +
              Math.pow(endNode.y - this.list[i].y, 2)
          );
         heuristic.push({node: i, hval: dist});
       }

       return heuristic;

    },
    initializeGrid(){
      const grid = [];
      for (let row = 0; row < 20; row++) {
        const currentRow = [];
        for (let col = 0; col < 20; col++) {
          currentRow.push(this.createNode(row, col, 0));
        }
        grid.push(currentRow);
      }
      this.grid = grid;
      console.log('This is the Initialized Grid');
      console.log(this.grid);
    },

    //
    createNode(x, y, dist){
      return {
        point1: x,
        point2: y,
        distance: dist,
        isVisited: false,
        previousNode: null,
        cost: {
                F: Infinity,
                G: Infinity,
                H: Infinity,
            },
      }

    },
    
    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
      
      
      for (let i = 1; i < visitedNodesInOrder.length; i++) {
        
          setTimeout(() => {
                this.colorNode(visitedNodesInOrder[i], "#ed81c4");
          }, i*800);
         

        }
        setTimeout(() => {
                this.animateShortestPath(nodesInShortestPathOrder);
        }, visitedNodesInOrder.length*800);
        
    },

  colorNode(visitedNode, color){
          let stage = this.theStage;
          var tweenShape, tweenLine;
          var connections = this.connections;
          const node = visitedNode;

          var idCircle = "#circle"+node.point2;
          console.log(idCircle);
          var shape = stage.findOne(idCircle);
          

          
          var idLine = "line"+node.point1+node.point2;
          var idLine2 = "line"+node.point2+node.point1;
          let idL =connections.filter(line => line.id === idLine|| line.id === idLine2);

        
          var idOfLine = "#"+idL[0].id;
          var line = stage.findOne(idOfLine);

        
          tweenLine = new Konva.Tween({
              node: line,
              
              fill:color,
              stroke:color
          }).play();
          console.log("Line is working");
          
          tweenShape = new Konva.Tween({
            node: shape,
        
            fill:color,
            stroke:color
          }).play();
         
         console.log("Shape is working");
  },

  animateShortestPath(nodesInShortestPathOrder) {
    
    for (let i = 1; i < nodesInShortestPathOrder.length; i++) {
          
          setTimeout(() => {
                this.colorNode(nodesInShortestPathOrder[i], "#ed4255");
          }, i*500);
       
    }
  },
    visualizeBFS(){
       const STARTNODE = this.grid[this.startNode][this.startNode];
       const GOALNODE = this.goalNode;
       const size = this.list.length;
       const [visitedNodesInOrder, calculatedPath] = bfs(this.grid, STARTNODE, GOALNODE, size);
       
       this.animateAlgorithm(visitedNodesInOrder, calculatedPath);
      
    },
    visualizeDFS(){
       const STARTNODE = this.grid[this.startNode][this.startNode];
       const GOALNODE = this.goalNode;
       const size = this.list.length;
       const [visitedNodesInOrder, calculatedPath] = dfs(this.grid, STARTNODE, GOALNODE, size);
       
       this.animateAlgorithm(visitedNodesInOrder, calculatedPath);
      
    },
    visualizeAStar(){
       const STARTNODE = this.grid[this.startNode][this.startNode];
       const GOALNODE = this.goalNode;
       const size = this.list.length;
       const heuristic = this.createHeuristic(GOALNODE);
       console.log(heuristic);
       const [visitedNodesInOrder, calculatedPath] = astar(this.grid, STARTNODE, GOALNODE, size, heuristic );
       console.log("The A* ")
       console.log(visitedNodesInOrder);
       console.log(calculatedPath);
      this.animateAlgorithm(visitedNodesInOrder, calculatedPath);
    },
    visualizeGreedyBFS(){
       const STARTNODE = this.grid[this.startNode][this.startNode];
       const GOALNODE = this.goalNode;
       const size = this.list.length;
       const heuristic = this.createHeuristic(GOALNODE);
       console.log(heuristic);
       const [visitedNodesInOrder, calculatedPath] = greedyBFS(this.grid, STARTNODE, GOALNODE, size, heuristic );
       console.log("The Greedy BFS ")
       console.log(visitedNodesInOrder);
       console.log(calculatedPath);
      this.animateAlgorithm(visitedNodesInOrder, calculatedPath);
    },
    visualizeUniformCost(){
       const STARTNODE = this.grid[this.startNode][this.startNode];
       const GOALNODE = this.goalNode;
       const size = this.list.length;
       const heuristic = this.createHeuristic(GOALNODE);
       console.log(heuristic);
       const [visitedNodesInOrder, calculatedPath] = astar(this.grid, STARTNODE, GOALNODE, size, heuristic );
       console.log("The A* ")
       console.log(visitedNodesInOrder);
       console.log(calculatedPath);
      this.animateAlgorithm(visitedNodesInOrder, calculatedPath);
    },
  
    runGraph(){
       if(this.runnableGraph){
          const item = this.selectedItem;
          if(item === "BFS"){
            this.visualizeBFS();
          }
          else if(item === "DFS"){
            this.visualizeDFS();
          }
          else if (item === "A*"){
            this.visualizeAStar();
          }
          else if (item === "Greedy BFS"){
            this.visualizeGreedyBFS();
          }
          else if (item === "Uniform Cost"){
            this.visualizeUniformCost();
          }
       }
    },

  },
};
</script>