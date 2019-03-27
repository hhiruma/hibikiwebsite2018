<template>
  <v-container fluid style="padding: 0; position: relative">
    <!-- slide -->
    <v-flex id="menuSlide1"
            :style="'background: rgba(255, 255, 255, 0.8);'+
                    'position: absolute; top: 0;'+
                    'left:   '+ -(windowSize.x/5) + 'px;' +
                    'height: '+ (windowSize.y-48) + 'px;' +
                    'width:  '+ (windowSize.x/5)  + 'px;'">
    </v-flex>
    <v-flex id="menuSlide2"
            :style="'background: rgba(255, 255, 255, 0.8);' +
                    'position: absolute; top: 0;'+
                    'left:   '+ -(windowSize.x*4/5)  +'px;' +
                    'height: '+ (windowSize.y-48) + 'px;' +
                    'width:  '+ (windowSize.x*4/5)+ 'px;'">
    </v-flex>

    <template v-if="bgVideoMode">
      <!-- backgroun video -->
      <v-layout :style="'height: '+ (windowSize.y-48)+'px; position: relative'">
        <video
          id="stagesBgVideo"
          :style="'position: absolute; z-index: -1;' +
                  'width : ' + (videoSizeData).width  + 'px;' +
                  'height: ' + (videoSizeData).height + 'px;'  +
                  'left:   ' + -(videoSizeData).xDiff + 'px;' +
                  'top:    ' + -(videoSizeData).yDiff + 'px'"
          autoplay
          src="https://firebasestorage.googleapis.com/v0/b/hibikiwebsite2018.appspot.com/o/videos%2FHP%E7%94%A8.mp4?alt=media&token=9616d3ec-c02b-47a5-ab07-2913675e9b02"
        />

        <!-- button Menu -->
        <v-btn @click="slideIn"
               style="position: absolute; top: 0; left: 0;"
               color="white" large outline>
          MENU
        </v-btn>

        <v-btn v-if="bgVideoState == 'ended'"
               @click="bgVideoReplay"
               style="position: absolute; top: 0; right: 0"
               color="white" large flat>
          <v-icon>replay</v-icon> REPLAY
        </v-btn>


        <!-- Cover -->
        <v-flex :style="'background: rgba(0, 0, 0, 0.4); width: 100%; height: ' + (windowSize.y-48)+'px;'">
          <v-layout fill-height justify-center align-center column>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/hibikiwebsite2018.appspot.com/o/images%2Fstages%2Flogo.png?alt=media&token=09a2cb16-b83e-49c5-aa2f-74c5ca44dc87"
            />
          </v-layout>
        </v-flex>
      </v-layout>

    </template>

    <template v-else>
      <!-- background -->
      <v-layout :style="'position: absolute; width: 100%; top: 0;' +
                        'height: ' + (windowSize.y - 48) + 'px'">
        <v-img src="https://pbs.twimg.com/media/DuXmJyjVsAI1MYY.jpg:large">
          <v-flex style="height: 100vh; width: 100%;  background: rgba(0, 0, 0, 0.5)"/>
        </v-img>
      </v-layout>


      <v-layout id="StagesContainer" :style="'transform: translateX(0); min-height: '+ (windowSize.y-48)+'px'"
                justify-space-around align-content-space-around>
        <template v-if="!loader.isLoading">

          <stages-menu-container
            :yearGroups="output.yearGroups"
            :constVal="constVal"
            :selectedYear="selectedYear"
            @moveToPage="moveToPage"
            @slideOut="slideOut"
          />

          <!-- Main Contents -->
          <v-flex xs10 id="StagesMenuContent" style="background: rgba(255, 255, 255, 0.8)">
            <!-- Breadcrumbs -->
            <v-flex id="StagesMenuContentHeader">
              <v-breadcrumbs :items="breadCrumbItems" divider=">" style="padding: 0">
                <template slot="item" slot-scope="props">
                  <v-btn flat small @click="moveToPage(props.item.jumpTargetPageNum, props.item.text)">{{ props.item.text }}</v-btn>
                </template>
                <v-icon slot="divider">chevron_right</v-icon>
              </v-breadcrumbs>

              <v-divider/>
            </v-flex>

            <!-- TOP -->
            <template v-if="pagePos === constVal.TOP">
              <stages-top
              :stagesDetails="output.stagesDetails"
              :mStageDetails="mStageDetails"/>
            </template>


            <!-- MENU -->
            <template v-else-if="pagePos === constVal.MENU">
              <stages-menu
                :constVal="constVal"
                :pageContents="output.pageContents"
                :selectedYear="selectedYear"
                @moveToPage="moveToPage"
              />
            </template>


            <!-- CONTENT -->
            <template v-else-if="pagePos === constVal.CONTENT">
              <stages-content
                :pageContents="output.pageContents"
                :updateList="updateList"
                @addToUpdateList="addToUpdateList"
              />
            </template>

            <!-- EDITOR -->
            <template v-else-if="pagePos === constVal.EDITOR">
              <stages-editor
                v-if="$store.state.editMode"
                :updateList="updateList"
                :updateButtonLabel="updateButtonLabel"
                @updateData="updateData"
                @deleteFromUpdateList="deleteFromUpdateList"
              />
            </template>

            <!-- NEWPOST -->
            <template v-else-if="pagePos === constVal.NEWPOST">
              <stages-new-post
                v-if="$store.state.editMode"
                @addToUpdateList="addToUpdateList"
              />
            </template>

          </v-flex>
        </template>
      </v-layout>
    </template>

    <!-- Message snackbar -->
    <v-snackbar
      v-model="updateListTrigger.success"
      :right="true"
      :timeout="3000"
      >
      <v-icon color="green">check_circle_outline</v-icon>
      更新リストに追加完了
    </v-snackbar>

    <v-snackbar
      v-model="updateListTrigger.failed"
      :right="true"
      :timeout="3000"
      >
      <v-icon color="red">check_circle_outline</v-icon>
      更新リスト追加失敗
    </v-snackbar>

    <v-snackbar
      v-model="updateTrigger.success"
      :right="true"
      :timeout="3000"
      >
      <v-icon color="green">check_circle_outline</v-icon>
      更新完了
    </v-snackbar>

    <v-snackbar
      v-model="updateTrigger.failed"
      :right="true"
      :timeout="3000"
      >
      <v-icon color="red">check_circle_outline</v-icon>
      更新失敗
    </v-snackbar>
  </v-container>
