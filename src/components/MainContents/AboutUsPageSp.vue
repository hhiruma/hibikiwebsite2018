<template>
<v-flex>
  <v-img
    height=200
    src="https://firebasestorage.googleapis.com/v0/b/hibikiwebsite2018.appspot.com/o/images%2Fother%2Fbg_0_R.jpg?alt=media&token=d84903e4-1f85-492b-adec-3e2a72622e26">
    <v-flex
      style="position: absolute; font-size: 1.5em; font-weight: bold;
             padding: 10px; color: white; bottom: 0px;
             background: rgba(0, 0, 0, 0.5); width: 100%">
      サークルについて
    </v-flex>
  </v-img>

  <v-layout v-for="(pageContent, index) in output.pageContents"
            style="padding: 15px;"
            column>

    <!-- image -->
    <v-flex class="AboutUsSpCarouselContainer">
      <v-window v-model="pageContent.carouselState" max>
        <v-window-item v-for="url in pageContent.imagePaths" :key="url">
          <v-img :src='url' height=200
            style="border-radius: 20px 20px 0px 0px;"
          />
        </v-window-item>
      </v-window>

      <!-- Carousel Navigator -->
      <v-item-group dark v-model="pageContent.carouselState" mandatory>
        <v-layout row justify-center class="carouselSelector">
          <v-item v-for="i in pageContent.imagePaths.length" :key="i">
            <div slot-scope="{ active, toggle }">
              <v-btn :input-value="active" icon @click="toggle" >
                ●
              </v-btn>
            </div>
          </v-item>
        </v-layout>
      </v-item-group>
    </v-flex>

    <!-- text -->
    <v-flex class="AboutUsSpTextContainer">
      <v-flex style="font-size: 1.3em; font-weight: bold; padding-bottom: 10px">
        {{ pageContent.title }}
      </v-flex>
      <v-flex style="padding-left: 10px">
        {{ pageContent.content }}
      </v-flex>
    </v-flex>

  </v-layout>
</v-flex>
</template>

<script>
import { contentsLoader, loaderPresets } from '@/utils'
import AboutUsDescEl from '@/components/MainContents/AboutUsDescEl'

export default {
  'name': 'AboutUsPageSp',
  data() {
    return {
      loader: {
        isLoading: true,
        targetParams: [],
      },
      output: {} //expect 'pageContents',
    }
  },
  async created() {
    contentsLoader.addLoadTarget(this.loader, loaderPresets.aboutUsContents)
    this.output = await contentsLoader.startLoading(this.loader)
  }
}
</script>

<style>
.AboutUsSpTextContainer {
  padding: 20px;
  border-radius: 0px 0px 20px 20px;
  border: 1px solid black;
}

.carouselSelector {
  position: absolute;
  width: 100%;
  height: 50px;
  bottom: 0px;
}

.bgCoverSettings{
  background-size: cover;
  background-repeat: none;
  background-position: center center;
}
</style>
