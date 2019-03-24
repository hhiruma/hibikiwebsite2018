<template>
  <v-layout style="height: 70vh">
    <v-window
      :value="carouselState"
      max style="width: 100%">
      <v-window-item v-for="path in bgPaths" :key="path"
                     style="height: 70vh">
        <v-layout fill-height>
          <v-img :src='path'/>
        </v-layout>
      </v-window-item>
    </v-window>
  </v-layout>
</template>

<script>
  //<v-layout :style="'height: ' + (windowSize.y-48) + 'px'">
import anime from 'animejs'

export default {
  name: 'Background',
  props: ['bgPaths'],
  data() {
    return {
      windowSize: { x: 0, y: 0 },
      bgCounter: 0,
      urlIndex: 0,
    }
  },
  mounted() {
    this.refreshWinSize()
  },
  computed: {
    carouselState() {
      return this.bgCounter % this.bgPaths.length
    }
  },
  methods: {
    refreshWinSize(){
      this.windowSize =  { x: window.innerWidth, y: window.innerHeight }
    },
    updateBg() {
      this.bgCounter += 1
    },
    updateUrlIndex(){
      this.urlIndex += 1
      if (this.urlIndex >= Object.keys(this.output.bgUrl).length){
        this.urlIndex = 0
      }
      this.bgUrlNext.left = this.output.bgUrl[this.urlIndex][0]
      this.bgUrlNext.right = this.output.bgUrl[this.urlIndex][1]
    }
  },
  async created() {
    setInterval(()=>{
      this.bgCounter += 1
    }, 5000)
  }
}
</script>

<style scoped>
#bgContainer {
  width: 100%;
  height: 100vh;
  position: fixed;
  z-index: -1;
  padding: 0;
}

#bgLImg2, #bgRImg2 {
  position: absolute;
  display: block;
}
</style>
