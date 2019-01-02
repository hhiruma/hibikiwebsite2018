<template>
  <div id="transContainer">
    <v-flex id="transCover"
      :style="'background-image: url(' + output.otherImagePaths.translationBg1 +')'"/>
    <v-flex id="transCover2"
      :style="'background-image: url(' + output.otherImagePaths.translationBg2 +')'"/>
    <v-btn
      @click="transitionIn()"
      style="position: fixed; bottom: 0; z-index: 1000000">
      transision in </v-btn>
    <v-btn
      @click="transitionOut()"
      style="position: fixed; bottom: 0; left: 150px; z-index: 1000000">
      transision out </v-btn>
  </div>
</template>

<script>
import anime from 'animejs'
import { contentsLoader, loaderPresets } from '@/utils'

export default {
  name: 'Transition',
  data() {
    return {
      loader: {
        isLoading: true,
        targetParams: [],
      },
      output: {} //expect 'otherImagePaths'
    }
  },
  methods: {
    async transitionIn() {
      const setSuccess = await this.setStartPos()
      const slideInSuccess = await this.slideIn()
    },
    async transitionOut() {
      const slideOutSuccess = await this.slideOut()
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
    console.log(this.output)
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
    contentsLoader.addLoadTarget(this.loader, loaderPresets.otherImagePaths)

    this.output = await contentsLoader.startLoading(this.loader)
  }
}
</script>

<style scoped>
#transContainer {
  width: 100%;
  height: 80vh;
  position: fixed;
  z-index: -1;
  top: 0
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
