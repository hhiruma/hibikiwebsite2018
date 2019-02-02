<template>
<v-layout row>
  <template v-if="index % 2 == 0">
    <v-flex align-center xs7>
      <!-- Image area -->
      <v-card class="AboutUsMediaArea">

        <!-- Normal Mode -->
        <template v-if="!$store.state.editMode">
          <!-- Image carousel-->
          <v-window v-model="pageContent.carouselState" max>
            <v-window-item v-for="url in pageContent.imagePaths" :key="url">
              <v-img :src='url' height=500 ></v-img>
            </v-window-item>
          </v-window>

          <!-- carousel navigator -->
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
        </template>


        <!-- Edit Mode -->
        <template v-else>
          <v-layout fill-height width="100%" style="background: white">
            <!-- Image display winodw -->
            <v-flex style="height: 500px; border: black solid 1px;
              background: lightblue; padding: 20px; color: white; overflow: scroll;">
              <v-flex>

                <v-flex>
                  <v-layout row>
                    <!-- Title -->
                    <v-flex style="padding: 10px; color: black; font-size: 1.3em; font-weight: bold;">
                      <v-icon>photo</v-icon> 画像データ
                    </v-flex>

                    <v-spacer/>

                    <!-- update verification message  -->
                    <v-flex style="padding: 10px; margin: 5px; background: rgba(255, 255, 255, 0.4); border-radius: 10px">
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
                </v-flex>

                <hr>

                <v-flex style="padding: 15px 0px;">
                  <v-flex v-for="newImage, index in newImageEntries" :key="newImage.url" style="padding: 5px 0px;">
                    <v-flex style="padding: 10px; background: rgba(255, 255, 255, 0.5); border-radius: 10px;" >
                      <v-layout row>
                        <!-- thumbnail area -->
                        <v-flex xs4>
                          <v-layout column fill-height>
                            <v-img v-if="newImage.url !== ''" contain
                              :src='newImage.url' aspect-ratio=1.77 style="border-radius: 10px;"/>
                            <div v-else style="width: 100%; height: 56%; border: 1px black dashed; color: black;
                              background: rgba(0, 0, 0, 0.1); padding: 10px; text-align: center;">
                              画像なし
                            </div>
                          </v-layout>
                        </v-flex>

                        <!-- img info area -->
                        <v-flex xs8 style="padding: 10px;">
                          <v-layout row>
                            <v-select dense
                              label="順番"
                              prepend-icon="format_list_numbered"
                              @input="val => updateItem(val, index, 'order')"
                              :value="newImageEntries[index].order"
                              :items="Array.from(Array(newImageEntries.length).keys())"/>
                            <v-select dense v-if="newImage.url === ''"
                              label="形式"
                              prepend-icon="format_list_numbered"
                              @input="val => updateItem(val, index, 'uploadType')"
                              :value="newImageEntries[index].uploadType"
                              :items="uploadTypeNames" />
                          </v-layout>

                          <template v-if="index >= pageContent.imagePaths.length">
                            <template v-if="newImageEntries[index].uploadType === 'ファイル'">
                              <v-menu v-model="menu_test" offset-x
                                      :close-on-content-click="false" :nudge-width="100">
                                <v-btn @click="setImgUploadEntryIndex(index)"
                                  slot="activator" color="indigo"> ファイルをアップロード </v-btn>

                                <v-card style="padding: 10px;">
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
                            <v-text-field dense v-else
                              label="画像URL" v-model="newImageEntries[index].url"/>
                          </template>

                          <v-checkbox dense
                            label="削除する"
                            v-model="newImageEntries[index].delete"
                            prepend-icon="delete_forever">
                          </v-checkbox>
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
                </v-flex>
              </v-flex>
            </v-flex>
          </v-layout>
        </template>
      </v-card>
    </v-flex>

    <!-- Description area -->
    <v-flex xs5 align-content-end class="AboutUsDescArea">
      <v-flex class="AboutUsDesc">

        <!-- Normal Mode -->
        <template v-if="!$store.state.editMode">
          <v-flex class="AboutUsDescTitle">
            {{ pageContent.title }}
          </v-flex>
          <hr> <br>
          {{ pageContent.content }}
        </template>

        <!-- Edit Mode -->
        <template v-else>
          <v-flex style="font-size: 1.5em">
            <v-icon>edit</v-icon>  編集モード
          </v-flex>
          <br>
          <v-text-field
            outline
            label="Title"
            :background-color="ifEdited('title')"
            v-model="mPageContent.title">
          </v-text-field>
          <v-textarea
            outline auto-grow
            label="Text"
            :background-color="ifEdited('content')"
            v-model="mPageContent.content" >
          </v-textarea>
          <v-layout justify-end>
            <v-btn color="info" @click="uploadData(mPageContent)">
              更新
            </v-btn>
          </v-layout>
        </template>
      </v-flex>
    </v-flex>
  </template>



  <template v-else>
    <v-flex xs5 align-content-end class="AboutUsDescArea">
      <v-flex class="AboutUsDesc">
        <template v-if="!$store.state.editMode">
          <v-flex class="AboutUsDescTitle">
            {{ pageContent.title }}
          </v-flex>
          <hr> <br>
          {{ pageContent.content }}
        </template>
        <template v-else>
          <v-flex style="font-size: 1.5em">
            <v-icon>edit</v-icon>  編集モード
          </v-flex>
          <br>
          <v-text-field
            outline
            label="Title"
            v-model="mPageContent.title">
          </v-text-field>
          <v-textarea
            outline auto-grow
            label="Text"
            v-model="mPageContent.content" >
          </v-textarea>
          <v-layout justify-end>
            <v-btn color="info">
              更新
            </v-btn>
          </v-layout>
        </template>
      </v-flex>
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

  <v-snackbar
    v-if="uploadSuccess"
    v-model="uploadSuccess"
    :right="true"
    :timeout="3000"
    >
    <v-icon color="green">check_circle_outline</v-icon>
    更新完了
  </v-snackbar>
  <v-snackbar
    v-if="uploadFailed"
    v-model="uploadFailed"
    :right="true"
    :timeout="3000"
    >
    <v-icon color="red">check_circle_outline</v-icon>
    更新失敗
  </v-snackbar>
