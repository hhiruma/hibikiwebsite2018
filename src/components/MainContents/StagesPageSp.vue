<template>
<v-flex>
  <v-img
    height=200
    src="https://firebasestorage.googleapis.com/v0/b/hibikiwebsite2018.appspot.com/o/images%2Fother%2Fbg_0_L.JPG?alt=media&token=1677d33f-0c28-46fa-b2ef-4534d80f25a1"
    >
    <v-flex
      style="position: absolute; font-size: 1.5em; font-weight: bold;
             padding: 10px; color: white; bottom: 0px;
             background: rgba(0, 0, 0, 0.5); width: 100%">
      ステージ
    </v-flex>
  </v-img>

  <v-tabs
    centered
    v-model="active">
    <v-tab>
      舞台について
    </v-tab>
    <v-tab>
      過去の舞台
    </v-tab>

    <!-- 舞台について -->
    <v-tab-item
      style="padding: 25px">
      <v-flex
        style="margin-bottom: 20px">
        {{ output.stagesDetails }}
      </v-flex>
      <v-img
        style="border-radius: 10px"
        src="https://pbs.twimg.com/media/DsfLiSfVYAAuZa4.jpg:large"
      />
    </v-tab-item>

    <!-- 過去の舞台 -->
    <v-tab-item style="padding: 25px">
      <v-flex>
        <v-select
          v-model="selectedYear"
          :items="output.yearGroups"
          label="年度"
          >
        </v-select>
      </v-flex>
      <v-layout justify-start wrap>
        <v-flex v-for="content in contentsInSelectedYear"
          style="padding: 5px"
          @click="toggleStage(content.postId)">
          <v-card style="border-radius: 10px; padding: 10px">
            <v-flex x12 style="font-weight: bold; overflow: hidden; white-space: nowrap;
                              text-overflow: ellipsis; ">
                {{ content.stageName }}
            </v-flex>
            <v-layout row>
              <v-flex xs4>
                <v-layout column justify-center fill-height>
                  <v-img aspect-ratio="1.7778" :src="'http://img.youtube.com/vi/' + getYoutubeId(content.mediaData[0].path) + '/0.jpg'"/>
                </v-layout>
              </v-flex>
              <v-flex xs8>
                <v-card-title>
                  <v-layout column>
                    <v-flex style="font-size: 0.8em; overflow: hidden; white-space: nowrap; color: gray; text-overflow: ellipsis">
                      日時： {{ formatDate(content.stageDate) }}
                    </v-flex>
                    <v-flex style="font-size: 0.8em; overflow: hidden; white-space: nowrap; color: gray; text-overflow: ellipsis">
                      場所： {{ content.location }}
                    </v-flex>
                  </v-layout>
                </v-card-title>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-tab-item>
  </v-tabs>


  <!-- ステージビューアー -->
  <v-dialog fullscreen hide-overlay transition="dialog-bottom-transition"
    v-if="selectedPostId !== ''"
    v-model="stageViewerShow"
    style="height: 100vh">
    <v-flex style="background: white; height: 100vh;">
      <v-flex>
        <v-layout row justify-end>
          <v-btn flat icon large
            @click="stageViewerShow = false">
            <v-icon> close </v-icon>
          </v-btn>
        </v-layout>
      </v-flex>

      <v-divider/>

      <v-flex style="font-size: 1.2em; font-weight: bold;
                     padding: 10px;">
        {{ (contentOfSelectedPost).stageName }}
      </v-flex>

      <v-flex style="padding: 10px 10px 0px 10px;
                      background: rgba(0, 0, 0, 0.7);">
        <!-- Video -->
        <iframe
          v-if="selectedMedia.type === 'video'"
          style="height: 250px"
          width="100%"
          :src="selectedMedia.path"
          frameborder="0" allowfullscreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture">
        </iframe>

        <!-- Image -->
        <div
          v-else-if="selectedMedia.type === 'image'"
          class="bgCoverSettings"
          :style="'height: 250px;' +
                  'background-image: url(' + selectedMedia.path + ')'"
          width="100%">
        </div>
      </v-flex>

      <v-flex>
        <v-layout row
          style="background: rgba(0, 0, 0, 0.7); padding: 5px;
          overflow: scroll">
          <template v-for="media in (contentOfSelectedPost).mediaData">
            <v-flex v-if="media.type === 'video'"
              class="StagesMediaSelectorEl bgCoverSettings"
              :class="{StagesMediaSelectorElSelected: media.path === selectedMedia.path}"
              :style="'background-image: url(http://img.youtube.com/vi/' + getYoutubeId(media.path) + '/0.jpg)'"
              @click="changeMedia('video', media.path)">
              <v-icon x-large color="red"> play_circle_filled_white </v-icon>
            </v-flex>
            <v-flex v-else
              class="StagesMediaSelectorEl bgCoverSettings"
              :class="{StagesMediaSelectorElSelected: media.path === selectedMedia.path}"
              :style="'background-image: url('+ media.path +')'"
              @click="changeMedia('image', media.path)">
            </v-flex>
          </template>
        </v-layout>
      </v-flex>

      <v-flex style="border: 1px black solid; margin: 10px;
                     padding: 10px; border-radius: 10px;">
        <v-flex>
          {{ (contentOfSelectedPost).stageDescription }}
        </v-flex>
        <v-flex>
          【日時】 {{ formatDate((contentOfSelectedPost).stageDate) }}
        </v-flex>
        <v-flex>
          【場所】 {{ (contentOfSelectedPost).location }}
        </v-flex>
      </v-flex>
    </v-flex>
  </v-dialog>
