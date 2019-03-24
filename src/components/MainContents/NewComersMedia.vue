<template>
<v-flex xs8 id="NewComersMedia"
  :style="'height: ' + (windowSize.y-48) + 'px;'">

  <v-layout fill-height row>
    <!-- media content area -->
    <v-flex xs10>
      <template v-if="!$store.state.editMode">
        <v-layout class="newComersMediaBox" fill-height align-center>
          <v-flex v-if="showMediaBox" class="newComersMediaMain">
            <!-- For video -->
            <template v-if="selectedMedia.type === 'video'">
              <v-layout row>
                <v-flex class="newComersMediaMainTitle">
                  新歓PV
                </v-flex>
                <v-spacer/>
                <v-btn flat icon @click="closeMediaDialog">
                  <v-icon> close </v-icon>
                </v-btn>
              </v-layout>
              <v-divider/>
              <v-layout fill-height align-center justify-center>
                <div class="newComersIFrameCont">
                  <iframe
                    :src="(currentMedia).data.videoPath"
                    frameborder="0" allowfullscreen
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture">
                  </iframe>
                </div>
              </v-layout>
            </template>

            <!-- For bills -->
            <template v-else>
              <v-layout row>
                <v-flex class="newComersMediaMainTitle">
                  新歓ビラ
                  <template v-if="selectedMedia.index === 0"> 表面 </template>
                  <template v-else> 裏面 </template>
                </v-flex>
                <v-spacer/>
                <v-btn flat icon @click="closeMediaDialog">
                  <v-icon> close </v-icon>
                </v-btn>
              </v-layout>
              <v-divider/>
              <v-flex style="padding-top: 3%">
                <v-img contain
                  :src="(currentMedia).data.billPaths[selectedMedia.index]"
                  height="300"
                  aspect-ratio="1.41">
                  <v-dialog v-model="imageModal" width="800">
                    <v-btn slot="activator"
                            @click="setModalUrl(url)"
                            fab icon color="blue"
                            small>
                      <v-icon>fullscreen</v-icon>
                    </v-btn>
                    <v-card>
                      <v-img :src="(currentMedia).data.billPaths[selectedMedia.index]"/>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-img>
              </v-flex>
            </template>
          </v-flex>
        </v-layout>
      </template>

      <template v-else>
        <v-layout column class="newComersMediaBoxEdit"
          :style="'height: ' + (windowSize.y-100) + 'px;'">
          <v-flex>
            <v-layout row>
              <v-flex style="font-size: 2em">
                編集
              </v-flex>
              <v-spacer/>
              <v-btn @click="uploadData">
                <v-icon>cloud_upload</v-icon>アップロード
              </v-btn>
            </v-layout>
          </v-flex>
          <v-divider/>
          <v-flex style="font-size: 1.5em">
            新歓PV
          </v-flex>
          <v-divider/>
          <v-flex>
            <v-layout row>
              <v-flex style="padding: 10px">
                <v-img :src="currentVideoThumbPath"/>
              </v-flex>
              <v-flex style="padding: 10px">
                <v-text-field
                  :value="(currentMedia).data.videoPath"
                  @input="changeMediaData('video', $event)"
                  dense label="動画URL"/>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex style="font-size: 1.5em">
            新歓ビラ
          </v-flex>
          <v-divider/>
          <v-flex>
            <v-layout column>
              <v-flex v-for="(path, index) in (currentMedia).data.billPaths">
                <v-layout row>
                  <v-flex style="padding: 10px">
                    <v-img :src="path"/>
                  </v-flex>
                  <v-flex style="padding: 10px">
                    <v-text-field
                      disabled
                      :value="path"
                      @input="changeMediaData('bill', $event)"
                      dense label="ビラURL"/>
                    <image-uploader-new
                      :mediaIndex="currentMediaIndex()"
                      :extraRefData="index"
                      @editMediaData="editMediaBillData"
                      />
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </template>
    </v-flex>


    <!-- media menu area -->
    <v-flex xs2>
      <v-layout align-center fill-height>
        <v-flex id="newComersMenuContainer">
          <v-flex>
            <v-flex style="font-size: 1.2em; font-weight: bold">
              新歓PV
            </v-flex>
            <v-flex
              class="newComersMediaMenuEl bgCoverSettings"
              :class="{newComersMediaMenuElSelected: selectedMedia.type === 'video'}"
              :style="'background-image: url(' + currentVideoThumbPath + ')'"
              @click="changeMedia('video', media.path)">
              <v-icon x-large color="red"> play_circle_filled_white </v-icon>
            </v-flex>
          </v-flex>

          <v-divider/>

          <v-flex>
            <v-flex style="font-size: 1.2em; font-weight: bold">
              新歓ビラ
            </v-flex>
            <v-flex v-for="(path, index) in (currentMedia).data.billPaths"
              class="newComersMediaMenuEl bgCoverSettings"
              :class="{newComersMediaMenuElSelected: selectedMedia.type === 'bill'
                        && selectedMedia.index === index}"
              :style="'background-image: url(' + (currentMedia).data.billPaths[index] + ')'"
              @click="changeMedia('bill', index)"/>
          </v-flex>

        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>

  <!-- snackbars -->
  <v-snackbar
    v-if="updateTrigger.success"
    v-model="updateTrigger.success"
    :right="true"
    :timeout="3000"
    >
    <v-icon color="green">check_circle_outline</v-icon>
    更新完了
  </v-snackbar>
  <v-snackbar
    v-if="updateTrigger.failed"
    v-model="updateTrigger.failed"
    :right="true"
    :timeout="3000"
    >
    <v-icon color="red">check_circle_outline</v-icon>
    更新失敗
  </v-snackbar>
