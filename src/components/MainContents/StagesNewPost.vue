<template>
<v-flex>
  <!-- Stage Name -->
  <v-layout row xs12 justify-space-between>
    <v-flex xs9>
      <v-text-field
        outline
        label="Stage Name"
        v-model="mPostContent.stageName"/>
    </v-flex>
    <v-flex xs2>
      <v-layout justify-center align-center>
        <v-btn @click="addToUpdateList">
          更新リストに追加
        </v-btn>
      </v-layout>
    </v-flex>
  </v-layout>

  <!-- Media Container -->
  <v-layout row>
    <!-- Main -->
    <v-flex xs9 id="StagesMediaContainerE">
      <v-flex style="border-radius: 10px; background: rgba(255, 255, 255, 0.8); padding: 15px;">
        <template v-for="(media, index) in mPostContent.mediaData">
          <v-layout row justify-space-between
            style="border-radius: 10px; background: lightblue; padding: 20px; margin: 10px">
            <!-- Existing media -->
            <template v-if="media.path !== ''">
              <!-- Left hand side -->
              <v-flex xs4>
                <!-- Thumbnail -->
                <v-img aspect-ratio="1.77"
                  v-if="media.type === 'video'"
                  :src="'http://img.youtube.com/vi/' + getYoutubeId(media.path) + '/0.jpg'"/>
                <v-img aspect-ratio="1.77"
                  v-else
                  :src="media.path"/>
              </v-flex>

              <!-- Right hand side -->
              <v-flex xs7>
                <v-select dense
                  label="順番"
                  prepend-icon="format_list_numbered"
                  v-model="mPostContent.mediaData[index].order"
                  :items="Array.from(Array(mPostContent.mediaData.length).keys())"/>
                <v-text-field
                  v-if="media.type === 'video'"
                  prepend-icon="link"
                  label="Youtube埋め込みリンク"
                  v-model="media.path"/>
                <v-text-field
                  v-else
                  prepend-icon="link"
                  label="画像のURL"
                  v-model="media.path"/>

              </v-flex>
            </template>

            <!-- New media -->
            <template v-else>
              <!-- Left hand side -->
              <v-flex xs4>
                <!-- Thumbnail -->
                <template v-if="media.path !== ''">
                  <v-img aspect-ratio="1.77"
                    v-if="media.type === 'video'"
                    :src="'http://img.youtube.com/vi/' + getYoutubeId(media.path) + '/0.jpg'"/>
                  <v-img aspect-ratio="1.77"
                    v-else
                    :src="media.path"/>
                </template>
                <template v-else>
                  <v-flex style="border: solid 1px black;">
                    メディアなし
                  </v-flex>
                </template>

                <!-- if delete -->
                <v-btn dense @click="removeNewMedia(index)">
                  <v-icon>delete_forever</v-icon>
                  取り消し
                </v-btn>
              </v-flex>

              <!-- Right hand side -->
              <v-flex xs7>
                <v-select dense
                  label="順番"
                  prepend-icon="format_list_numbered"
                  v-model="mPostContent.mediaData[index].order"
                  :items="Array.from(Array(mPostContent.mediaData.length).keys())"/>
                <v-select dense
                  label="種類"
                  v-model="mPostContent.mediaData[index].type"
                  :items="Object.keys(mediaTypeToJp)"/>
                <v-text-field
                  v-if="media.type === 'video'"
                  prepend-icon="link"
                  label="Youtube埋め込みリンク"
                  v-model="media.path"/>
                <v-text-field
                  v-else-if="media.type === 'image' && media.path !== ''"
                  prepend-icon="link"
                  label="画像のURL"
                  v-model="media.path"/>
                <image-uploader-new
                  v-if="media.type === 'image'"
                  :mediaIndex="index"
                  @editMediaData="editMediaData"
                  />

              </v-flex>
            </template>
          </v-layout>
        </template>

        <v-flex style="padding: 10px">
          <v-btn @click="addNewMedia" style="background: lightblue; border-radius: 10px; width: 100%; margin: 0">
            <v-icon color="lightgray">add_circle</v-icon>
          </v-btn>
        </v-flex>
      </v-flex>
    </v-flex>

    <!-- Selector -->
    <v-flex xs3 id="StagesMediaSelector">
      <div style="position: absolute; top: 0; width: 100%">
        <template v-for="media in mPostContent.mediaData">
          <v-flex v-if="media.type === 'video'"
            class="StagesMediaSelectorEl bgCoverSettings"
            :class="{StagesMediaSelectorElSelected: media.path === selectedMedia.path}"
            :style="'background-image: url(http://img.youtube.com/vi/' + getYoutubeId(media.path) + '/0.jpg)'">
            <v-icon x-large color="red"> play_circle_filled_white </v-icon>
          </v-flex>
          <v-flex v-else
            class="StagesMediaSelectorEl bgCoverSettings"
            :class="{StagesMediaSelectorElSelected: media.path === selectedMedia.path}"
            :style="'background-image: url('+ media.path +')'"
            @click="changeMedia('image', media.path)">
          </v-flex>
        </template>
      </div>
    </v-flex>
  </v-layout>

  <!-- Stage Description Area -->
  <v-flex id="StagesTextContainer">
    <!-- Description -->
    <v-layout row justify-space-around>
      <v-flex xs1> 【説明】 </v-flex>
      <v-flex xs10>
        <v-textarea
          outline auto-grow
          label="Description"
          v-model="mPostContent.stageDescription"/>
      </v-flex>
    </v-layout>

    <!-- Date -->
    <v-layout row justify-space-around>
      <v-flex xs1> 【日時】 </v-flex>
      <v-flex xs10>
        <v-layout row justify-space-between>
          <v-flex xs4>
            <v-text-field outline auto-grow label="Year" v-model="mPostContent.stageDate.year"/>
          </v-flex>
          <v-flex xs4>
            <v-text-field outline auto-grow label="Month" v-model="mPostContent.stageDate.month"/>
          </v-flex>
          <v-flex xs4>
            <v-text-field outline auto-grow label="Day" v-model="mPostContent.stageDate.day"/>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>

    <!-- Year Group -->
    <v-layout row justify-space-around>
      <v-flex xs1> 【年度】 </v-flex>
      <v-flex xs10>
        <v-text-field
          outline
          label="年度"
          v-model="mPostContent.yearGroup"/>
      </v-flex>
    </v-layout>

    <!-- Location -->
    <v-layout row justify-space-around>
      <v-flex xs1> 【場所】 </v-flex>
      <v-flex xs10>
        <v-text-field outline auto-grow
          label="Location" v-model="mPostContent.location"/>
      </v-flex>
    </v-layout>
  </v-flex>
