<template>
  <v-layout id="AboutUsContainer">
    <template v-if="!loader.isLoading">
      <v-flex xs3 id="AboutUsMenu">
        <v-list dense style="border-radius: 10px; width: 100%">
          <v-subheader>MENU</v-subheader>

          <v-divider></v-divider>

          <v-list-tile v-for="(pageContent, index) in output.pageContents"
                       :key="pageContent.order"
                       @click="$vuetify.goTo('#aboutUsEl'+index, '{duration: 300'); changeMenu(index)">
            <v-list-tile-avatar>
              <v-icon v-if="pageContent.order == selectedMenuOrder">arrow_right</v-icon>
            </v-list-tile-avatar>
            {{ pageContent.title }}
          </v-list-tile>
        </v-list>
      </v-flex>

      <v-flex xs9 id="AboutUsMain">
        <v-layout column>
          <v-flex v-for="(pageContent, index) in output.pageContents"
                  class="AboutUsMainEl"
                  align-content-start
                  justify-end
                  >
                  <div :id="'aboutUsEl'+index">
            <about-us-desc-el
              :page-content="pageContent">
            </about-us-desc-el>
                  </div>
          </v-flex>
        </v-layout>
      </v-flex>
    </template>
  </v-layout>
</template>

<script>
import firestore from '@/firebase_firestore'
import { contentsLoader, loaderPresets } from '@/utils'
import AboutUsDescEl from '@/components/MainContents/AboutUsDescEl'

export default {
  name: 'AboutUsPage',
  data() {
    return {
      selectedMenuOrder: 0,
      loader: {
        isLoading: true,
        targetParams: [],
      },
      output: {} //expect 'pageContents',
    }
  },
  methods: {
    changeMenu(index) {
      this.selectedMenuOrder = index
      //this.selectedMenuOrder = this.output.pageContents.filter(el => el.order === order)[0].order
    }
  },
  async created() {
    contentsLoader.addLoadTarget(this.loader, loaderPresets.aboutUsContents)
    this.output = await contentsLoader.startLoading(this.loader)
  },
  components: {
    'about-us-desc-el': AboutUsDescEl,
  }
}
</script>

<style scoped>
#AboutUsContainer {
  height: 100%;
  width: 100%;
}

#AboutUsMain {
  width: 100%;
  height: 100%;
  margin: 0 0 0 5%;
  border-radius: 10px;
  background-color: rgba(50, 50, 50, 0.8);
}

.AboutUsMainEl {
  min-height: 300px;
  padding: 10px;
}

.AboutUsMediaArea {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  padding: 0;
}

.AboutUsDescArea {
  display: flex;
  align-items: center;
  padding: 30px 10px 30px 0;
  position: relative;
}

.AboutUsDescHider {
  display: block;
  position: absolute;
  left: -45px;
  top: 30px;
  width: 45px;
  height: 300px;
  background: white;
  z-index: 10000;
  border-radius: 35px 0 0 35px;
}

.AboutUsDesc{
  position: relative;
  background: white;
  border-radius: 0 10px 10px 0;
  height: 300px;
  padding: 15px 15px 15px 0;
  overflow: scroll;
}

.AboutUsDescTitle{
  font-size: 1.5em;
  font-weight: bold;
}

.AboutUsDescCarouselSelector {
  position: absolute;
  width: 100%;
  height: 50px;
  bottom: 0px;
}

#AboutUsDescMenu {
  position: absolute;
  right: 0;
  top: 5%;
}

.AboutUsDescMenuEl {
  background-color: gray;
  right: 0;
  margin: 10px 0;
  cursor: pointer;
}

.AboutUsDescMenuEl:hover {
  background-color: white;
}

#AboutUsDesc {
  position: absolute;
  right: 20px;
  bottom: 50px;
  width: 50%;
  height: 35%;
  padding: 10px;
  background-color: gray;
  box-sizing: border-box;
}

</style>
