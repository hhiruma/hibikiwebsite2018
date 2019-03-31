<template>
  <v-flex style="width: 100vw">
    <!-- Top page background image -->
    <v-img
      style="height: 100vh"
      src="https://firebasestorage.googleapis.com/v0/b/hibikiwebsite2018.appspot.com/o/images%2Fother%2Fsp_top_bg.jpg?alt=media&token=e913f713-74d4-45b3-81e6-93ced8d07d59"
     >
      <v-flex style="position: absolute; width: 70%; bottom: 40px; background: white; padding: 20px 30px" >
        <v-img
          contain
          src="https://firebasestorage.googleapis.com/v0/b/hibikiwebsite2018.appspot.com/o/images%2Fother%2F%E9%AD%81%E9%9F%BF%E3%83%AD%E3%82%B3%E3%82%99%E9%BB%92.png?alt=media&token=f6dd5c12-22d2-4c54-9fea-81e0913b29df"
        />
      </v-flex>
    </v-img>


    <!-- Introduction contents -->
    <v-flex v-for="content in output.spTopPageContents" :key="content.title"
      class="bgCoverSettings"
      v-if="!(content.title === '新歓情報' && output.newComersSettings.publish === false)"
      :style="
        'margin: 30px 15px; border-radius: 10px;' +
        'background-image: url(' + content.bgUrl + ');'
      ">
      <v-flex class="topSpIntroContainer">
        <v-flex class="topSpIntroTitle">
          {{ content.title }}
        </v-flex>
        <v-flex style="padding: 0px 0px 10px 20px;">
          {{ content.text }}
        </v-flex>
        <v-layout row justify-end>
          <v-btn outline color="white"
                         @click="changePage(content.slug)">
            詳しく
          </v-btn>
        </v-layout>
      </v-flex>
    </v-flex>

    <!-- SNS -->
    <v-flex style="background: gray; color: white; text-align: center; padding: 10px;">
      <v-flex style="padding: 10px;" >
        早稲田大学公認和太鼓サークル魁響
      </v-flex>
      <v-layout justify-center>
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



    <v-btn fab dark large color="white" absolute
      @click.stop="drawer = !drawer"
      id="topPageSpMenu">
      <v-icon>menu</v-icon>
    </v-btn>

    <v-navigation-drawer
      v-model="drawer"
      absolute temporary>
      <v-list>
        <v-list-tile avatar>
          メニュー
        </v-list-tile>

        <v-divider/>

        <v-flex
          v-for="content in output.spTopPageContents"
          @click="changePage(content.slug)"
          class="topPageSpMenuEl bgCoverSettings" :key="content.title"
          :style="'background-image: url(' + content.bgUrl + ');'">
          <v-flex class="topPageSpMenuName">
            {{ content.title }}
          </v-flex>
        </v-flex>
      </v-list>

      <v-flex>
        <v-layout justify-center>
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

    </v-navigation-drawer>
  </v-flex>
</template>

<script>

import { contentsLoader, loaderPresets } from '@/utils'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'TopPageSp',
  data() {
    return {
      loader: {
        isLoading: true,
        targetParams: []
      },
      output: {},
      drawer: null
    }
  },
  methods: {
    changePage(slug) {
      console.log('slug: ' + slug)
      this.$store.commit('startTransition', slug)
      this.$store.commit('changePage')
    }
  },
  async created() {
    contentsLoader.addLoadTarget(this.loader, loaderPresets.spTopPageContents)
    contentsLoader.addLoadTarget(this.loader, loaderPresets.newComersSettings)
    this.output = await contentsLoader.startLoading(this.loader)
  }
}
</script>

<style scoped>
.bgCoverSettings{
  background-size: cover;
  background-repeat: none;
  background-position: center center;
}

#topPageSpMenu {
  position: fixed;
  top: 15px;
  right: 20px;
  color: black;
}
.topPageSpMenuEl {
  margin: 20px 0px;
  height: 100px;
  padding: 0;
  position: relative;
}
.topPageSpMenuName {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px 10px;
}

.topSpIntroContainer {
  background: rgba(0, 0, 0, 0.5);
  padding: 30px;
  color: white;
  border-radius: 10px;
}

.topSpIntroTitle {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 10px;
  border-bottom: 1px solid white;
}
</style>
