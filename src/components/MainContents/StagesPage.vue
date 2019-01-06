<template>
  <v-container fluid style="padding: 0">
    <v-layout style="position: fixed; width: 100%; height: 100vh; top: 0; z-index: -1;">
      <v-img src="https://pbs.twimg.com/media/DuXmJyjVsAI1MYY.jpg:large">
        <v-flex style="height: 100vh; width: 100%;  background: rgba(0, 0, 0, 0.5)"/>
      </v-img>
    </v-layout>

    <!--
    <v-layout :style="'width: 100%; height:'+ (windowSize.y-48)+'px'">
    </v-layout>
    -->

    <v-layout id="StagesContainer" :style="'min-height: '+ (windowSize.y-48)+'px'"
              justify-space-around align-content-space-around>
      <template v-if="!loader.isLoading">
        <v-flex xs2 id="StagesMenuContainer">
          <v-navigation-drawer permanent aboslute dense style="background: rgba(255, 255, 255, 0.8)">
            <v-subheader>MENU</v-subheader>
            <v-divider/>
            <v-list-tile @click="moveToPage(0)" class="StagesMenuEl">
              <v-list-tile-avatar>
                <v-icon small>home</v-icon>
              </v-list-tile-avatar>
              トップ
            </v-list-tile>
            <v-divider/>
            <v-list-tile class="StagesMenuEl"
              v-for="yearGroup in output.yearGroups" :key="yearGroup"
              @click="moveToPage(constVal.MENU, Number(yearGroup))">
              <v-list-tile-avatar>
                <v-icon v-if="yearGroup === selectedYear">
                  arrow_right
                </v-icon>
              </v-list-tile-avatar>
              {{ yearGroup }}年度
            </v-list-tile>
          </v-navigation-drawer>
        </v-flex>

        <v-flex xs10 id="StagesMenuContent" style="background: rgba(255, 255, 255, 0.8)">
          <v-flex id="StagesMenuContentHeader">
            <v-breadcrumbs :items="breadCrumbItems" divider=">" style="padding: 0">
              <template slot="item" slot-scope="props">
                <v-btn flat small @click="moveToPage(props.item.jumpTargetPageNum, -1)">{{ props.item.text }}</v-btn>
              </template>
              <v-icon slot="divider">chevron_right</v-icon>
            </v-breadcrumbs>

            <v-divider/>
          </v-flex>

          <template v-if="pagePos === constVal.TOP">
            <v-flex>
              <v-layout row>
                <v-flex xs6 style="padding-right: 20px">
                  <v-layout column>
                    <v-flex style="margin-bottom: 20px;">
                      <h1>舞台について</h1>
                      <v-layout justify-end>
                        <v-flex xs11>
                          {{ output.stagesDetails}}
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex v-if="output.nextStageDetail.hasNextStage">
                      <h1>次の舞台</h1>
                      <v-layout justify-end>
                        <v-flex xs11 >
                          <h2> {{ output.nextStageDetail.name }} </h2>
                          <v-flex>
                            {{ output.nextStageDetail.description }}
                          </v-flex>
                          <v-flex>
                            【日時】{{ output.nextStageDetail.location }}
                          </v-flex>
                          <v-flex>
                            【場所】{{ output.nextStageDetail.date }}
                          </v-flex>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-img xs6 src="https://pbs.twimg.com/media/DsfLiSfVYAAuZa4.jpg:large"/>
              </v-layout>
            </v-flex>
          </template>

          <template v-else-if="pagePos === constVal.MENU">
            <v-layout justify-space-between wrap>
              <v-flex v-for="content in contentSelectedYear" xs4 :key="content.postId"
                style="padding: 10px;"
                @click="moveToPage(constVal.CONTENT, content.postId)">
                <v-hover>
                  <v-card style="border-radius: 10px; cursor: pointer"
                    slot-scope="{ hover }"
                    :class="`elevation-${hover ? 12 : 2}`" >
                    <v-img aspect-ratio="1.7778" :src="'http://img.youtube.com/vi/' + content.youtubeMovieId[0] + '/0.jpg'">
                    </v-img>
                    <v-card-title>
                      <v-layout column>
                        <v-flex x12 style="font-weight: bold; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
                            {{ content.stageName }}
                        </v-flex>
                        <v-flex style="font-size: 0.8em; overflow: hidden; white-space: nowrap; color: gray; text-overflow: ellipsis">
                          日時： {{ formatDate(content.stageDate) }}
                        </v-flex>
                        <v-flex style="font-size: 0.8em; overflow: hidden; white-space: nowrap; color: gray; text-overflow: ellipsis">
                          場所： {{ content.location }}
                        </v-flex>
                      </v-layout>
                    </v-card-title>
                  </v-card>
                </v-hover>
              </v-flex>
            </v-layout>
          </template>

          <template v-else-if="pagePos === constVal.CONTENT">
            <v-flex id="StagesMediaBigContainer">
              <v-flex xs12>
                <h1>{{ selectedPost.stageName }}</h1>
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
                【日時】 {{ formatDate(selectedPost.stageDate) }}
              </v-flex>
              <v-flex>
                【場所】 {{ selectedPost.location }}
              </v-flex>
            </v-flex>
          </template>
        </v-flex>
      </template>
    </v-layout>
  </v-container>
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
      windowSize: { x: 0, y: 0 },
      loader: {
        isLoading: true,
        targetParams: [],
      },
      output: {} //expect 'stageDetails', 'pageContents', 'yearGroups'
    }
  },
  mounted() {
    this.refreshWinSize()
  },
  computed: {
    contentSelectedYear() {
      return this.output.pageContents.filter(el => el.yearGroup === this.selectedYear)
    },
  },
  methods: {
    formatDate(stageDate) {
      const rawDate = Number(stageDate.seconds) * 1000
      const dateObj = new Date(rawDate)
      const year = dateObj.getFullYear()
      const month = dateObj.getMonth() + 1
      const day = dateObj.getDate()
      return year + '年 ' + month + '月 ' + day + '日'
    },
    refreshWinSize(){
      this.windowSize =  { x: window.innerWidth, y: window.innerHeight }
    },
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
    contentsLoader.addLoadTarget(this.loader, loaderPresets.nextStageDetail)

    this.output = await contentsLoader.startLoading(this.loader)
    this.$store.commit('setTransitionState', 'out')
  }
}
</script>

<style scoped>
.StagesMenuEl {
  font-size: 0.8em;
}
.StagesMenuEl:hover {
  background-color: rgba(0, 0, 0, 0.1)
}

#StagesMenuContent {
  box-sizing: border-box;
  padding: 30px;
}

#StagesMenuContentHeader {
  margin-bottom: 30px;
}

#StagesMediaContainer {
  position: relative;
  background-color: white;
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
