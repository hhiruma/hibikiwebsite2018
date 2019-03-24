<template>
  <v-app>
    <v-flex id="app">
      <menu-bar v-if="!loader.isLoading && $route.params.pageSlug !== 'top'"/>
      <router-view v-if="!loader.isLoading"/>
      <transition ref="transition"> {{ transition }} </transition>
      <loading-cover v-if="loader.isLoading"/>
    </v-flex>
  </v-app>
</template>

<script>
import Background from '@/components/Background'
import Transition from '@/components/Transition'
import MenuBar from '@/components/MenuBar'
import firebase from 'firebase'
import store from '@/store'
import router from '@/router'
import LoadingCover from '@/components/LoadingCover'
import { mapGetters } from 'vuex'
import { contentsLoader, loaderPresets } from '@/utils'

export default {
  name: 'App',
  store,
  router,
  data() {
    return {
      img_src: require('@/img/bg.jpg'),
      isMounted: false,
      loader: {
        isLoading: true,
        targetParams: [],
      },
      output: {} //expect 'pageSettings', 'masterUserId'
    }
  },
  mounted() {
    this.isMounted = true
  },
  computed: {
    async transition() {
      console.log('transision')
      if (!this.isMounted) return
      if (!this.$refs) return
      const state = store.state.transitionState
      console.log(state)

      if (state === 'wait'){
        //await this.$refs.transition.setStartPos()
      } else if (state === 'in'){
        await this.$refs.transition.transitionIn()
        store.commit('changePage')
      } else if (state === 'out'){
        await this.$refs.transition.transitionOut()
      }
    },
    ...mapGetters({
      pageShow: 'currentPageIfShow'
    })
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
    'background': Background,
    'menu-bar': MenuBar,
    'loading-cover': LoadingCover,
    'transition': Transition
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

</style>
