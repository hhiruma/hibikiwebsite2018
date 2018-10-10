<template>
  <div id="app" :style="{ 'background-image': 'url('+img_src+')'}">
    <menu-bar v-if="!loading"/>
    <router-view/>
    <loading-cover v-if="loading"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MenuBar from '@/components/MenuBar'
import store from '@/store'
import LoadingCover from '@/components/LoadingCover'

export default {
  name: 'App',
  store,
  data() {
    return {
      img_src: require('@/img/bg.jpg'),
    }
  },
  computed: mapState({
    loading: state => state.load.isLoading,
    targets: state => state.load.targets,
    pageContents: 'pageContents'
  }),
  watch: {
    targets: function() {
      if(!this.loading){
        return
      }

      while(this.targets.length !== 0){
        const targetIsArray = Array.isArray(this.targets[0])
        if ((!targetIsArray && this.targets[0] !== null) || (targetIsArray && this.targets[0].length > 0)){
          this.targets.shift()
        } else {
          return
        }
      }

      store.commit('resetTargets')
    },
  },
  created: function() {
    store.commit('addLoadTargets', this.pageContents)
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
