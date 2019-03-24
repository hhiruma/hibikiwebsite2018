<template>
<v-layout justify-start wrap>
  <v-flex v-for="content in contentsInSelectedYear" xs4 :key="content.postId"
    style="padding: 10px;"
    @click="moveToPage(constVal.CONTENT, content.postId)">
    <v-hover>
      <v-card style="border-radius: 10px; cursor: pointer"
        slot-scope="{ hover }"
        :class="`elevation-${hover ? 12 : 2}`" >
        <v-img aspect-ratio="1.7778" :src="'http://img.youtube.com/vi/' + getYoutubeId(content.mediaData[0].path) + '/0.jpg'"/>
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

<script>
export default {
  name: 'StagesMenu',
  props: ['pageContents', 'selectedYear', 'constVal'],
  computed: {
    contentsInSelectedYear() {
      return this.pageContents.filter(el => el.yearGroup === this.selectedYear)
    },
  },
  methods: {
    moveToPage(pos, param=null){
      this.$emit('moveToPage', pos, param)
    },
    formatDate(stageDate) {
      const year = stageDate.year
      const month = stageDate.month
      const day = stageDate.day
      return year + '年 ' + month + '月 ' + day + '日'
    },
    getYoutubeId(moviePath) {
      const splitted = moviePath.split('/')
      return splitted[splitted.length-1]
    }
  }
}
</script>

<style scoped>
</style>