</v-flex>
</template>


<script>
import ImageUploaderNew from '@/utils/imageUploaderNew'

export default {
  name: 'StagesNewPost',
  components: {
    'image-uploader-new': ImageUploaderNew
  },
  data() {
    return {
      mPostContent: {
        'location': '',
        'mediaData': [],
        'postId': '',
        'stageDate': {
          'year': 0,
          'month': 0,
          'day': 0
        },
        'status': 'published',
        'yearGroup': 0
      },
      mediaTypeToJp: {
        'video': '動画',
        'image': '写真'
      },
      selectedMedia: {
        path: "",
        type: ""
      },
    }
  },
  methods: {
    addToUpdateList() {
      // Reorder media data
      this.mPostContent.mediaData
        .sort((a, b) => {
            if(a.order < b.order) return -1;
            if(a.order > b.order) return 1;
            return 0;
        })

      let formattedContent = JSON.parse(JSON.stringify(this.mPostContent))

      // Remove delete properties
      for (let [index, media] of formattedContent.mediaData.entries()) {
        formattedContent.mediaData[index] = {
          'path': media.path,
          'type': media.type
        }
      }

      const S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      const N=16
      const newPostId = Array.from(Array(N)).map(()=>S[Math.floor(Math.random()*S.length)]).join('')

      formattedContent.postId = newPostId
      formattedContent.yearGroup = Number(formattedContent.yearGroup)
      console.log(formattedContent)

      this.$emit('addToUpdateList', formattedContent)
    },
    getYoutubeId(moviePath) {
      const splitted = moviePath.split('/')
      return splitted[splitted.length-1]
    },
    removeNewMedia(index) {
      this.mPostContent.mediaData.splice(index, 1)
    },
    editMediaData(index, url){
      this.mPostContent.mediaData[index].path = url
    },
    addNewMedia() {
      this.mPostContent.mediaData.push({
        "path": "",
        "type": "video",
        "order": this.mPostContent.mediaData.length,
        "delete": false
      })
    }
  }
}
</script>


<style>
.bgCoverSettings{
  background-size: cover;
  background-repeat: none;
  background-position: center center;
}
#StagesMediaContainerE{
  position: relative;
  background-color: rgba(50, 50, 50, 0.8);
  width: 100%;
  padding: 25px;
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

</style>
