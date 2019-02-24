<template>
  <v-card class="AboutUsMediaArea">

    <!-- Normal Mode -->
    <template v-if="!$store.state.editMode">
      <!-- Image Carousel -->
      <v-window v-model="pageContent.carouselState" max>
        <v-window-item v-for="url in pageContent.imagePaths" :key="url">
          <v-img :src='url' height=500 ></v-img>
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

    </template>


    <!-- Edit Mode -->
    <template v-else>
      <!-- Image display winodw -->
      <v-layout fill-height width="100%" style="background: white">
        <v-flex class="editImgWindow">

          <!-- Title bar -->
          <v-layout row>
            <!-- Title -->
            <v-flex style="padding: 10px; color: black; font-size: 1.3em; font-weight: bold;">
              <v-icon>photo</v-icon> 画像データ
            </v-flex>

            <v-spacer/>

            <!-- Update verification message  -->
            <v-flex class="updatabilityMessageBox">
              <v-flex v-if="imagesOrderVerified" style="color: black;">
                <v-icon color="green">check_circle_outline</v-icon>
                順番は重複していません。更新可能です。
              </v-flex>
              <v-flex v-else style="color: red;">
                <v-icon color="red">check_circle_outline</v-icon>
                順番が重複している画像があります。
              </v-flex>
            </v-flex>
          </v-layout>

          <hr>

          <!-- Entry area -->
          <v-layout column style="padding: 15px 0px;">
            <v-flex v-for="newImage, index in newImageEntries" :key="newImage.url" style="padding: 5px 0px;">

              <!-- Entry container -->
              <v-flex class="entryContainer">
                <v-layout row>

                  <!-- Thumbnail area -->
                  <v-flex xs4>
                    <v-layout column fill-height>
                      <v-img v-if="newImage.url !== ''" contain
                        :src='newImage.url' aspect-ratio=1.77 style="border-radius: 10px;"/>
                      <div v-else class="entryThumnailNoImage" >
                        画像なし
                      </div>
                    </v-layout>
                  </v-flex>

                  <!-- Img info area -->
                  <v-flex xs8 style="padding: 10px;">
                    <!-- State order  -->
                    <v-select dense
                      label="順番"
                      prepend-icon="format_list_numbered"
                      @input="val => updateItem(val, index, 'order')"
                      :value="newImageEntries[index].order"
                      :items="Array.from(Array(newImageEntries.length).keys())"/>

                    <v-text-field dense
                      v-if="newImage.url !== ''"
                      label="画像のURL"
                      prepend-icon="link"
                      v-model="newImageEntries[index].url"/>

                    <!-- Put additional models for new entries -->
                    <template v-if="index >= pageContent.imagePaths.length">
                      <!-- Add file upload button  -->
                      <image-uploader-new
                        :mediaIndex="index"
                        @editMediaData="editMediaData"
                        />
                      <v-btn dense @click="removeNewMedia(index)">
                        <v-icon>delete_forever</v-icon>
                        取り消し
                      </v-btn>
                    </template>

                    <template v-else>
                      <v-checkbox dense
                        label="削除する"
                        v-model="newImageEntries[index].delete"
                        prepend-icon="delete_forever">
                      </v-checkbox>
                    </template>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-flex>
            <v-flex style="padding: 10px">
              <v-btn @click="addNewImg"
                    style="background: rgba(255, 255, 255, 0.5); border-radius: 10px; width: 100%; margin: 0">
                <v-icon color="lightgray">add_circle</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </template>
  </v-card>
</template>

<script>
import storage from '@/firebase_storage'
import ImageUploaderNew from '@/utils/imageUploaderNew'

export default {
  name: 'AboutUsDescElImageArea',
  props: ['pageContent', 'newImageEntries'],
  components: {
    'image-uploader-new': ImageUploaderNew
  },
  computed: {
    imagesOrderVerified () {
      for (const image of this.newImageEntries) {
        if (this.newImageEntries.filter(el => el.order === image.order).length !== 1){
          return false
        }
      }
      return true
    }
  },
  methods: {
    addNewImg(){
      this.$emit('addNewImg')
    },
    updateItem(item, index, keyName){
      this.$emit('updateItem', item, index, keyName)
    },
    editMediaData(index, url) {
      this.$emit('addNewImgUrl', index, url)
    },
    removeNewMedia(index) {
      this.$emit('removeNewImg', index)
    }
  }
}
</script>

<style scoped>
.carouselSelector {
  position: absolute;
  width: 100%;
  height: 50px;
  bottom: 0px;
}
.editImgWindow{
  height: 500px;
  border: black solid 1px;
  background: lightblue;
  padding: 20px;
  color: white;
  overflow: scroll;
}

.updatabilityMessageBox{
  padding: 10px;
  margin: 5px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 10px;
}

.entryContainer {
  padding: 10px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
}

.entryThumnailNoImage {
  width: 100%;
  height: 56%;
  border: 1px black dashed;
  color: black;
  background: rgba(0, 0, 0, 0.1);
  padding: 10px;
  text-align: center;
}
</style>
