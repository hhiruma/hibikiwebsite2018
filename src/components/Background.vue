<template>
  <v-container fluid id="bgContainer">
    <v-layout row>
      <v-flex xs6 style="height: 100vh">
        <v-layout column wrap>
          <v-img id="bgLImg1"
                 :src="bgUrl.left"
                 x12 style="height: 75vh;"/>
          <v-img id="bgLImg2" :src="bgUrlNext.left"/>

          <v-flex x12 style="height: 25vh;">
          </v-flex>
        </v-layout>
      </v-flex>

      <v-img id="bgRImg1"
             :src="bgUrl.right"
             xs6 style="height: 100vh"/>
      <v-img id="bgRImg2" :src="bgUrlNext.right"/>
    </v-layout>
  </v-container>
</template>

<script>
import { contentsLoader, loaderPresets } from '@/utils'
import anime from 'animejs'

export default {
  name: 'Background',
  data() {
    return {
      bgUrl: {
        left: "",
        right: ""
      },
      bgUrlNext: {
        left: "",
        right: ""
      },
      urlIndex: 0,
      loader: {
        isLoading: true,
        targetParams: []
      },
      output: {}
    }
  },
  methods: {
    async nextBg() {
      this.animCompL = false
      this.animCompR = false

      let bgLImg1 = document.getElementById('bgLImg1')
      let bgLImg2 = document.getElementById('bgLImg2')
      const w_bgLImg1 = bgLImg1.getBoundingClientRect().width
      const h_bgLImg1 = bgLImg1.getBoundingClientRect().height
      let bgRImg1 = document.getElementById('bgRImg1')
      let bgRImg2 = document.getElementById('bgRImg2')
      const w_bgRImg1 = bgRImg1.getBoundingClientRect().width
      const h_bgRImg1 = bgRImg1.getBoundingClientRect().height

      bgLImg2.style.width  = w_bgLImg1 + "px"
      bgLImg2.style.height = h_bgLImg1 + "px"
      bgLImg2.style.top = 0
      bgLImg2.style.left = "-" + (w_bgLImg1*0.2) + "px"
      bgLImg2.style.opacity = 0

      bgRImg2.style.width  = w_bgRImg1 + "px"
      bgRImg2.style.height = h_bgRImg1 + "px"
      bgRImg2.style.top = (h_bgRImg1*0.2) + "px"
      bgRImg2.style.left = w_bgLImg1 + "px"
      bgRImg2.style.opacity = 0

      let animL = anime({
        targets: '#bgLImg2',
        translateX: w_bgLImg1*0.2,
        duration: 1000,
        opacity: 1,
        autoplay: false,
        easing: 'easeOutCubic'
      })
      let animR = anime({
        targets: '#bgRImg2',
        translateY: -h_bgRImg1*0.2,
        duration: 1000,
        opacity: 1,
        autoplay: false,
        easing: 'easeOutCubic'
      })

      animL.play()
      animR.play()

      animL.finished.then(()=>{
        this.bgUrl.left = this.output.bgUrl[this.urlIndex][0]
        this.bgUrl.right = this.output.bgUrl[this.urlIndex][1]
        animL.restart()
        animL.pause()
        animR.restart()
        animR.pause()

        this.updateUrlIndex()
      })
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
    contentsLoader.addLoadTarget(this.loader, loaderPresets.bgUrl)
    this.output = await contentsLoader.startLoading(this.loader)

    this.bgUrl.left = this.output.bgUrl[0][0]
    this.bgUrl.right= this.output.bgUrl[0][1]

    this.updateUrlIndex()

    setInterval(()=>{this.nextBg()}, 5000)
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
