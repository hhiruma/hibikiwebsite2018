<template>
<v-navigation-drawer
  style="height: 100vh"
  v-model="$store.state.spSideBarDrawer"
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
</template>

<script>
import { contentsLoader, loaderPresets } from '@/utils'

export default {
  name: 'SideBarSp',
  data() {
    return {
      loader: {
        isLoading: true,
        targetParams: []
      },
      output: {},
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
    this.output = await contentsLoader.startLoading(this.loader)
  }
}
</script>

<style>
.bgCoverSettings{
  background-size: cover;
  background-repeat: none;
  background-position: center center;
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

</style>
