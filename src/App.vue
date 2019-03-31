<template>
  <v-app>
    <v-flex id="app">
      <template v-if="$store.state.userAgent === 'pc'">
        <menu-bar v-if="!loader.isLoading && $route.params.pageSlug !== 'top'"/>
        <router-view v-if="!loader.isLoading"/>
        <transition ref="transition"> {{ transition }} </transition>
        <loading-cover v-if="loader.isLoading"/>
      </template>

      <template v-else>
        <menu-bar-sp v-if="$route.params.pageSlug !== 'top'"/>
        <router-view/>
        <side-bar-sp/>
      </template>
    </v-flex>
  </v-app>
</template>

<script>
import Background from '@/components/Background'
import Transition from '@/components/Transition'
import MenuBar from '@/components/MenuBar'
import MenuBarSp from '@/components/MenuBarSp'
import SideBarSp from '@/components/SideBarSp'
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
    if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
      store.commit('setUserAgent', 'mobile')
    } else {
      store.commit('setUserAgent', 'pc')
      let domElement = document.querySelector('html, body')
      domElement.style['min-width'] = '910px'
      domElement.style['min-height'] = '500px'
    }

    store.commit('goToTop')
    contentsLoader.addLoadTarget(this.loader, loaderPresets.pageSettings)
    contentsLoader.addLoadTarget(this.loader, loaderPresets.masterUserId)
    contentsLoader.addLoadTarget(this.loader, loaderPresets.newComersSettings)

    this.output = await contentsLoader.startLoading(this.loader)

    store.commit('setCurrentUserId')
    store.commit('setNewComersPublicity', this.output.newComersSettings.publish)

    window.addEventListener('resize', () => {
      store.commit('setResizeVals', {mode: 'width', val: window.innerWidth})
      store.commit('setResizeVals', {mode: 'height', val: window.innerHeight})
    })
  },
  components: {
    'background': Background,
    'menu-bar': MenuBar,
    'menu-bar-sp': MenuBarSp,
    'side-bar-sp': SideBarSp,
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
}

#app {
  width: 100%;
  height: 100%;
  z-index: 0;
}

</style>