</v-flex>
</template>

<script>
import { contentsLoader, loaderPresets } from '@/utils'

export default {
  name: 'StagesPageSp',
  data() {
    return {
      active: null,
      loader: {
        isLoading: true,
        targetParams: [],
      },
      selectedYear: 0,
      selectedPostId: '',
      selectedMedia: {
        type: '',
        path: ''
      },
      stageViewerShow: false,
      output: {}
    }
  },
  computed: {
    contentsInSelectedYear() {
      return this.output.pageContents.filter(el => el.yearGroup === this.selectedYear)
    },
    contentOfSelectedPost() {
      return this.output.pageContents.filter(el => el.postId === this.selectedPostId)[0]
    }
  },
  methods: {
    formatDate(stageDate) {
      const year = stageDate.year
      const month = stageDate.month
      const day = stageDate.day
      return year + '年 ' + month + '月 ' + day + '日'
    },
    getYoutubeId(moviePath) {
      const splitted = moviePath.split('/')
      return splitted[splitted.length-1]
    },
    changeMedia(type, path){
      this.selectedMedia = {
        type, path
      }
      console.log(this.selectedMedia)
    },
    toggleStage(postId='') {
      this.selectedPostId = postId
      if (postId === '') {
        this.stageViewerShow = false
      } else {
        this.selectedMedia = this.output.pageContents
                              .filter(el => el.postId === this.selectedPostId)[0]
                              .mediaData[0]
        this.stageViewerShow = true
      }
    }
  },
  async created() {
    contentsLoader.addLoadTarget(this.loader, loaderPresets.stageDetails)
    contentsLoader.addLoadTarget(this.loader, loaderPresets.stagesContents)
    contentsLoader.addLoadTarget(this.loader, loaderPresets.nextStageDetail)

    this.output = await contentsLoader.startLoading(this.loader)
    console.log(this.output)

    this.selectedYear = this.output.yearGroups[0]
  }
}
</script>

<style>
.bgCoverSettings{
  background-size: cover;
  background-repeat: none;
  background-position: center center;
}

.StagesMediaSelectorEl {
  width: 120px;
  height: 70px;
  cursor: pointer;
  margin: 5px;
}

</style>
