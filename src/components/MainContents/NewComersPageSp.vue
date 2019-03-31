<template>
<v-flex>
  <v-img
    height=200
    src="https://firebasestorage.googleapis.com/v0/b/hibikiwebsite2018.appspot.com/o/images%2Fother%2Fbg_2_L.jpg?alt=media&token=f684b041-24b0-4e91-be2d-e3e198fe0871"
    >
    <v-flex
      style="position: absolute; font-size: 1.5em; font-weight: bold;
             padding: 10px; color: white; bottom: 0px;
             background: rgba(0, 0, 0, 0.5); width: 100%">
      新歓情報
    </v-flex>
  </v-img>

  <!-- タブ -->
  <v-tabs
    centered
    v-model="active">
    <v-tab>
      メディア
    </v-tab>
    <v-tab>
      新歓イベント
    </v-tab>

    <!-- メディア -->
    <v-tab-item style="padding: 25px">
      <v-flex style="padding: 10px; font-size: 1.4em; font-weight: bold;">
        新歓PV
      </v-flex>
      <iframe
        :src="output.newComersMedia.videoPath"
        width="100%"
        frameborder="0" allowfullscreen
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture">
      </iframe>

      <v-divider/>

      <v-flex style="padding: 10px; font-size: 1.4em; font-weight: bold;">
        新歓ビラ
      </v-flex>
      <v-img v-for="(path, index) in output.newComersMedia.billPaths"
        :src="path"
        style="margin-bottom: 10px;"/>
    </v-tab-item>

    <v-tab-item>
      <v-flex v-for="content in output.newComersContent"
        class="NewComersEvent">
        <v-flex>
          <v-flex style="font-size: 1.3em; font-weight: bold;">
            {{ content.name }}
          </v-flex>
          <v-flex style="text-align: right">
            {{ content.date }}
            <br>
            {{ content.time }}
            <br>
            {{ content.location }}
          </v-flex>
          <v-img v-if="content.type == '話す'"
                src="https://firebasestorage.googleapis.com/v0/b/hibikiwebsite2018.appspot.com/o/images%2Ficon%2Fteam.png?alt=media&token=17555065-f4d3-457f-8faa-0dc2f5a4e098"
                class="NewComersEventIcon"/>
          <v-img v-else-if="content.type == '食事'"
                  src="https://firebasestorage.googleapis.com/v0/b/hibikiwebsite2018.appspot.com/o/images%2Ficon%2Feat.png?alt=media&token=57e5ba2e-559f-4476-8b39-797c6fc77440"
                  class="NewComersEventIcon"/>
          <v-img v-else-if="content.type == '音楽'"
                  src="https://firebasestorage.googleapis.com/v0/b/hibikiwebsite2018.appspot.com/o/images%2Ficon%2Fmusic.png?alt=media&token=e2be5723-1f97-4d11-92a3-dad2486a0dc8"
                  class="NewComersEventIcon"/>
        </v-flex>
      </v-flex>
    </v-tab-item>

    <!-- 新歓イベント -->
    <v-tab-item style="padding: 25px">
    </v-tab-item>
  </v-tabs>
</v-flex>
</template>

<script>
import { contentsLoader, loaderPresets } from '@/utils'

export default {
  name: 'NewComersPageSp',
  data() {
    return {
      loader: {
        isLoading: true,
        targetParams: [],
      },
      output: {} //newComersSettings, newComersContent, newComersMedia
    }
  },
  async created() {
    contentsLoader.addLoadTarget(this.loader, loaderPresets.newComersSettings)
    let output = await contentsLoader.startLoading(this.loader)
    this.bgImgPath = output.newComersSettings.bgImgPath

    contentsLoader.addLoadTarget(this.loader, {
      name: 'newComersContent',
      type: 'firestore',
      whichPath: 'collection',
      path: 'Contents/NewComers/description/posts/' + output.newComersSettings.validYear
    })

    contentsLoader.addLoadTarget(this.loader, {
      name: 'newComersMedia',
      type: 'firestore',
      whichPath: 'doc',
      path: 'Contents/NewComers/media/' + output.newComersSettings.validYear
    })

    this.output = await contentsLoader.startLoading(this.loader)
    console.log(this.output)
  }
}
</script>


<style>
.NewComersEvent {
  position: relative;
  margin: 20px;
  border: 1px solid gray;
  padding: 10px;
  border-radius: 10px;
}


.NewComersEventIcon {
  position: absolute;
  width: 30px;
  height: 30px;
  bottom: 10px;
}

</style>
