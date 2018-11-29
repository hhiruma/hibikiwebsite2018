<template>
  <v-app>
    <v-flex id="app" >
      <div id="bgContainer" :style="{ 'background-image': 'url('+img_src+')'}"></div>
      <menu-bar v-if="!loader.isLoading"/>
      <router-view v-if="!loader.isLoading"/>
      <loading-cover v-if="loader.isLoading"/>
    </v-flex>
  </v-app>
</template>

<script>
import MenuBar from '@/components/MenuBar'
import firebase from 'firebase'
import store from '@/store'
import router from '@/router'
import LoadingCover from '@/components/LoadingCover'
import { contentsLoader, loaderPresets } from '@/utils'
import HelloWorldVue from './components/HelloWorld.vue';
// import HelloWorld from '@/components/HelloWorld'

export default {
  name: 'App',
  store,
  router,
  data() {
    return {
      img_src: require('@/img/bg.jpg'),
      loader: {
        isLoading: true,
        targetParams: [],
      },
      output: {} //expect 'pageSettings', 'masterUserId'
    }
  },
  watch: {
    output(val){
      const globalizeContentKey = ['pageSettings', 'masterUserId']
      for (const key of globalizeContentKey){
        if (key in val) {
          store.commit('addToGlobalContents', {
            name: key,
            content: val[key]
          })
        }
      }
    }
  },
  async created() {
    store.commit('goToTop')
    contentsLoader.addLoadTarget(this.loader, loaderPresets.pageSettings)
    contentsLoader.addLoadTarget(this.loader, loaderPresets.masterUserId)

    this.output = await contentsLoader.startLoading(this.loader)

    store.commit('setCurrentUserId')

    window.addEventListener('resize', () => {
      store.commit('setResizeVals', {mode: 'width', val: window.innerWidth})
      store.commit('setResizeVals', {mode: 'height', val: window.innerHeight})
    })
  },
  components: {
    'menu-bar': MenuBar,
    'loading-cover': LoadingCover,
    // HelloWorld
  }
}
</script>

<style>
html, body {
  width: 100%;
  height: 100%;
  margin: 0px;

  min-width: 910px;
  min-height: 500px;
}

#app {
  width: 100%;
  height: 100%;
  z-index: 0;
}

#bgContainer {
  position: fixed;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: none;
  background-position: center center;
  z-index: -1;
}
</style>
