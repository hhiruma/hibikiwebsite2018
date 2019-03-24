<template>

  <v-layout row justify-space-between id="NewComersContainer"
   :style="'height: ' + (windowSize.y-48) + 'px'">
    <template v-if="!loader.isLoading">
      <v-img :src="bgImgPath">
        <v-layout>
          <new-comers-desc
            ref="newComersDesc"
            :settings="output.newComersSettings"
            :contents="output.newComersContent"
            :windowSize="windowSize"
            @refreshData="refreshData"
          />

          <new-comers-media
            ref="newComersMedia"
            :settings="output.newComersSettings"
            :media="output.newComersMedia"
            :windowSize="windowSize"
          />

        </v-layout>
      </v-img>
    </template>
  </v-layout>
</template>

<script>
import firestore from '@/firebase_firestore'
import { contentsLoader, loaderPresets } from '@/utils'
import NewComersDesc from '@/components/MainContents/NewComersDesc'
import NewComersMedia from '@/components/MainContents/NewComersMedia'

export default {
  name: 'NewComersPage',
  components: {
    'new-comers-desc': NewComersDesc,
    'new-comers-media': NewComersMedia
  },
  data() {
    return {
      windowSize: { x: 0, y: 0 },
      loader: {
        isLoading: true,
        targetParams: [],
        bgImgPath: ''
      },
      output: {} //newComersSettings, newComersContent, newComersMedia
    }
  },
  mounted() {
    this.refreshWinSize()
  },
  methods: {
    refreshWinSize(){
      this.windowSize =  { x: window.innerWidth, y: window.innerHeight }
    },
    async refreshData() {
      this.output = await contentsLoader.startLoading(this.loader)
    }
  },
  async created() {
    contentsLoader.addLoadTarget(this.loader, loaderPresets.newComersSettings)
    let output = await contentsLoader.startLoading(this.loader)
    this.bgImgPath = output.newComersSettings.bgImgPath

    contentsLoader.addLoadTarget(this.loader, {
      name: 'newComersContent',
      type: 'firestore',
      whichPath: 'collection',
      path: 'Contents/NewComers/description/posts/' + output.newComersSettings.validYear
    })

    contentsLoader.addLoadTarget(this.loader, {
      name: 'newComersMedia',
      type: 'firestore',
      whichPath: 'doc',
      path: 'Contents/NewComers/media/' + output.newComersSettings.validYear
    })

    this.output = await contentsLoader.startLoading(this.loader)
    this.$refs.newComersDesc.copyData(this.output)
    this.$refs.newComersMedia.copyData(this.output)

    this.$store.commit('setTransitionState', 'out')
  }
}
</script>

<style scoped>
</style>
