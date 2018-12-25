<template>
  <v-layout id="StagesContainer" justify-space-around align-content-space-around>
    <template v-if="!loader.isLoading">
      <v-flex xs2 id="StagesMenuContainer">
        <v-list dense style="border-radius: 10px">
          <v-subheader>MENU</v-subheader>

          <v-divider></v-divider>

          <v-list-tile @click="moveToPage(0)">
            <v-list-tile-avatar>
              <v-icon small>home</v-icon>
            </v-list-tile-avatar>
            トップ
          </v-list-tile>

          <v-divider></v-divider>

          <v-list-tile v-for="yearGroup in output.yearGroups" :key="yearGroup" @click="moveToPage(constVal.MENU, Number(yearGroup))">
            <v-list-tile-avatar>
              <v-icon v-if="yearGroup === selectedYear">
                arrow_right
              </v-icon>
            </v-list-tile-avatar>
            {{ yearGroup }}年度
          </v-list-tile>
        </v-list>
      </v-flex>

      <v-flex xs9 id="StagesMenuContent">
        <v-breadcrumbs :items="breadCrumbItems" divider=">" style="padding: 20px 0px; height: 30px; background-color: gray; border-radius: 10px; margin-bottom: 15px">
          <template slot="item" slot-scope="props">
            <v-btn dark flat small @click="moveToPage(props.item.jumpTargetPageNum, -1)">{{ props.item.text }}</v-btn>
          </template>
          <v-icon slot="divider" color="white">chevron_right</v-icon>
        </v-breadcrumbs>

        <template v-if="pagePos === constVal.TOP">
          {{ output.stagesDetails}}
        </template>

        <template v-else-if="pagePos === constVal.MENU">
          <v-layout justify-space-between wrap>
            <v-flex v-for="content in contentSelectedYear" xs4 @click="moveToPage(constVal.CONTENT, content.postId)" :key="content.postId">
              <v-hover>
                <v-card dark height="150px"
                style="border-radius: 10px; cursor: pointer"
                slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
                  <v-img height="100px" :src="'http://img.youtube.com/vi/' + content.youtubeMovieId[0] + '/0.jpg'">
                    <v-expand-transition>
                      <div
                          v-if="hover"
                          class="d-flex transition-fast-in-fast-out black darken-2 v-card--reveal subheading white--text"
                          style="height: 100%;"
                        >
                        詳細
                      </div>
                    </v-expand-transition>
                  </v-img>
                  <v-card-title>
                    <span style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
                    {{ content.stageName }}
                    </span>
                  </v-card-title>
                </v-card>
              </v-hover>
            </v-flex>
          </v-layout>
        </template>

        <template v-else-if="pagePos === constVal.CONTENT">
          <v-flex id="StagesMediaBigContainer">
            <v-flex xs12>
              <h1 style="color: white">{{ selectedPost.stageName }}</h1>
            </v-flex>
            <v-layout row>
              <v-flex xs9 id="StagesMediaContainer">
                <iframe
                  v-if="selectedMedia.type === 'video'"
                  style="min-height: 250px"
                  width="100%" height="100%"
                  :src="'https://www.youtube.com/embed/'+selectedMedia.path"
                  frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                </iframe>
                <div
                  v-else-if="selectedMedia.type === 'picture'"
                  class="bgCoverSettings"
                  :style="'background-image: url('+selectedMedia.path+')'"
                  width="100%" height="100%">
                </div>
              </v-flex>
              <v-flex xs3 id="StagesMediaSelector">
                <div style="position: absolute; top: 0; width: 100%">
                  <v-flex class="StagesMediaSelectorEl bgCoverSettings"
                    v-for="movieId in selectedPost.youtubeMovieId" :key="movieId"
                    :style="'background-image: url(http://img.youtube.com/vi/' + movieId + '/0.jpg)'"
                    :class="{StagesMediaSelectorElSelected: movieId === selectedMedia.path}"
                    @click="changeMedia('video', movieId)">
                    <v-icon x-large color="red"> play_circle_filled_white </v-icon>
                  </v-flex>
                  <v-flex class="StagesMediaSelectorEl bgCoverSettings"
                    v-for="picturePath in selectedPost.picturePath" :key="picturePath"
                    v-if="picturePath !== ''"
                    :style="'background-image: url('+picturePath+')'"
                    :class="{StagesMediaSelectorElSelected: picturePath === selectedMedia.path}"
                    @click="changeMedia('picture', picturePath)">
                  </v-flex>
                </div>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex id="StagesTextContainer">
            <v-flex>
              {{ selectedPost.stageDescription }}
            </v-flex>
            <v-flex>
              {{ formatDate }}
            </v-flex>
            <v-flex>
              【場所】 {{ selectedPost.location }}
            </v-flex>
          </v-flex>
        </template>
      </v-flex>
    </template>
  </v-layout>
</template>

<script>
import firestore from '@/firebase_firestore'
import storage from '@/firebase_storage'
import { mapState } from 'vuex'
import { contentsLoader, loaderPresets } from '@/utils'

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
        CONTENT: 2
      },
      breadCrumbItems: [{
        text: 'トップ',
        disabled: false,
        href: "",
        jumpTargetPageNum: 0
      }],
      loader: {
        isLoading: true,
        targetParams: [],
      },
      output: {} //expect 'stageDetails', 'pageContents', 'yearGroups'
    }
  },
  computed: {
    contentSelectedYear() {
      return this.output.pageContents.filter(el => el.yearGroup === this.selectedYear)
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
    },
  },
  methods: {
    moveToPage(pos, param=null){
      this.pagePos = pos
      if(pos === this.constVal.TOP){
        this.selectedYear = 0
        while(this.breadCrumbItems.length > this.constVal.TOP+1){
          this.breadCrumbItems.pop()
        }

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
        this.selectedPost = this.output.pageContents.filter(el => el.postId === param)[0]
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

        this.breadCrumbItems.push({
            text: "ステージ詳細",
            disabled: false,
            href: "",
            jumpTargetPageNum: this.constVal.CONTENT
        })
      }
    },
    changeMedia(type, path){
      this.selectedMedia.type = type
      this.selectedMedia.path = path
    }
  },
  async created() {
    contentsLoader.addLoadTarget(this.loader, loaderPresets.stageDetails)
    contentsLoader.addLoadTarget(this.loader, loaderPresets.stagesContents)

    this.output = await contentsLoader.startLoading(this.loader)
  }
}
</script>

<style scoped>
#StagesContainer {
  display: flex;
}

#StagesMenuContent {
  background-color: rgba(100, 100, 100, 0.8); border-radius: 20px;
  box-sizing: border-box;
  padding: 30px;
}

#StagesMediaContainer {
  position: relative;
  background-color: rgba(0, 0, 0, 0.3);
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
  background-color: rgba(0, 0, 0, 0.3);
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
  background-color: rgba(255, 255, 255, 0.3);
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
