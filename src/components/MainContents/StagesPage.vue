<template>
  <div id="StagesContainer">
    <template v-if="pageLoaded">
      <div id="StagesMenuContainer">
        <div class="StageMenu" @click="moveToPage(0)">
          トップ
        </div>
        <div class="StageMenu" v-for="yearGroup in yearGroups" :key="yearGroup" @click="moveToPage(constVal.MENU, Number(yearGroup))">
          {{ yearGroup }}
        </div>
      </div>
      <div id="StagesMenuContent">
        <template v-if="pagePos === constVal.TOP">
          {{ stagesTopDescription }}
        </template>
        <template v-else-if="pagePos === constVal.MENU">
          <div class="StagesMenuEl" v-for="content in contentSelectedYear" :key="content.postId"
            :style="'background-image: url(http://img.youtube.com/vi/' + content.youtubeMovieId[0] + '/0.jpg)'"
            @click="moveToPage(constVal.CONTENT, content.postId)">
            {{ content.stageName }}
          </div>
        </template>
        <template v-else-if="pagePos === constVal.CONTENT">
          <div id="StagesMediaBigContainer">
            <div id="StagesMediaContainer">
              <div v-if="selectedMedia.type === 'video'">
                <iframe
                  width="100%" height="100%" :src="'https://www.youtube.com/embed/'+selectedMedia.path"
                  frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                </iframe>
              </div>
              <div v-if="selectedMedia.type === 'picture'">
                <div class="bgCoverSettings" :style="'background-image: url('+selectedMedia.path+')'" width="100%" height="100%">
                </div>
              </div>
            </div>
            <div id="StagesMediaSelector">
              <div class="StagesMediaSelectorEl bgCoverSettings"
                v-for="movieId in selectedPost.youtubeMovieId" :key="movieId"
                :style="'background-image: url(http://img.youtube.com/vi/' + movieId + '/0.jpg)'"
                :class="{StagesMediaSelectorElSelected: movieId === selectedMedia.path}"
                @click="changeMedia('video', movieId)">
              </div>
              <div class="StagesMediaSelectorEl bgCoverSettings"
                v-for="picturePath in selectedPost.picturePath" :key="picturePath"
                v-if="picturePath !== ''"
                :style="'background-image: url('+picturePath+')'"
                :class="{StagesMediaSelectorElSelected: picturePath === selectedMedia.path}"
                @click="changeMedia('picture', picturePath)">
              </div>
            </div>
          </div>
          <div id="StagesTextContainer">
            <div>
              {{ selectedPost.stageDescription }}
            </div>
            <div>
              {{ formatDate }}
            </div>
            <div>
              【場所】 {{ selectedPost.location }}
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import firestore from '@/firebase_firestore'
import storage from '@/firebase_storage'
import { mapState } from 'vuex'

export default {
  name: 'StagesPage',
  data() {
    return {
      pageContents: [],
      stagesTopDescription: "",
      postsNum: -1,
      pageLoaded: false,
      yearGroups: [],
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
        CONTENT: 2
      }
    }
  },
  computed: {
    contentSelectedYear() {
      return this.pageContents.filter(el => el.yearGroup === this.selectedYear)
    },
    formatDate() {
      const rawDate = Number(this.selectedPost.stageDate.seconds) * 1000
      const dateObj = new Date(rawDate)
      const year = dateObj.getFullYear()
      const month = dateObj.getMonth()
      const day = dateObj.getDay()
      const hour = dateObj.getHours()
      let minute = dateObj.getMinutes()

      if (minute < 10) {
        minute = '0'+String(minute)
      }
      return '【日時】 ' + year + '年 ' + month + '月 ' + day + '日   ' + hour + ':' + minute + '〜'
    }
  },
  methods: {
    moveToPage(pos, param=null){
      this.pagePos = pos
      if(pos === this.constVal.TOP){
        this.selectedYear = 0
      } else if (pos === this.constVal.MENU) {
        if (!isNaN(param)){
          if(param !== -1){
            this.selectedYear = param
          }
        } else {
          this.pagePost = this.constVal.TOP
          moveToPage(this.constVal.TOP)
        }
        this.selectedPost = {}
      } else if (pos === this.constVal.CONTENT) {
        this.selectedPost = this.pageContents.filter(el => el.postId === param)[0]
        if (this.selectedPost === null){
          moveToPage(this.constVal.MENU, -1)
        }
        if (this.selectedPost.youtubeMovieId.length > 0){
          this.changeMedia("video", this.selectedPost.youtubeMovieId[0])
        } else if (this.selectedPost.picturePath.length > 0){
          this.changeMedia("picture", this.selectedPost.picturePath[0])
        } else {
          console.log("else")
        }
      }
    },
    changeMedia(type, path){
      this.selectedMedia.type = type
      this.selectedMedia.path = path
    }
  },
  watch: {
    pageContents(val) {
      if (val.length === this.postsNum){
        this.pageLoaded = true
      }

      //set values using pageContents
      this.yearGroups = Array.from(new Set(this.pageContents.map(el => el.yearGroup)))
    }
  },
  created: function() {
    firestore.doc('Contents/Stages').get().then(doc => {
      this.stagesTopDescription = doc.data().stagesMenuDescription
      this.postsNum = doc.data().postsNum
    })
    firestore.collection('Contents/Stages/Posts').orderBy('stageDate', 'desc').get().then((querySnapshot)=>{
        querySnapshot.forEach((doc)=>{
            this.pageContents.push(doc.data())
        })
    })
  }
}
</script>

<style scoped>
#StagesContainer {
  position: absolute;
  width: 100%;
  height: 100%;
}

#StagesMenuContainer {
  position: absolute;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 20%;
  height: 100%;
  padding: 5% 1% 2% 1%;
}

.StageMenu {
  width: 100%;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.5);
  margin: 10px 0;
  padding-left: 10px;
  box-sizing: border-box;
  cursor: pointer
}

.StageMenu:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

#StagesMenuContent {
  position: absolute;
  left: 20%;
  margin: 5% 2% 2% 5%;
  width: 73%;
  height: 87%;
  background-color: rgba(100, 100, 100, 0.8);
  border-radius: 20px;
  box-sizing: border-box;
  padding: 30px;
}

.StagesMenuEl {
  background-size: cover;
  background-repeat: none;
  background-position: center center;
  width: 120px;
  height: 120px;
  border-radius: 20px;
  color: white;
  cursor: pointer;
}

.StagesMenuEl:hover {
  width: 130px;
  height: 130px;
}

#StagesMediaBigContainer {
  display: flex;
  height: 70%;
}

#StagesMediaContainer, #StagesMediaContainer div {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}

#StagesMediaSelector {
  width: 25%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  overflow: scroll;
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
  height: 26%;
  padding: 2%;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 0px 0px 15px 15px;
  overflow: scroll;
}
</style>
