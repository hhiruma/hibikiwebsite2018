<template>
  <v-layout row justify-space-between id="NewComersContainer">
      <template v-if="!loader.isLoading">
        <v-flex xs5 align-start id="NewComersDesc">
          <h1>新歓情報 {{output.newComersSettings.validYear }}</h1>
          <hr>
          <v-card v-for="event in output.newComersContent" dark
                  style="border-radius: 15px; margin: 10px 0px 10px 20px">
            <v-card-title primary-title>
              <v-layout column>
                <v-flex>
                  <h3 style="text-decoration: underline"> {{ event.name }} </h3>
                </v-flex>
                <v-flex style="text-align: right">
                  <template v-if="event.date.length == 1"> {{ event.date[0] }} </template>
                  <template v-else> {{ event.date[0] }} 〜 {{ event.date[1] }} </template>
                  <br>
                  <template v-if="event.time !== ''"> {{ event.time }} </template>
                  <br>
                  <template v-if="event.location !== ''"> {{ event.location }} </template>
                </v-flex>
              </v-layout>

            </v-card-title>
          </v-card>
            {{ output.newComersSettings.message}}
        </v-flex>

        <v-flex xs6 id="NewComersMedia">
          <v-layout column>
            <v-flex v-if="output.newComersSettings.billImgOrientation == 'horizontal'">
              <v-img
                v-for="(url, i) in output.newComersSettings.billImgPaths"
                style="margin: 10px;"
                :key="i" :src="url"
                aspect-ratio="1.41"
                max-width height="auto">
                <v-dialog v-model="imageModal" width="800">
                  <v-btn slot="activator"
                          @click="setModalUrl(url)"
                          fab icon color="white"
                          small>
                    <v-icon>fullscreen</v-icon>
                  </v-btn>
                  <v-card>
                    <v-img :src="imageModalUrl"> </v-img>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-img>
            </v-flex>

            <v-flex v-else>
              <v-layout row>
                <v-img
                  v-for="(url, i) in output.newComersSettings.billImgPaths"
                  style="margin: 10px;"
                  :key="i" :src="url"
                  aspect-ratio="0.70"
                  max-width height="auto">
                  <v-dialog v-model="imageModal" width="600">
                    <v-btn slot="activator"
                           @click="setModalUrl(url)"
                           fab icon color="white"
                           small>
                      <v-icon>fullscreen</v-icon>
                    </v-btn>
                    <v-card>
                      <v-img :src="imageModalUrl"> </v-img>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-img>
              </v-layout>
            </v-flex>
          </v-layout>
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
            imageModal: false,
            imageModalUrl: "",
            loader: {
                isLoading: true,
                targetParams: [],
            },
            output: {} //newComersContents
        }
    },
    methods: {
        setModalUrl(url) {
            this.imageModalUrl = url
        }
    },
    async created() {
        contentsLoader.addLoadTarget(this.loader, loaderPresets.newComersSettings)
        this.output = await contentsLoader.startLoading(this.loader)

        contentsLoader.addLoadTarget(this.loader, {
          name: 'newComersContent',
          type: 'firestore',
          whichPath: 'collection',
          path: 'Contents/NewComers/'+this.output.newComersSettings.validYear,
          options: {
            order: {
              field: 'order',
              direction: 'asc'
            }
          }
        })
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
