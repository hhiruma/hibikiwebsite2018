<template>
<v-layout row>
  <v-flex align-center x7 style="padding:30px 10px">
    <v-card class="AboutUsMediaArea">
      <v-window v-model="pageContent.carouselState" max>
        <v-window-item v-for="url in pageContent.imagePaths" :key="url">
            <v-img :src='url' height=300 ></v-img>
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
    <div class="AboutUsDescHider"></div>
    <div class="AboutUsDesc">
      <div class="AboutUsDescTitle">
        {{ pageContent.title }}
      </div>
      <hr>
      <br>
      {{ pageContent.content }}
    </div>
  </v-flex>
</v-layout>
</template>


<script>
import firestore from '@/firebase_firestore'
import { contentsLoader, loaderPresets } from '@/utils'
import AboutUsDescEl from '@/components/MainContents/AboutUsDescEl'
export default {
  name: 'AboutUsDescEl',
  props: ['pageContent']
}
</script>


<style scoped>
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
