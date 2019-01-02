<template>
<v-layout row>
  <template v-if="index % 2 == 0">
    <v-flex align-center x7>
      <v-card class="AboutUsMediaArea">
        <v-window v-model="pageContent.carouselState" max>
          <v-window-item v-for="url in pageContent.imagePaths" :key="url">
              <v-img :src='url' height=500 ></v-img>
          </v-window-item>
        </v-window>

        <v-item-group dark v-model="pageContent.carouselState" mandatory>
          <v-layout row justify-center class="AboutUsDescCarouselSelector">
            <v-item v-for="i in pageContent.imagePaths.length" :key="i">
              <div slot-scope="{ active, toggle }">
                <v-btn :input-value="active" icon @click="toggle" >
                  ●
                </v-btn>
              </div>
            </v-item>
          </v-layout>
        </v-item-group>
      </v-card>
    </v-flex>
    <v-flex xs5 align-content-end class="AboutUsDescArea">
      <div class="AboutUsDesc">
        <div class="AboutUsDescTitle">
          {{ pageContent.title }}
        </div>
        <hr>
        <br>
        {{ pageContent.content }}
      </div>
    </v-flex>
  </template>
  <template v-else>
    <v-flex xs5 align-content-end class="AboutUsDescArea">
      <div class="AboutUsDesc">
        <div class="AboutUsDescTitle">
          {{ pageContent.title }}
        </div>
        <hr>
        <br>
        {{ pageContent.content }}
      </div>
    </v-flex>
    <v-flex align-center x7>
      <v-card class="AboutUsMediaArea">
        <v-window v-model="pageContent.carouselState" max>
          <v-window-item v-for="url in pageContent.imagePaths" :key="url">
              <v-img :src='url' height=500 ></v-img>
          </v-window-item>
        </v-window>

        <v-item-group dark v-model="pageContent.carouselState" mandatory>
          <v-layout row justify-center class="AboutUsDescCarouselSelector">
            <v-item v-for="i in pageContent.imagePaths.length" :key="i">
              <div slot-scope="{ active, toggle }">
                <v-btn :input-value="active" icon @click="toggle" >
                  ●
                </v-btn>
              </div>
            </v-item>
          </v-layout>
        </v-item-group>
      </v-card>
    </v-flex>
  </template>
</v-layout>
</template>


<script>
import firestore from '@/firebase_firestore'
import { contentsLoader, loaderPresets } from '@/utils'
import AboutUsDescEl from '@/components/MainContents/AboutUsDescEl'
export default {
  name: 'AboutUsDescEl',
  props: ['index', 'pageContent']
}
</script>


<style scoped>
.AboutUsMediaArea {
  position: relative;
  overflow: hidden;
  padding: 0;
}

.AboutUsDescArea {
  display: flex;
  align-items: center;
  position: relative;
}

.AboutUsDesc{
  position: relative;
  background: white;
  height: 500px;
  padding: 30px;
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

.AboutUsDescMenuEl {
  background-color: gray;
  right: 0;
  margin: 10px 0;
  cursor: pointer;
}

.AboutUsDescMenuEl:hover {
  background-color: white;
}

</style>
