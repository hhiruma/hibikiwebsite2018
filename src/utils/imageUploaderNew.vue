<template>
<v-dialog
  v-model="openImageUpdater"
  width="600" height="400">
  <v-btn slot="activator" @click="resetImageUpdater">
    画像を追加
  </v-btn>
  <v-flex>
    <v-stepper v-model="imageUpdaterStep">
      <!-- header -->
      <v-stepper-header>
        <v-stepper-step :complete="imageUpdaterStep > 1" step="1">追加方式選択</v-stepper-step>
        <v-divider/>
        <v-stepper-step :complete="imageUpdaterStep > 2" step="2">画像追加</v-stepper-step>
      </v-stepper-header>

      <!-- items -->
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-select dense
            label="追加方式"
            prepend-icon="format_list_numbered"
            v-model="imgUploadType"
            :items="['file', 'url']"/>
          <v-btn @click="imageUpdaterStep = 2">
            追加へ
          </v-btn>
        </v-stepper-content>
        <v-stepper-content step="2">
          <!-- Upload via file -->
          <template v-if="imgUploadType === 'file'">
            <v-layout>
              <template v-if="fileData === null">
                <v-flex xs5 justify-center fill-height
                        style="border: 1px red dotted; padding: 10px;"
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
              </template>

              <template v-else-if="fileData !== null && fileDataUrl === ''">
                <v-flex xs5 style="border: 1px red dotted; padding: 10px;">
                  {{ fileData.name }}
                </v-flex>
              </template>

              <template v-else>
                <v-flex xs5>
                  <v-img :src="fileDataUrl"/>
                </v-flex>
              </template>

              <v-flex style="padding: 20px">
                <v-text-field
                  disabled
                  prepend-icon="link"
                  label="アップロードした画像のURL"
                  v-model="fileDataUrl" />
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-btn v-if="fileData === null" disabled>
                <v-icon>cloud_upload</v-icon>
                サーバーにアップロード
              </v-btn>
              <v-btn v-else @click="uploadImage">
                <v-icon>cloud_upload</v-icon>
                サーバーにアップロード
              </v-btn>
              <v-progress-linear v-model="uploadProgress"/>
            </v-layout>
          </template>

          <!-- Upload via url -->
          <template v-else>
            <v-layout>
              <template v-if="fileDataUrl === ''">
                <v-flex xs5 style="border: 1px red dotted; padding: 10px;">
                  画像なし
                </v-flex>
              </template>

              <template v-else>
                <v-flex xs5>
                  <v-img :src="fileDataUrl"/>
                </v-flex>
              </template>
              <v-flex style="padding: 20px">
                <v-text-field
                  prepend-icon="link"
                  label="使用する画像のURL"
                  v-model="fileDataUrl" />
              </v-flex>
            </v-layout>
          </template>

          <v-divider/>

          <v-layout>
            <v-btn @click="() => {imageUpdaterStep = 1; fileData = null}"> 戻る </v-btn>
            <v-btn v-if="fileDataUrl === ''" disabled> 確認へ </v-btn>
            <v-btn v-else @click="editMediaData"> 画像を追加する </v-btn>
          </v-layout>
        </v-stepper-content>
      </v-stepper-items>

    </v-stepper>
  </v-flex>
</v-dialog>
</template>

<script>
import storage from '@/firebase_storage'

export default {
  name: 'ImageUploaderNew',
  props: ['mediaIndex', 'extraRefData'],
  data() {
    return {
      openImageUpdater: false,
      imageUpdaterStep: 0,
      fileUploadDrag: null,
      imgUploadType: 'file',
      fileData: null,
      fileDataUrl: '',
      uploadProgress: 0
    }
  },
  methods: {
    resetImageUpdater() {
      this.imageUpdaterStep = 1
      this.fileData = null
      this.fileDataUrl = ''
      this.uploadProgress = 0
    },
    checkDrag(e, key, stat){
      if (status && event.dataTransfer.types == "text/plain") {
        return false
      }
      this.fileUploadDrag = status ? key : null
    },
    onDrop(e, key='', image={}){
      let fileList = event.targetfiles ? event.targetfiles : event.dataTransfer.files
      if (fileList.length == 0){
        console.error('ERROR: no file found')
        return
      }

      this.fileData = fileList[0]
    },
    setImgUploadFile(e) {
      e.preventDefault()
      this.fileData = e.target.files[0]
    },
    async uploadImage(){
      const blob = new Blob([this.fileData], { type:"image/jpeg"})
      const fileName = this.fileData.name
      const uploadRef = storage.ref('images/stages/').child(fileName)

      this.uploadProgress = 0

      let uploadTask = uploadRef.put(blob)

      uploadTask.on('state_changed', snapshot => {
          this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      }, function() {},
      () => {
        uploadRef.getDownloadURL().then(url => {
          this.fileDataUrl = url
        })
      })
    },
    editMediaData(){
      console.log(this.mediaIndex)
      console.log(this.fileDataUrl)
      console.log(this.extraRefData)
      this.$emit('editMediaData', this.mediaIndex, this.fileDataUrl, this.extraRefData)
    }
  }
}
</script>

<style>
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
