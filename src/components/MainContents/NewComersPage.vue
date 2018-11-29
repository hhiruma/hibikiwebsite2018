<template>
  <v-layout row justify-space-between id="NewComersContainer">
      <template v-if="!loader.isLoading">
        <v-flex xs5 id="NewComersDesc">
            {{ output.newComersContents.description }}
        </v-flex>

        <v-flex xs6 id="NewComersMedia">
            <v-carousel style="border-radius: 10px;"
                delimiter-icon="stop" cycle="false">
                <v-carousel-item
                    v-for="(url, i) in output.newComersContents.billImgPaths"
                    :key="i"
                    :src="url">
                </v-carousel-item>
            </v-carousel>
        </v-flex>
      </template>
  </v-layout>
</template>

<script>
import firestore from '@/firebase_firestore'
import { contentsLoader, loaderPresets } from '@/utils'

export default {
    name: 'NewComersPage',
    data() {
        return {
            loader: {
                isLoading: true,
                targetParams: [],
            },
            output: {} //newComersContents
        }
    },
    async created() {
        contentsLoader.addLoadTarget(this.loader, loaderPresets.newComersContents)

        this.output = await contentsLoader.startLoading(this.loader)
    }
}
</script>

<style scoped>
#NewComersDesc {
    border-radius: 10px;
    background-color: rgba(200, 200, 200, 0.5);
    box-sizing: border-box;
    padding: 30px;
}
</style>