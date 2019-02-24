<template>
<!-- Normal mode -->
<v-flex v-if="!$store.state.editMode">
  <v-layout row>
    <v-flex xs6 style="padding-right: 20px;">
      <v-layout column>
        <v-flex style="margin-bottom: 20px; background: rgba(255, 255, 255, 0.6);
                        padding: 15px; margin: 0px 10px; border-radius: 20px;">
          <h2>舞台について</h2>
          <v-layout justify-end style="padding-top: 20px">
            <v-flex xs11>
              {{ stagesDetails}}
            </v-flex>
          </v-layout>
        </v-flex>
        <!--
        <v-flex v-if="output.nextStageDetail.hasNextStage">
          <h1>次の舞台</h1>
          <v-layout justify-end>
            <v-flex xs11 >
              <h2> {{ nextStageDetail.name }} </h2>
              <v-flex>
                {{ nextStageDetail.description }}
              </v-flex>
              <v-flex>
                【日時】{{ nextStageDetail.location }}
              </v-flex>
              <v-flex>
                【場所】{{ nextStageDetail.date }}
              </v-flex>
            </v-flex>
          </v-layout>
        </v-flex>
        -->
      </v-layout>
    </v-flex>
    <v-img xs6 src="https://pbs.twimg.com/media/DsfLiSfVYAAuZa4.jpg:large"/>
  </v-layout>
</v-flex>


<!-- Edit mode -->
<v-flex v-else>
  <v-layout row>
    <v-flex xs6 style="padding-right: 20px;">
      <v-layout column>
        <v-flex style="margin-bottom: 20px; background: rgba(255, 255, 255, 0.6);
                        padding: 15px; margin: 0px 10px; border-radius: 20px;">
          <v-text-field
            outline
            label="Title"
            v-model="mStageDetails.title"/>
          <v-textarea
            outline auto-grow
            label="Text"
            v-model="mStageDetails.content"/>
          </v-textarea>
          <v-layout justify-end>
            <v-btn color="info" @click="uploadData(mPageContent)">
              更新
            </v-btn>
          </v-layout>

        </v-flex>
      </v-layout>
    </v-flex>
    <v-img xs6 aspect-ratio=1.77 contain
      src="https://pbs.twimg.com/media/DsfLiSfVYAAuZa4.jpg:large"/>
  </v-layout>
</v-flex>
</template>

<script>
export default {
  name: 'StagesTop',
  //props: ['stagesDetails', 'nextStageDetail', 'mStageDetails']
  props: ['stagesDetails', 'mStageDetails']
}
</script>

<style scoped>
</style>
