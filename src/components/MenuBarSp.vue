<template>
<v-toolbar>
  <v-img
    contain
    height="45px"
    src="https://firebasestorage.googleapis.com/v0/b/hibikiwebsite2018.appspot.com/o/images%2Fother%2F%E9%AD%81%E9%9F%BF%E3%83%AD%E3%82%B3%E3%82%99%E9%BB%92.png?alt=media&token=f6dd5c12-22d2-4c54-9fea-81e0913b29df"
    @click="$store.commit('goToTop')"
  />

  <v-flex style="position: absolute; right: 0">
    <v-btn large flat icon
      @click="$store.commit('toggleSpSideBarDrawer')">
      <v-icon>
        menu
      </v-icon>
    </v-btn>
  </v-flex>

</v-toolbar>
</template>

<script>
import { contentsLoader, loaderPresets } from '@/utils'

export default {
  name: 'MenuBarSp',
  data() {
    return {
      loader: {
        isLoading: true,
        targetParams: []
      },
      output: {},
    }
  },
  async created() {
    contentsLoader.addLoadTarget(this.loader, loaderPresets.spTopPageContents)
    contentsLoader.addLoadTarget(this.loader, loaderPresets.newComersSettings)
    this.output = await contentsLoader.startLoading(this.loader)
  }
}
</script>

<style>
</style>
