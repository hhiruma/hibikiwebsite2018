<template>
    <v-container fluid style="padding: 0">
      <v-layout style="position: fixed; width: 100%; height: 100vh; top: 0; z-index: -1;">
        <v-img :src="output.contactBg">
          <v-flex style="height: 100vh; width: 100%;  background: rgba(0, 0, 0, 0.5)"/>
        </v-img>
      </v-layout>
      <v-layout id="ContactsContainer" column>
          <v-flex xs12 id="ContactForm">
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdZFOoGsRSrtlDtZtOQZxJBaXRlEctXntt7RWR30Q1liaOEgg/viewform?embedded=true"
                    width="100%" height="1518" frameborder="0" marginheight="0" marginwidth="0">
              読み込んでいます...
            </iframe>
          </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { contentsLoader, loaderPresets } from '@/utils'

export default {
  name: 'ContactsPage',
  data() {
    return {
      contactDescription: "",
      pageLoaded: false,
      loader: {
        isLoading: true,
        targetParams: [],
      },
      output: {} //expect 'contactBg'
    }
  },
  async created() {
    contentsLoader.addLoadTarget(this.loader, loaderPresets.contactBg)
    this.output = await contentsLoader.startLoading(this.loader)

    this.$store.commit('setTransitionState', 'out')
  }
}
</script>

<style scoped>
#ContactsContainer {
    width: 100%;
    height: 100%;
    overflow: scroll;
    padding: 5%;
}

#ContactForm {
    width: 70%;
    background-color: white;
    padding: 30px 30px 30px 30px;
    box-sizing: border-box;
    border-radius: 20px;
}
</style>
