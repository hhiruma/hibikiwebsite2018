<template>
<v-layout row>
  <template v-if="index % 2 == 0">
    <v-flex align-center xs7>
      <!-- Image area -->
      <v-card class="AboutUsMediaArea">
        <about-us-desc-el-image-area
          :pageContent="pageContent"
          :newImageEntries="newImageEntries"
          @removeNewImg="removeNewImg"
          @updateItem="updateItem"
          @addNewImg="addNewImg"
          @addNewImgUrl="addNewImgUrl"/>
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
            v-model="mPageContent.title"/>
          <v-textarea
            outline auto-grow
            label="Text"
            :background-color="ifEdited('content')"
            v-model="mPageContent.content"/>
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
            v-model="mPageContent.title"/>
          <v-textarea
            outline auto-grow
            label="Text"
            :background-color="ifEdited('content')"
            v-model="mPageContent.content"/>
          </v-textarea>
          <v-layout justify-end>
            <v-btn color="info" @click="uploadData(mPageContent)">
              更新
            </v-btn>
          </v-layout>
        </template>
      </v-flex>
    </v-flex>

    <v-flex align-center xs7>
      <!-- Image area -->
      <v-card class="AboutUsMediaArea">
        <about-us-desc-el-image-area
          :pageContent="pageContent"
          :newImageEntries="newImageEntries"
          @updateItem="updateItem"
          @removeNewImg="removeNewImg"
          @addNewImg="addNewImg"
          @addNewImgUrl="addNewImgUrl"/>
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
import AboutUsDescElImageArea from '@/components/MainContents/AboutUsDescElImageArea'

export default {
  name: 'AboutUsDescEl',
  props: ['index', 'pageContent'],
  components: {
    'about-us-desc-el-image-area': AboutUsDescElImageArea,
  },
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
      const newImageEntries = this.newImageEntries.length
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
    addNewImgUrl(index, url){
      this.newImageEntries[index]['url'] = url
    },
    removeNewImg(index) {
      this.newImageEntries.splice(index, 1)
    },
    ifEdited(key) {
      if (this.mPageContent[key] === this.pageContent[key]){
        return ''
      } else {
        return 'green'
      }
    },
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
</style>