</template>

<script>
import firestore from '@/firebase_firestore'
import storage from '@/firebase_storage'
import anime from 'animejs'
import { mapState } from 'vuex'
import { contentsLoader, loaderPresets } from '@/utils'
import StagesTop from '@/components/MainContents/StagesTop'
import StagesMenu from '@/components/MainContents/StagesMenu'
import StagesContent from '@/components/MainContents/StagesContent'
import StagesMenuContainer from '@/components/MainContents/StagesMenuContainer'
import StagesEditor from '@/components/MainContents/StagesEditor'
import StagesNewPost from '@/components/MainContents/StagesNewPost'

export default {
  name: 'StagesPage',
  data() {
    return {
      selectedYear: 0,
      pagePos: 0,
      selectedPost: {},
      selectedMedia: {
        path: "",
        type: ""
      },
      constVal: {
        TOP: 0,
        MENU: 1,
        CONTENT: 2,
        EDITOR: 3,
        NEWPOST: 4
      },
      breadCrumbItems: [{
        text: 'トップ',
        disabled: false,
        href: "",
        jumpTargetPageNum: 0
      }],
      windowSize: { x: 0, y: 0 },
      loader: {
        isLoading: true,
        targetParams: [],
      },
      mStageDetails: {},
      updateList: [],
      updateListTrigger: {
        'success': false,
        'failed': false
      },
      updateTrigger: {
        'success': false,
        'failed': false
      },
      updateButtonLabel: "更新する",
      bgVideoMode: true,
      bgVideoState: "",
      output: {} //expect 'stageDetails', 'pageContents', 'yearGroups'
    }
  },
  components: {
    'stages-top': StagesTop,
    'stages-menu': StagesMenu,
    'stages-content': StagesContent,
    'stages-menu-container': StagesMenuContainer,
    'stages-editor': StagesEditor,
    'stages-new-post': StagesNewPost
  },
  mounted() {
    this.refreshWinSize()
  },
  computed: {
    contentSelectedYear() {
      return this.output.pageContents.filter(el => el.yearGroup === this.selectedYear)
    },
    videoSizeData() {
      let res = {}
      let areaWidth = this.windowSize.x
      let areaHeight = this.windowSize.y - 48

      let areaRatio = areaWidth / areaHeight

      if (areaRatio > 1.778) {
        let idealHeightFromWidth = areaWidth / 1.778
        let diff = idealHeightFromWidth - areaHeight
        res = {
          width  : areaWidth,
          height : idealHeightFromWidth,
          xDiff  : 0,
          yDiff  : diff
        }
      } else if (areaRatio < 1.778){
        let idealWidthFromHeight = areaHeight * 1.778
        let diff = idealWidthFromHeight - areaWidth
        res = {
          width  : idealWidthFromHeight,
          height : areaHeight,
          xDiff  : diff,
          yDiff  : 0
        }
      }

      return res
    }
  },
  methods: {
    formatDate(stageDate) {
      const year = stageDate.year
      const month = stageDate.month
      const day = stageDate.day
      return year + '年 ' + month + '月 ' + day + '日'
    },
    refreshWinSize(){
      this.windowSize =  { x: window.innerWidth, y: window.innerHeight }
    },
    postDifference(newData, origData) {
      let editedKeys = []

      // Compare easy data
      const easilyComparableKeys = ['stageName', 'stageDescription', 'location', 'yearGroup']
      for (let key of easilyComparableKeys) {
        if (newData[key] !== origData[key]) {
          editedKeys.push(key)
        }
      }

      // Compare date
      if (newData.stageDate.year  !== origData.stageDate.year  ||
          newData.stageDate.month !== origData.stageDate.month ||
          newData.stageDate.day   !== origData.stageDate.day     ){
        editedKeys.push('stageDate')
      }


      console.log(newData.mediaData.length)
      console.log(origData.mediaData.length)
      // Compare media
      if (newData.mediaData.length !== origData.mediaData.length){
        editedKeys.push('mediaData')
      } else {
        for (let i=0; i<newData.mediaData.length; i++){
          if(newData.mediaData[i].path !== origData.mediaData[i].path ||
            newData.mediaData[i].type !== origData.mediaData[i].type) {
            editedKeys.push('mediaData')
            break
          }
        }
      }

      return editedKeys
    },
    addToUpdateList(newData){
      const newDataId = newData.postId

      // If postId already exists in list
      let alreadyEdited = false
      let editedIndex = -1
      if (this.updateList.length) {
        for (let [index, entry] of this.updateList.entries()){
          if (entry.postId === newDataId) {
            alreadyEdited = true
            editedIndex = index
          }
        }
      }

      if (alreadyEdited) {
        this.updateList.splice(editedIndex, 1)
      }


      const originalDataFilter = this.output.pageContents.filter(el => el.postId === newDataId)

      if (!originalDataFilter.length) {
        this.updateList.push({
          'postId': newDataId,
          newData,
          originalData: null,
          editedKeys: ['stageName', 'stageDescription', 'location', 'yearGroup', 'stageDate', 'mediaData']
        })
        this.updateListTrigger.success = true
        return
      }

      const originalData = originalDataFilter[0]

      const editedKeys = this.postDifference(newData, originalData)

      if (!editedKeys.length) {
        if (alreadyEdited) {
          this.updateListTrigger.success = true
        } else {
          this.updateListTrigger.failed = true
        }
        return
      }

      this.updateList.push({
        'postId': newDataId,
        newData,
        originalData,
        editedKeys,
      })
      this.updateListTrigger.success = true
    },
    deleteFromUpdateList(index) {
      this.updateList.splice(index, 1)
    },
    moveToPage(pos, param=null){
      // Set next page position
      this.pagePos = pos

      if(pos === this.constVal.TOP){
        this.selectedYear = 0
        while(this.breadCrumbItems.length > this.constVal.TOP+1){
          this.breadCrumbItems.pop()
        }

      } else if (pos === this.constVal.MENU) {
        if (!isNaN(param) && param !== -1){
          // If next year selected
          this.selectedYear = param
        } else if (!isNaN(param.split('年度')[0])) {
          this.selectedYear = Number(param.split('年度')[0])
        } else {
          // If not selected, abort move to MENU and go back to TOP
          this.pagePost = this.constVal.TOP
          this.moveToPage(this.constVal.TOP)
          return
        }

        // Reset isSelected values
        this.output.pageContents.map(el => el.isSelected = false)

        while(this.breadCrumbItems.length > this.constVal.MENU){
          this.breadCrumbItems.pop()
        }
        this.breadCrumbItems.push({
          text: this.selectedYear + '年度',
          disabled: false,
          href: "",
          jumpTargetPageNum: this.constVal.MENU
        })

      } else if (pos === this.constVal.CONTENT) {
        // Set a single post to isSelected === true
        //   Using the postId value given from param
        let selectedPost
        if (this.output.pageContents.filter(el => el.postId === param).length){
          for (const [index, post] of this.output.pageContents.entries()){
            if (post.postId === param) {
              this.output.pageContents[index].isSelected = true
              selectedPost = this.output.pageContents[index]
            } else {
              this.output.pageContents[index].isSelected = false
            }
          }
        } else {
          console.error('ERROR: Post with specified postId "' + param + '" does not exist.')
        }

        // If selectedPost does not exist
        if (selectedPost === null){
          moveToPage(this.constVal.MENU, -1)
        }

        this.breadCrumbItems.push({
            text: "ステージ詳細",
            disabled: false,
            href: "",
            jumpTargetPageNum: this.constVal.CONTENT
        })
      } else if (pos === this.constVal.EDITOR){
        this.selectedYear = 0
        while(this.breadCrumbItems.length > this.constVal.TOP+1){
          this.breadCrumbItems.pop()
        }

        this.breadCrumbItems.push({
          text: "編集",
          disabled: false,
          href: "",
          jumpTargetPageNum: this.constVal.EDITOR
        })
      } else if (pos === this.constVal.NEWPOST){
        this.selectedYear = 0
        while(this.breadCrumbItems.length > this.constVal.TOP+1){
          this.breadCrumbItems.pop()
        }

        this.breadCrumbItems.push({
          text: "新規投稿",
          disabled: false,
          href: "",
          jumpTargetPageNum: this.constVal.NEWPOST
        })
      }
    },
    async updateData() {
      this.updateButtonLabel = "更新中..."
      Promise.resolve()
        .then(() => {
          return Promise.all(this.updateList.map(entry => {
            return new Promise((fulfilled, rejected) => {
              firestore
                .collection('Contents/Stages/Posts')
                .doc(entry.postId)
                .set(entry.newData)
                .then(() => {
                  fulfilled()
                })
            })
          }))
        })
        .then(() => {
          this.updateTrigger.success = true
          this.updateButtonLabel = "更新する"
          this.refreshData()
        })
        .catch((err) => {
          console.error(err)
          this.updateTrigger.failed = true
        })
    },
    async refreshData() {
      this.updateList = []
      this.output = await contentsLoader.startLoading(this.loader)
      this.output.pageContents.map((el) => {
        el['isSelected'] = false
      })
    },
    bgVideoReplay() {
      const bgVideoDOM = document.getElementById('stagesBgVideo')
      this.bgVideoState = "playing"
      bgVideoDOM.currentTime = 0
      bgVideoDOM.play()
    },
    async slideIn() {
      let timeline = anime.timeline()

      timeline
        .add({
          targets: '#menuSlide1',
          translateX: this.windowSize.x/5,
          duration: 1000,
          autoplay: false,
          easing: 'easeOutQuint',
          offset: 0
        })
        .add({
          targets: '#menuSlide2',
          translateX: this.windowSize.x,
          duration: 1000,
          autoplay: false,
          easing: 'easeOutQuint',
          offset: 200
        })
      timeline.play()

      return timeline.finished.then(() => {
        return new Promise((resolve, reject) => {
          this.bgVideoMode = false
          resolve()
        })
      })
    },
    async slideOut() {
      let timeline = anime.timeline()
      this.bgVideoMode = true

      timeline
        .add({
          targets: '#menuSlide1',
          translateX: -this.windowSize.x/5,
          duration: 1000,
          autoplay: false,
          easing: 'easeOutQuint',
          offset: 200
        })
        .add({
          targets: '#menuSlide2',
          translateX: -this.windowSize.x,
          duration: 1000,
          autoplay: false,
          easing: 'easeOutQuint',
          offset: 0
        })

      timeline.play()
      return timeline.finished.then(() => {
        return new Promise((resolve, reject) => {
          resolve()
        })
      })
    },
  },
  async created() {
    contentsLoader.addLoadTarget(this.loader, loaderPresets.stageDetails)
    contentsLoader.addLoadTarget(this.loader, loaderPresets.stagesContents)
    contentsLoader.addLoadTarget(this.loader, loaderPresets.nextStageDetail)

    this.output = await contentsLoader.startLoading(this.loader)
    this.$store.commit('setTransitionState', 'out')

    this.output.pageContents.map((el) => {
      el['isSelected'] = false
    })

    this.mStageDetails = {
      'title': '舞台について',
      'content': this.output.stagesDetails
    }

    const bgVideoDOM = document.getElementById('stagesBgVideo')
    this.bgVideoState = "playing"
    bgVideoDOM.addEventListener("ended", () => {
      this.bgVideoState = "ended"
    })
  }
}
</script>

