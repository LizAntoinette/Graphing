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
        <b-dropdown-item @click="selectedItem = 'Uniform Cost'"
          >Uniform Cost</b-dropdown-item
        >
        <b-dropdown-item @click="selectedItem = 'Greedy BFS'"
          >Greedy BFS</b-dropdown-item
        >
        <b-dropdown-item @click="selectedItem = 'A*'">A*</b-dropdown-item>
      </b-dropdown>
      <button type="button" class="btn btn-secondary" @click="runGraph">Run Graph</button>
    </div>
    <div class="row pt-5">
      <b-card class="col-12 drawArea" style="height: 30rem">
        <!-- <b-card class="col-12 drawArea" style="height: 30rem;"  @mouseover="showCoords" > -->
        <v-stage
          :config="stageSize"
          @click="handleClick"
          ref="stage"
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
              }"
            />

            <v-circle
              v-for="item in list"
              :key="item.id"
              :config="{
                x: item.x,
                y: item.y,
                
                radius: 10,
                fill: 'red',
                //draggable:true,
                stroke: 'black',
                strokeWidth: 2,
              }"
            ></v-circle>
            <v-text
              v-for="(item, index) in list"
              :key="item.id"
              :config="{
                x: item.x + 6,
                y: item.y + 6,
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
export default {
  data() {
    return {
   
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
    };
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
  // updated: function() {
  //   console.log(this.addingConnection);
  //   console.log(this.addingVertex);
  // },
  methods: {
    addingConnection() {
      this.connection = !this.connection;
      this.vertex = false;
      console.log(this.connection);
    },
    addingVertex() {
      this.connection = false;
      this.vertex = !this.vertex;
      console.log(this.vertex);
    },

    handleClick(evt) {
      if (this.vertex && this.list.length < 20) {
        const stage = evt.target.getStage();
        const pos = stage.getPointerPosition();
        this.list.push(pos);
      
      }
      //this.save();
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
          point1: indexOfPoint1,
          point2: indexOfPoint2
        });
        console.log(this.distances);
        //    this.edges[indexOfPoint1][indexOfPoint2] = dist.toFixed(2);
        //  console.log(this.edges);
        lastLine.points = [
          lastLine.points[0],
          lastLine.points[1],
          e.target.x(),
          e.target.y(),
        ];
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
    },
    createGrid(){
      const size = this.list.length;
      let grid = new Array(size);

      //initializing the grid
      for (let i = 0; i < size; i++) {
          grid[i] = new Array(size);
          
      }
      
      //setting the distances in the grid
      for (let j = 0; j < this.distances.length; j++) {
         let x = this.distances[j].point1;
         let y = this.distances[j].point2;
         grid[x][y] = this.distances[j].distance;
         grid[y][x] = this.distances[j].distance;
      }
       console.log(grid);

    },
    runGraph(){
       if(this.runnableGraph){
          this.createGrid();
       }
    },
    aStarMethod() {},
    greedyBFS() {},
    bfs() {},
    dfs() {},
    uniformCost() {},
    // showCoords(event) {
    //   this.coor_x = event.clientX;
    //   this.coor_y = event.clientY;
    //   let coor = "X coords: " + this.coor_x + ", Y coords: " + this.coor_y;

    // }
  },
};
</script>