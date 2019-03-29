<template>
  <v-flex>
    <background
      :bgPaths="output.topPageData.bg_paths"/>

    <v-flex
      id="topLogoContainer"
      style="height: 30vh"
      >
      <v-layout row>
        <v-img
          style="width: 230px;"
          max-height="20vh"
          contain
          :src="output.topPageData.logoUrl"/>

        <v-spacer/>

        <v-flex>
          <v-layout fill-height column justify-end align-space-between>
            <v-flex>
              <v-layout fill-height row justify-end>
                <v-btn fab dark small color="light-blue" target="_blank"
                  href="https://twitter.com/sakigake_hibiki">
                  <v-icon dark>fab fa-twitter</v-icon>
                </v-btn>
                <v-btn fab dark small color="indigo" target="_blank"
                  href="https://www.facebook.com/%E6%97%A9%E7%A8%B2%E7%94%B0%E5%A4%A7%E5%AD%A6%E9%AD%81%E9%9F%BF-229672980453174/">
                  <v-icon dark>fab fa-facebook-f</v-icon>
                </v-btn>
                <v-btn fab dark small color="red" target="_blank"
                  href="https://www.youtube.com/channel/UCJ2ijSO2X4wMwUBO7g2VerA">
                  <v-icon dark>fab fa-youtube</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>

            <v-flex>
              <v-layout row justify-end>
                <v-btn v-for="pageData in pageList"
                  flat @click="changePage(pageData.slug)">
                  {{ pageData.title }}
                </v-btn>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-flex>
</template>

<script>

import Background from '@/components/Background'
import { contentsLoader, loaderPresets } from '@/utils'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'TopPage',
  data() {
    return {
      loader: {
        isLoading: true,
        targetParams: []
      },
      output: {}
    }
  },
  methods: {
    changePage(slug) {
      this.$store.commit('startTransition', slug)
    }
  },
  computed: {
    ...mapState({
      pageList: state => state.globalContents.pageSettings
    })
  },
  async created() {
    contentsLoader.addLoadTarget(this.loader, loaderPresets.topPageData)
    this.output = await contentsLoader.startLoading(this.loader)

    // Load Image before transition
    Promise.resolve()
      .then(() => {
        return Promise.all(this.output.topPageData.bg_paths.map(el => {
          return new Promise((fulfilled, rejected) => {
            const img = new Image()
            img.onload = () => fulfilled()
            img.src = el
          })
        }))
      })
      .then(() => {
        //this.$store.commit('setTransitionState', 'out')
      })
  },
  components: {
    'background': Background,
  }
}
</script>

<style scoped>
#topLogoContainer {
  bottom: 0;
  left: 0;
  background: white;
  width: 100%;
  padding: 20px 20px 40px 50px;
}
</style>