<style scoped>
#StagesMenuContent {
  box-sizing: border-box;
  padding: 30px;
}

#StagesMenuContentHeader {
  margin-bottom: 30px;
}

#StagesMediaContainer, #StagesMediaContainerE {
  position: relative;
  background-color: rgba(50, 50, 50, 0.8);
  width: 100%;
}

#StagesMediaContainer:before {
  content: "";
  display: block;
  padding-top: 56.25%;
}

#StagesMediaContainer iframe, #StagesMediaContainer div{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

#StagesMediaSelector {
  position: relative;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  overflow-x: hidden;
  overflow-y: scroll;
}

#StagesMediaSelector:before {
  content: "";
  display: block;
  padding-top: 168.75%;
}

.StagesMediaSelectorEl {
  width: 90%;
  height: 70px;
  margin: 5%;
  cursor: pointer;
}

.bgCoverSettings{
  background-size: cover;
  background-repeat: none;
  background-position: center center;
}

.StagesMediaSelectorElSelected {
  background-blend-mode: screen;
  background-color: rgba(255, 255, 255, 0.3);
}

.StagesMediaSelectorEl:hover{
  background-blend-mode: screen;
  background-color: rgba(255, 255, 255, 0.4);
}

#StagesTextContainer {
  padding: 2%;
  background-color: white;
  border-radius: 0px 0px 15px 15px;
}

.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: .6;
  position: absolute;
  width: 100%;
  font-size: 10px;
}
</style>
