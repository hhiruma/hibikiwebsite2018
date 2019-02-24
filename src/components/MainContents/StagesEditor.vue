<template>
  <v-layout id="stagesEditorContainer" column>
    <v-flex style="margin-bottom: 15px;">
      <v-layout row>
        <v-flex style="font-size: 1.7em; font-weight:bold; padding-top: 5px;">
          更新するデータ
        </v-flex>
        <v-spacer/>
        <v-btn @click="updateData"> {{ updateButtonLabel }}  </v-btn>
      </v-layout>
    </v-flex>

    <v-divider/>

    <v-flex style="padding: 20px 5px 10px 5px;">
      <v-flex v-if="hasEdits">
        <v-expansion-panel expand>
          <v-expansion-panel-content v-for="(entry, i) in updateList" :key="entry.postId">
            <div slot="header">
              <v-icon>edit</v-icon>
              【{{entry.newData.yearGroup}}年度】{{ entry.newData.stageName }}
            </div>
            <v-layout row style="padding: 20px; background: rgba(230, 230, 230, 0.5);">
              <v-flex xs3 style="padding: 10px;">
                <v-layout column>
                  <v-img aspect-ratio="1.7778" :src="'http://img.youtube.com/vi/' + getYoutubeId(entry.newData.mediaData[0].path) + '/0.jpg'"/>
                  <v-btn @click="deleteFromUpdateList(i)" color="red" style="color: white;">
                    編集削除
                  </v-btn>
                </v-layout>
              </v-flex>

              <v-flex xs9 style="padding: 20px">
                <v-expansion-panel expand>
                  <v-expansion-panel-content v-for="key in entry.editedKeys" :key="key">
                    <div slot="header"> {{ editKeyToJp[key] }} </div>
                    <v-layout row style="background: rgba(230, 230, 230, 0.5); padding: 15px">
                      <stages-editor-checker-el
                        :data="entry.originalData"
                        :editedKey="key"
                        title="元の投稿"
                      />

                      <v-icon>arrow_right_alt</v-icon>

                      <stages-editor-checker-el
                        :data="entry.newData"
                        :editedKey="key"
                        title="新しい投稿"
                      />
                    </v-layout>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-flex>
            </v-layout>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>

      <v-flex v-else>
        更新する投稿はありません
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
import StagesEditorCheckerEl from '@/components/MainContents/StagesEditorCheckerEl'

export default {
  name: 'StagesEditor',
  props: ['updateList', 'updateButtonLabel'],
  components: {
    'stages-editor-checker-el': StagesEditorCheckerEl
  },
  data() {
    return {
      editKeyToJp: {
        'stageName': '舞台名',
        'stageDescription': '舞台説明',
        'location': '場所',
        'yearGroup': '年度',
        'stageDate': '日付',
        'mediaData': '画像/動画'
      }
    }
  },
  methods: {
    getYoutubeId(moviePath) {
      const splitted = moviePath.split('/')
      return splitted[splitted.length-1]
    },
    deleteFromUpdateList(index) {
      this.$emit('deleteFromUpdateList', index)
    },
    updateData(){
      this.$emit('updateData')
    }
  },
  computed: {
    hasEdits() {
      return this.updateList.length
    }
  }
}
</script>

<style>
#stagesEditorContainer {
  background: white;
  padding: 15px;
  border-radius: 10px;
}
</style>
