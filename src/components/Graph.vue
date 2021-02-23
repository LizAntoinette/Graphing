<template>
<div class="container ">
 <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
  <button type="button" class="btn btn-secondary">Add Vertex</button>
  <button type="button" class="btn btn-secondary">Add Connection</button>
 
  <b-dropdown :text="selectedItem" v-model="selectedItem">
        <b-dropdown-item @click="selectedItem='BFS'">BFS</b-dropdown-item>
        <b-dropdown-item @click="selectedItem='DFS'">DFS</b-dropdown-item>
        <b-dropdown-item @click="selectedItem='Uniform Cost'">Uniform Cost</b-dropdown-item>
        <b-dropdown-item @click="selectedItem='Greedy BFS'">Greedy BFS</b-dropdown-item>
        <b-dropdown-item @click="selectedItem='A*'">A*</b-dropdown-item>
                
  </b-dropdown>
  <button type="button" class="btn btn-secondary">Run Graph</button>
</div>
  <div class="row pt-5 " >
     <b-card class="col-12" style="height: 30rem;"  @mouseover="showCoords">
        <v-stage :config="configKonva">
          <v-layer>
            <v-circle :config="configCircle"></v-circle>
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
      selectedItem:'Select Graph',
      coor:'',
      configKonva: {
        width: 200,
        height: 200
      },
      configCircle: {
        x: 100,
        y: 100,
        radius: 70,
        fill: "red",
        stroke: "black",
        strokeWidth: 4
      }
    };
  },
  methods:{
   showCoords(event) {
      var x = event.clientX;
      var y = event.clientY;
      let coor = "X coords: " + x + ", Y coords: " + y; 
      
      }
  }
};

</script>