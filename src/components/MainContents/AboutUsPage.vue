<template>
  <v-layout id="AboutUsContainer">
    <template v-if="!loader.isLoading">
      <v-flex xs3 id="AboutUsMenu">
        <v-list dense style="border-radius: 10px; width: 220px">
          <v-subheader>MENU</v-subheader>

          <v-divider></v-divider>

          <v-list-tile v-for="pageContent in output.pageContents" :key="pageContent.order"
            @click="changeMenu(pageContent.order)">
            <v-list-tile-avatar>
              <v-icon v-if="pageContent.order == selectedMenuOrder">arrow_right</v-icon>
            </v-list-tile-avatar>
            {{ pageContent.title }}
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-flex xs8 id="AboutUsDescContainer">
        <v-flex id="AboutUsDesc">
          {{ output.pageContents.filter(el => el.order === selectedMenuOrder)[0].content }}
        </v-flex>
      </v-flex>
    </template>
  </v-layout>
</template>

<script>
import firestore from '@/firebase_firestore'
import { contentsLoader, loaderPresets } from '@/utils'

export default {
  name: 'AboutUsPage',
  data() {
    return {
      selectedMenuOrder: 0,
      loader: {
        isLoading: true,
        targetParams: [],
      },
      output: {} //expect 'pageContents'
    }
  },
  methods: {
    changeMenu(order) {
      this.selectedMenuOrder = this.output.pageContents.filter(el => el.order === order)[0].order
    }
  },
  async created() {
    contentsLoader.addLoadTarget(this.loader, loaderPresets.aboutUsContents)

    this.output = await contentsLoader.startLoading(this.loader)
  }
}
</script>

<style scoped>
#AboutUsContainer {
  /* position: absolute; */
  height: 100%;
  width: 100%;
}

#AboutUsDescContainer {
  /* position: absolute; */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
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
