<template>
  <div id="app" :style="{ 'background-image': 'url('+img_src+')'}">
    <menu-bar v-if="!loader.isLoading"/>
    <router-view v-if="!loader.isLoading"/>
    <loading-cover v-if="loader.isLoading"/>
  </div>
</template>

<script>
import MenuBar from '@/components/MenuBar'
import store from '@/store'
import router from '@/router'
import LoadingCover from '@/components/LoadingCover'
import { contentsLoader } from '@/utils'

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
      output: {} //expect 'pageSettings'
    }
  },
  watch: {
    output(val){
      if ('pageSettings' in val) {
        store.commit('addToGlobalContents', {
          name: 'pageSettings',
          content: val.pageSettings
        })
      }
    }
  },
  async created() {
    store.commit('goToTop')
    contentsLoader.addLoadTarget(this.loader, {
      name: 'pageSettings',
      type: 'firestore',
      whichPath: 'collection',
      path: 'Settings/Pages/MainContentPages',
      options: {
        order: {
          field: 'order',
          direction: 'asc'
        }
      }
    })

    this.output = await contentsLoader.startLoading(this.loader)

    window.addEventListener('resize', () => {
      store.commit('setResizeVals', {mode: 'width', val: window.innerWidth})
      store.commit('setResizeVals', {mode: 'height', val: window.innerHeight})
    })
  },
  components: {
    'menu-bar': MenuBar,
    'loading-cover': LoadingCover
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
  background-size: cover;
  background-repeat: none;
  background-position: center center;
}
</style>
