<template>
  <div id="transContainer" v-if="!loader.isLoading"
                           :class="{transFront: transFront, transBack: !transFront}">
    <v-flex id="transCover" style="background: #A52A2A"/>
    <v-flex id="transCover2" style="background: #FFFFEE">
      <v-layout fill-height justify-end align-end column>
        <v-img
          width=150
          height=150
          contain
          src="https://firebasestorage.googleapis.com/v0/b/hibikiwebsite2018.appspot.com/o/images%2Ftranslation%2F%E9%AD%81%E9%9F%BF%E3%83%AD%E3%82%B3%E3%82%99%E9%BB%92.png?alt=media&token=f60ce322-5111-4ea8-b709-6356d8f6cea5"
          style="position: absolute; bottom: 50px; right: 50px;"
        />
      </v-layout>
    </v-flex>
  </div>
</template>

<script>
import anime from 'animejs'
import { contentsLoader, loaderPresets } from '@/utils'

export default {
  name: 'Transition',
  data() {
    return {
      transFront: false,
      isRendered: false,
      loader: {
        isLoading: true,
        targetParams: [],
      },
      output: {} //expect 'otherImagePaths'
    }
  },
  updated() {
    if(document.getElementById('transCover') && document.getElementById('transCover2')){
      if (this.isRendered === false){
        this.setStartPos()
      }
      this.isRendered = true
    }
  },
  methods: {
    async testPlay() {
      const setSuccess = await this.setStartPos()
      const slideInSuccess = await this.slideIn()
      const tmp = await (async () => { setTimeout(() => {}, 1000)})
      const slideOutSuccess = await this.slideOut()
    },
    async transitionIn() {
      this.transFront = true
      const setSuccess = await this.setStartPos()
      const slideInSuccess = await this.slideIn()
    },
    async transitionOut() {
      const slideOutSuccess = await this.slideOut()
      this.transFront = false
    },
    async setStartPos() {
      let success = this.checkExists('transCover') && this.checkExists('transCover2')
      let timeline = anime.timeline()

      timeline
        .add({
          targets: '#transCover',
          translateX: -document.getElementById('transCover').getBoundingClientRect().width,
          duration: 1,
          autoplay: false,
          easing: 'easeOutQuint',
          offset: 0
        })
        .add({
          targets: '#transCover2',
          translateX: -document.getElementById('transCover2').getBoundingClientRect().width,
          duration: 1,
          autoplay: false,
          easing: 'easeOutQuint',
          offset: 0
        })
      if (success) {
        timeline.play()
      }

      return timeline.finished.then(() => {
        return new Promise((resolve, reject) => {
          resolve(success)
        })
      })
    },
    async slideIn() {
      let success = this.checkExists('transCover') && this.checkExists('transCover2')
      let timeline = anime.timeline()

      timeline
        .add({
          targets: '#transCover',
          translateX: 0,
          duration: 1000,
          autoplay: false,
          easing: 'easeOutQuint',
          offset: 0
        })
        .add({
          targets: '#transCover2',
          translateX: 0,
          duration: 1000,
          autoplay: false,
          easing: 'easeOutQuint',
          offset: 200
        })
      if (success) {
        timeline.play()
      }

      return timeline.finished.then(() => {
        return new Promise((resolve, reject) => {
          resolve(success)
        })
      })
    },
    async slideOut() {
      let success = this.checkExists('transCover')
      let timeline = anime.timeline()

      timeline
        .add({
          targets: '#transCover',
          translateX: document.getElementById('transCover').getBoundingClientRect().width,
          duration: 1000,
          autoplay: false,
          easing: 'easeOutQuint',
          offset: 0
        })
        .add({
          targets: '#transCover2',
          translateX: document.getElementById('transCover2').getBoundingClientRect().width,
          duration: 1000,
          autoplay: false,
          easing: 'easeOutQuint',
          offset: 0
        })
      if (success) {
        timeline.play()
      }

      return timeline.finished.then(() => {
        return new Promise((resolve, reject) => {
          resolve(success)
        })
      })
    },
    checkExists(domId) {
      let dom = document.getElementById(domId)
      if (!dom) {
        console.log('checkExists : missing ' + domId)
        return false
      }
      return true
    }
  },
  async created() {
    //contentsLoader.addLoadTarget(this.loader, loaderPresets.otherImagePaths)

    this.output = await contentsLoader.startLoading(this.loader)
  }
}
</script>

<style scoped>
#transContainer {
  width: 100%;
  height: 80vh;
  position: fixed;
  top: 0
}

.transFront{
  z-index: 10000;
}
.transBack{
  z-index: 10000;
}

#transCover {
  position: absolute;
  width: 100%;
  height: 100vh;
  background: rgb(180, 60, 60);
  z-index: 100000;
  top: 0;
}
#transCover2 {
  position: absolute;
  width: 100%;
  height: 100vh;
  background: rgb(255, 250, 230);
  z-index: 100000;
  top: 0;
}
</style>