</v-layout>
</template>


<script>
import firestore from '@/firebase_firestore'
import storage from '@/firebase_storage'
import { contentsLoader, loaderPresets } from '@/utils'
import AboutUsDescEl from '@/components/MainContents/AboutUsDescEl'

export default {
  name: 'AboutUsDescEl',
  props: ['index', 'pageContent'],
  data() {
    return {
      mPageContent: {},
      uploadSuccess: false,
      uploadFailed: false,
      newImageEntries: [],
      imgUploadInfo: {
        'entryIndex': -1,
        'fileData': null
      },
      uploadTypeNames: ['ファイル', 'URL指定'],
      menu_test: false,
      fileUploadDrag: null,
      uploadProgress: 0
    }
  },
  computed: {
    imagesOrderVerified () {
      for (const image of this.newImageEntries) {
        console.log(this.newImageEntries.filter(el => el.order === image.order).length)
        if (this.newImageEntries.filter(el => el.order === image.order).length !== 1){
          return false
        }
      }
      return true
    }
  },
  methods: {
    updateItem(item, index, keyName){
      let originalItem = this.newImageEntries[index]
      originalItem[keyName] = item

      this.newImageEntries= [
        ...this.newImageEntries.slice(0, index),
        originalItem,
        ...this.newImageEntries.slice(index+1)
      ]
    },
    addNewImg(){
      const newImageEntries= this.newImageEntries.length
      this.newImageEntries.push({
        'url': '',
        'delete': false,
        'order': newImageEntries,
        'uploadType': 'ファイル'
      })
    },
    uploadData(newData) {
      let generatedImagesData = []
      this.newImageEntries= this.newImageEntries.sort((a, b) => {
        if (a.order < b.order) return -1;
        if (a.order > b.order) return  1;
        return 0;
      })
      for (const el of this.newImageEntries) {
        if (el.delete || el.url === '') { continue }
        generatedImagesData.push(el.url)
      }
      newData.imagePaths = generatedImagesData

      if (!this.imagesOrderVerified){
        this.uploadFailed = true
        return
      }

      firestore
        .collection('Contents/AboutUs/Descriptions')
        .doc(newData.docId)
        .set(newData)
        .then(() => {
          this.uploadSuccess = true
          this.$emit('refreshData')
        })
        .catch(() => {
          this.uploadFailed = true
        })
    },
    async uploadNewImage() {
      if (this.imgUploadInfo.entryIndex === -1){
        console.error('ERROR: invalid img upload entry inex')
        return
      }
      if (this.imgUploadInfo.fileData === null) {
        console.error('ERROR: image upload target not specified')
        return
      }

      const blob = new Blob([this.imgUploadInfo.fileData], { type:"image/jpeg"})
      const fileName = this.imgUploadInfo.fileData.name
      const uploadRef = storage.ref('images/aboutUs/').child(fileName)
      this.uploadProgress = 0

      let uploadTask = uploadRef.put(blob)

      uploadTask.on('state_changed', snapshot => {
          this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      }, function() {},
        () => {
        uploadRef.getDownloadURL().then(url => {
          this.newImageEntries[this.imgUploadInfo.entryIndex]['url'] = url
        })
      })
    },
    setImgUploadEntryIndex(index) {
      this.imgUploadInfo = {
        'entryIndex': index,
        'fileData': null
      }
    },
    setImgUploadFile(e) {
      e.preventDefault()
      this.imgUploadInfo.fileData = e.target.files[0]
    },
    ifEdited(key) {
      if (this.mPageContent[key] === this.pageContent[key]){
        return ''
      } else {
        return 'green'
      }
    },
    checkDrag(e, key, stat){
      if (status && event.dataTransfer.types == "text/plain") {
        return false
      }
      this.fileUploadDrag = status ? key : null
    },
    resetImgUploadInfo(){
      this.imgUploadInfo = {
        'entryIndex': -1,
        'fileData': null
      }
    },
    onDrop(e, key='', image={}){
      let fileList = event.targetfiles ? event.targetfiles : event.dataTransfer.files
      if (fileList.length == 0){
        console.error('ERROR: no file found')
        return
      }

      this.imgUploadInfo.fileData = fileList[0]
      return
    }
  },
  created() {
    // deep copy page content
    this.mPageContent = JSON.parse(JSON.stringify(this.pageContent))

    this.newImageEntries= Array(this.mPageContent.imagePaths.length)
    for (const [i, image] of this.mPageContent.imagePaths.entries()){
      this.newImageEntries[i] = {
        'url': image,
        'delete': false,
        'order': i
      }
    }
  }
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
