<template>
<v-menu v-model="imageUploadMenuShow" offset-x
        :close-on-content-click="false" :nudge-width="100">
  <!-- Upload button -->
  <v-btn @click="setImgUploadEntryIndex(index)"
    slot="activator" color="indigo"> ファイルをアップロード </v-btn>

  <!-- Upload menu -->
  <v-card style="padding: 10px;">
    <!-- Before selecting file -->
    <v-layout v-if="imgUploadInfo.fileData === null"
              style="margin: 10px 0px; background: lightblue; border-radius: 10px; height: 150px">
      <v-flex style="padding: 10px;">
        <v-layout fill-height justify-center>
          <v-flex style="border: 1px red dotted;"
                  @dragover.prevent="checkDrag($event, 'new', true)"
                  @dragleave.prevent="checkDrag($event, 'new', false)"
                  @drop.prevent="onDrop" >
            <v-layout fill-height justify-center align-center>
              <v-flex style="text-align: center">
                ここにファイルをドロップ<br>
                または
                <input @change="setImgUploadFile" id="fileSelectBtn" name="fileSelectBtn" type="file" style="display: none;"/>
                <label for="fileSelectBtn">
                  <v-layout fill-height justify-center align-center row>
                    <div class="fileSelectBtnLabel">
                      ファイルを選択
                    </div>
                  </v-layout>
                </label>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>

    <!-- After selecting file -->
    <v-layout v-else
              style="margin: 10px 0px; background: lightblue; border-radius: 10px; height: 150px">
      <v-flex style="padding: 10px;">
        <v-layout fill-height justify-center>
          <v-flex>
            <v-layout column fill-height justify-center align-center>
              <div>
                {{ imgUploadInfo.fileData.name }}
              </div>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-btn @click="uploadNewImage">
      <v-icon>cloud_upload</v-icon>
      アップロード
    </v-btn>
    <v-btn v-if="imgUploadInfo.fileData" @click="resetImgUploadInfo">
      <v-icon>refresh</v-icon>
      再選択
    </v-btn>

    <v-progress-linear v-model="uploadProgress">
      </v-progress-linear>
  </v-card>
</v-menu>
</template>

<script>
export default {
  name: 'imageUplaoder',
  props: ['imgUploadInfo', 'uploadProgress', 'index'],
  data() {
    return {
      imageUploadMenuShow: false
    }
  },
  methods: {
    setImgUploadEntryIndex(index) {
      this.$emit('setImgUploadEntryIndex', index)
    },
    checkDrag(e, key, stat) {
      this.$emit('checkDrag', e, key, stat)
    },
    onDrop(e, key='', image={}) {
      this.$emit('onDrop', e, key, image)
    },
    setImgUploadFile(e) {
      this.$emit('setImgUploadFile', e)
    },
    uploadNewImage() {
      this.$emit('uploadNewImage')
    },
    resetImgUploadInfo() {
      this.$emit('resetImgUploadInfo')
    }
  }
}
</script>

<style scoped>
.fileSelectBtnLabel {
  text-align: center;
  cursor: pointer;
  border-radius: 5px;
  color: white;
  padding: 5px;
  background: rgba(0, 200, 250, 0.8);
}

.fileSelectBtnLabel:hover {
  background: rgba(0, 200, 250, 1.0);
}
</style>
