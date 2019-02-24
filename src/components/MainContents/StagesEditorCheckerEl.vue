<template>
<v-flex>
  <v-subheader> {{ title }} </v-subheader>
  <v-flex style="padding: 15px; background: white; border-radius: 10px">
    <template v-if="editedKey === 'stageDate'">
      {{ data.stageDate.year }}年 {{ data.stageDate.month }}月 {{ data.stageDate.day }}日
    </template>
    <template v-else-if="editedKey === 'mediaData'">
      <v-flex v-for="media in data.mediaData">
        <v-layout row>
          <v-flex v-if="media.type === 'video'">
            <v-img :src="'http://img.youtube.com/vi/' + getYoutubeId(media.path) + '/0.jpg'">
              <v-icon x-large color="red" style="position: absolute; bottom: 0;">
                play_circle_filled_white
              </v-icon>
            </v-img>
          </v-flex>
          <v-flex v-else>
            <v-img :src="media.path"/>
          </v-flex>
        </v-layout>
      </v-flex>
    </template>
    <template v-else>
      {{ data[editedKey] }}
    </template>
  </v-flex>
</v-flex>
</template>

<script>
export default {
  name: 'StagesEditorCheckerEl',
  props: ['data', 'title', 'editedKey'],
  methods: {
    getYoutubeId(moviePath) {
      const splitted = moviePath.split('/')
      return splitted[splitted.length-1]
    }
  }
}
</script>

<style>
</style>
