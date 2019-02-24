<template>
<!-- Normal mode -->
<v-flex v-if="!$store.state.editMode"
  id="StagesMediaBigContainer">
  <v-flex xs12>
    <h1>{{ mPostContent.stageName }}</h1>
  </v-flex>
  <v-layout row>
    <!-- Media Container -->
    <v-flex xs9 id="StagesMediaContainer">
      <!-- Video -->
      <iframe
        v-if="selectedMedia.type === 'video'"
        style="min-height: 250px"
        width="100%" height="100%"
        :src="selectedMedia.path"
        frameborder="0" allowfullscreen
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture">
      </iframe>

      <!-- Image -->
      <div
        v-else-if="selectedMedia.type === 'image'"
        class="bgCoverSettings"
        :style="'background-image: url(' + selectedMedia.path + ')'"
        width="100%" height="100%">
      </div>

      <div v-else>
        kfdjfkdjfkj
      </div>
    </v-flex>

    <!-- Media selector -->
    <v-flex xs3 id="StagesMediaSelector">
      <div style="position: absolute; top: 0; width: 100%">
        <template v-for="media in mPostContent.mediaData">
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
      </div>
    </v-flex>
  </v-layout>

  <v-flex id="StagesTextContainer">
    <v-flex>
      {{ mPostContent.stageDescription }}
    </v-flex>
    <v-flex>
      【日時】 {{ formatDate(mPostContent.stageDate) }}
    </v-flex>
    <v-flex>
      【場所】 {{ mPostContent.location }}
    </v-flex>
  </v-flex>
</v-flex>



<!-- Edit mode -->
<v-flex v-else
  id="StagesMediaBigContainer">

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

                <!-- if delete -->
                <v-checkbox dense
                  v-if="index < pageContents.filter(el => el.isSelected)[0].mediaData.length"
                  label="削除する"
                  v-model="mPostContent.mediaData[index].delete"
                  prepend-icon="delete_forever">
                </v-checkbox>
                <v-btn
                  v-else
                  dense @click="removeNewMedia(index)">
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
  name: 'StagesContent',
  props: ['pageContents', 'updateList'],
  components: {
    'image-uploader-new': ImageUploaderNew
  },
  data() {
    return {
      selectedMedia: {
        path: "",
        type: ""
      },
      mediaTypeToJp: {
        'video': '動画',
        'image': '写真'
      },
      mPostContent: {}
    }
  },
  methods: {
    formatDate(stageDate) {
      const year = stageDate.year
      const month = stageDate.month
      const day = stageDate.day
      return year + '年 ' + month + '月 ' + day + '日'
    },
    changeMedia(type, path){
      this.selectedMedia = {
        type, path
      }
    },
    getYoutubeId(moviePath) {
      const splitted = moviePath.split('/')
      return splitted[splitted.length-1]
    },
    addToUpdateList(){
      // Reorder media data
      this.mPostContent.mediaData
        .sort((a, b) => {
            if(a.order < b.order) return -1;
            if(a.order > b.order) return 1;
            return 0;
        })

      // Remove designated media
      for (let [index, media] of this.mPostContent.mediaData.entries()) {
        if (media.delete || media.path === '') {
          this.mPostContent.mediaData.splice(index, 1)
        }
      }

      let formattedContent = JSON.parse(JSON.stringify(this.mPostContent))

      // Remove delete properties
      for (let [index, media] of formattedContent.mediaData.entries()) {
        formattedContent.mediaData[index] = {
          'path': media.path,
          'type': media.type
        }
      }
      console.log(formattedContent.mediaData)

      this.$emit('addToUpdateList', formattedContent)
    },
    addNewMedia() {
      this.mPostContent.mediaData.push({
        "path": "",
        "type": "video",
        "order": this.mPostContent.mediaData.length,
        "delete": false
      })
    },
    removeNewMedia(index) {
      this.mPostContent.mediaData.splice(index, 1)
    },
    editMediaData(index, url){
      this.mPostContent.mediaData[index].path = url
    }
  },
  created() {
    // Initialize first selected media
    let selectedPost = this.pageContents.filter(el => el.isSelected)[0]
    this.selectedMedia = selectedPost.mediaData[0]

    let alreadyEdited = false
    if (this.updateList.length){
      for (let entry of this.updateList){
        if (entry.postId === selectedPost.postId) {
          alreadyEdited = true
        }
      }
    }

    if (alreadyEdited){
      this.mPostContent = this.updateList.filter(el => el.postId === selectedPost.postId)[0].newData
    } else {
      this.mPostContent = JSON.parse(JSON.stringify(selectedPost))
    }

    // Add order property to media data for editing purpose
    for (let i=0; i<this.mPostContent.mediaData.length; i++){
      this.mPostContent.mediaData[i]['order'] = Number(i)
      this.mPostContent.mediaData[i]['delete'] = false
    }
  }
}
</script>

<style scoped>
.bgCoverSettings{
  background-size: cover;
  background-repeat: none;
  background-position: center center;
}

#StagesMediaContainer, #StagesMediaContainerE {
  position: relative;
  background-color: rgba(50, 50, 50, 0.8);
  width: 100%;
}

#StagesMediaContainerE {
  padding: 25px;
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