</v-flex>
</template>

<script>
import ImageUploaderNew from '@/utils/imageUploaderNew'
import firestore from '@/firebase_firestore'

export default {
  name: 'NewComersMedia',
  props: ['settings', 'media', 'windowSize'],
  components: {
    'image-uploader-new': ImageUploaderNew
  },
  data() {
    return {
      imageModal: false,
      imageModalUrl: "",
      mSettings: {},
      mMediaList: [],
      showMediaBox: false,
      selectedMedia: {
        'type': '',
        'index': ''
      },
      updateTrigger: {
        success: false,
        failed: false
      }
    }
  },
  computed: {
    currentMedia() {
      return this.mMediaList.filter(el => el.year === this.mSettings.validYear)[0]
    },
    currentVideoThumbPath() {
      let currentMedia = this.mMediaList.filter(el => el.year === this.mSettings.validYear)[0]
      if (currentMedia === undefined) {
        return ''
      }
      let youtubeId = currentMedia.data.videoPath.split('/')[4]

      return `http://img.youtube.com/vi/${youtubeId}/0.jpg`
    }
  },
  methods: {
    currentMediaIndex() {
      for (let [index, el] of this.mMediaList.entries()) {
        if (el.year === this.mSettings.validYear) {
          return index
        }
      }
    },
    setModalUrl(url) {
      this.imageModalUrl = url
    },
    changeMedia(type, index=0){
      if (this.selectedMedia.type === type && this.selectedMedia.index === index) {
        this.closeMediaDialog()
      } else {
        this.selectedMedia = {
          'type': type,
          'index': index
        }
        this.showMediaBox = true
      }
    },
    closeMediaDialog() {
      this.selectedMedia = {
        'type': '',
        'index': ''
      }
      this.showMediaBox = false
    },
    changeMediaData(type, data){
      if (type === 'video'){
        let targetIndex
        for (let [index, el] of this.mMediaList) {
          if (el.year === this.mSettings.validYear) {
            targetIndex == index
            break
          }
        }
        this.mMediaList[targetIndex].data.videoPath = data
      } else {

      }
    },
    editMediaBillData(index, url, extraRef) {
      this.$set(this.mMediaList[index].data.billPaths, extraRef, url)
    },
    async uploadData() {
      Promise.resolve()
        .then(() => {
          return Promise.all(this.mMediaList.map(entry => {
            return new Promise((fulfilled, rejected) => {
              firestore
                .collection('Contents/NewComers/media/')
                .doc(String(entry.year))
                .set(entry.data)
                .then(() => {
                  fulfilled()
                })
            })
          }))
        })
        .then(() => {
          this.$set(this.updateTrigger, 'success', true)
          this.$emit('refreshData')
        })
        .catch((err) => {
          console.error(err)
          this.$set(this.updateTrigger, 'failed', true)
        })
    },
    copyData(data) {
      let media = data['newComersMedia']
      let settings = data['newComersSettings']

      this.mMediaList.push({
        'year': settings.validYear,
        'data': media
      })
      this.mSettings = settings
    }
  },
  created() {
    this.copyData({
      'newComersMedia': this.media,
      'newComersSettings': this.settings
    })
  }
}
</script>

<style>
#NewComersMedia {
  overflow: hidden;
}

.newComersMediaBox {
  padding: 10px 20px 30px 20px;
  box-sizing: border-box;
}

.newComersMediaBoxEdit {
  padding: 30px 20px 30px 20px;
  box-sizing: border-box;
  background: white;
  margin: 5%;
  border-radius: 20px;
  overflow: scroll;
}


.newComersMediaMain {
  background: white;
  border-radius: 20px;
  padding: 15px 15px 30px 15px;
  box-sizing: border-box;
}
.newComersMediaMainTitle {
  font-weight: bold;
  font-size: 1.4em;
}

.newComersMediaMenuEl {
  width: 90%;
  height: 70px;
  margin: 5%;
  cursor: pointer;
}
.newComersMediaMenuElSelected {
  background-blend-mode: screen;
  background-color: rgba(255, 255, 255, 0.3);
}

.newComersMediaMenuEl:hover{
  background-blend-mode: screen;
  background-color: rgba(255, 255, 255, 0.4);
}

.bgCoverSettings{
  background-size: cover;
  background-repeat: none;
  background-position: center center;
}

.newComersIFrameCont {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 59%;
}


.newComersIFrameCont iframe{
  position: absolute;
  top: 3%;
  left: 0;
  width: 100%;
  height: 100%;
}

#newComersMenuContainer {
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 30px 0px 0px 30px;
}
</style>
