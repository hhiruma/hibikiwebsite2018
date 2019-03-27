<template>
  <v-flex id="NewComersDesc" xs4 align-start>
    <v-layout row id="NewComersTitle">
      <v-flex v-if="!$store.state.editMode">
        新歓情報 {{ mSettings.validYear }}
      </v-flex>

      <v-flex v-else>
        <v-layout v-if="!isLoading" row>
          <v-flex>
            <v-layout align-center fill-height>
              <v-flex style="font-size: 0.75em;">
                新歓情報
              </v-flex>
            </v-layout>
          </v-flex>
          <v-select
            :items="mSettings.availableYears"
            :value="mSettings.validYear"
            @input="changeValidYear($event)"
            label="年度"/>
          <v-dialog
            v-model="addAvailableYearSwitch"
            width="400">
            <v-btn
              fab dark small color="red"
              slot="activator"
              @click="addAvailableYearSwitch = true;">
              <v-icon>add</v-icon>
            </v-btn>

            <v-flex id="NewComersAddYearDialog">
              <v-layout column>
                <v-flex>
                  年度を指定して追加する
                </v-flex>
                <v-flex>
                  <v-layout row>
                    <v-form ref="addYearForm" v-model="addYearValid">
                      <v-text-field
                        clearable
                        autofocus
                        prepend-icon="calendar_today"
                        label="追加する年度"
                        :rules="newAvailableYearRules"
                        v-model="newAvailableYear"/>
                    </v-form>
                    <v-btn
                      :disabled="!addYearValid"
                      @click="addNewYear">
                      追加
                    </v-btn>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-dialog>
        </v-layout>
      </v-flex>
    </v-layout>

    <template v-if="$store.state.editMode">
      <v-layout row style="padding: 0px 25px">
        <v-btn @click="updateEventData">
          <v-icon> cloud_upload </v-icon> アップロード
        </v-btn>
        <v-flex style="font-size: 0.5em">
          <v-layout fill-height align-center>
            ※ イベント関連の部分のみ
          </v-layout>
        </v-flex>
      </v-layout>
      <v-flex>
        <v-checkbox
          v-model="mSettings.publish"
          label="ページを公開"/>
      </v-flex>
    </template>

    <v-divider/>

    <v-flex id="NewComersDescEvents">
      <v-card v-for="(event, index) in selectedYearContent" class="NewComersEvent">
        <v-card class="NewComersEventTitle" style="border-radius: 10px">
          <template v-if="!event.editMode">
            {{ event.name }}
          </template>
          <template v-else>
            編集中
          </template>
        </v-card>
        <v-img v-if="event.type == '話す'"
              src="https://firebasestorage.googleapis.com/v0/b/hibikiwebsite2018.appspot.com/o/images%2Ficon%2Fteam.png?alt=media&token=17555065-f4d3-457f-8faa-0dc2f5a4e098"
              class="NewComersEventIcon"/>
        <v-img v-else-if="event.type == '食事'"
                src="https://firebasestorage.googleapis.com/v0/b/hibikiwebsite2018.appspot.com/o/images%2Ficon%2Feat.png?alt=media&token=57e5ba2e-559f-4476-8b39-797c6fc77440"
                class="NewComersEventIcon"/>
        <v-img v-else-if="event.type == '音楽'"
                src="https://firebasestorage.googleapis.com/v0/b/hibikiwebsite2018.appspot.com/o/images%2Ficon%2Fmusic.png?alt=media&token=e2be5723-1f97-4d11-92a3-dad2486a0dc8"
                class="NewComersEventIcon"/>

        <v-layout>
          <v-checkbox
            v-if="$store.state.editMode"
            v-model="event.deleteIt"
            prepend-icon="delete"/>

          <template v-if="!event.editMode">
            <v-flex class="NewComersEventContent">
              {{ event.date }}
              <br>
              {{ event.time }}
              <br>
              {{ event.location }}
            </v-flex>
            <v-btn v-if="$store.state.editMode"
                  @click="selectedYearContent[index].editMode = true"
                  fab dark small absolute top right color="cyan">
              <v-icon dark>edit</v-icon>
            </v-btn>
          </template>

          <template v-else>
            <v-flex style="padding: 0px 20px 20px 20px">
              <v-text-field dense v-model="event.name" label="名前"/>
              <v-flex class="NewComersEventContent">
                <v-text-field dense v-model="event.date" label="日付"/>
                <v-text-field dense v-model="event.time" label="時間"/>
                <v-text-field dense v-model="event.location" label="場所"/>
                <v-select dense v-model="event.type" label="種類"
                  :items="['話す', '食事', '音楽', 'その他']"/>

              </v-flex>
              <v-btn @click="selectedYearContent[index].editMode = false"
                    fab dark small absolute top right color="red">
                <v-icon dark>close</v-icon>
              </v-btn>
            </v-flex>
          </template>
        </v-layout>
      </v-card>

      <v-flex v-if="$store.state.editMode" class="NewComersDescAddContainer">
        <v-btn class="NewComersDescAddBtn" @click="addEvent">
          <v-icon color="lightgray">add_circle</v-icon>
        </v-btn>
      </v-flex>

      <v-flex style="padding: 25px">
        {{ settings.message }}
      </v-flex>
    </v-flex>

    <!-- snackbars -->
    <v-snackbar
      v-if="updateTrigger.success"
      v-model="updateTrigger.success"
      :right="true"
      :timeout="3000"
      >
      <v-icon color="green">check_circle_outline</v-icon>
      更新完了
    </v-snackbar>
    <v-snackbar
      v-if="updateTrigger.failed"
      v-model="updateTrigger.failed"
      :right="true"
      :timeout="3000"
      >
      <v-icon color="red">check_circle_outline</v-icon>
      更新失敗
    </v-snackbar>
  </v-flex>
</template>

<script>
import { contentsLoader, loaderPresets } from '@/utils'
import firestore from '@/firebase_firestore'

export default {
  name: 'NewComersDesc',
  props: ['settings', 'contents', 'windowSize'],
  data() {
    return {
      isLoading: true,
      mContentsList: [],
      mSettings: {},
      addYearValid: false,
      addAvailableYearSwitch: false,
      newAvailableYear: '',
      newAvailableYearRules: [
        value => {
          const isAround2000 = (Number(value) >= 2000) && (Number(value) <= 2100)
          const isNew = this.mSettings.availableYears.includes(value)
          return isAround2000 && !isNew
        }
      ],
      updateTrigger: {
        'success': false,
        'failed': false
      },
      loader: {
          isLoading: true,
          targetParams: [],
      },
      output: {}
    }
  },
  computed: {
    selectedYearContent() {
      let filteredList = this.mContentsList.filter(el => el.year === this.mSettings.validYear)
      console.log(filteredList)
      if (!filteredList.length) {
        console.error('ERROR: no data found')
        return false
        //ここで、このyearのデータがmContentsListに含まれていない場合は新しくfirestoreからGETする処理を書く
      }
      return filteredList[0].content
    },
    descWidth() {
      return '30' ? this.$store.state.editMode : '70'
    }
  },
  methods: {
    addNewYear() {
      if (this.newAvailableYear === 0) return
      this.mSettings.availableYears.push(Number(this.newAvailableYear))
      this.mSettings.availableYears.sort((a, b) => {
        if (a < b) return 1
        if (a > b) return -1
        return 0
      })
      this.addAvailableYearSwitch = false
      this.changeValidYear(Number(this.newAvailableYear))
    },
    getContent(year) {
      let filteredList = this.mContentsList.filter(el => el.year === this.mSettings.validYear)
      if (!filteredList.length) {
        console.error('ERROR: no data found')
        return false
      }
      return filteredList[0].content
    },
    async getNewYearData(newYear) {
      contentsLoader.addLoadTarget(this.loader, {
        name: `newComersContent${newYear}`,
        type: 'firestore',
        whichPath: 'collection',
        path: `Contents/NewComers/description/posts/${newYear}`
      })
      let output = await contentsLoader.startLoading(this.loader)
      return output[`newComersContent${newYear}`]
    },
    async changeValidYear(evValue) {
      let newYear = evValue
      this.mSettings.validYear = newYear
      let filteredList = this.mContentsList.filter(el => el.year === this.mSettings.validYear)
      if (!filteredList.length){
        let newYearData = [await this.getNewYearData(newYear)]
        for (let [index, el] of newYearData.entries()) {
          if (!('name' in el)) {
            console.log('no name')
            newYearData[index] = {
              'date': '',
              'location': '',
              'name': '',
              'time': '',
              'type': '',
              'editMode': false,
              'deleteIt': false
            }
          }
        }
        newYearData.map(el => el.editMode = false)
        newYearData.map(el => el.deleteIt = false)
        this.mContentsList.push({
          'content': newYearData,
          'year': newYear
        })
      }
    },
    addEvent() {
      let targetIndex
      for (const [index, el] of this.mContentsList.entries()) {
        if (el.year === this.settings.validYear) {
          targetIndex = index
          break
        }
      }

      this.mContentsList[targetIndex].content.push({
        'date': '',
        'location': '',
        'name': '',
        'time': '',
        'type': '',
        'editMode': true,
        'deleteIt': false
      })
      console.log(this.mContentsList)
    },
    async updateEventData() {
      Promise.resolve()
        .then(() => {
          return new Promise((fulfilled, rejected) => {
            firestore
              .collection('Contents')
              .doc('NewComers')
              .set(this.mSettings)
              .then(() => {
                fulfilled()
              })
          })
        })
        .then(() => {
          return Promise.all(this.mContentsList.map(entry => {
            return Promise.all(entry.content.map((el, index) => {
              return new Promise((fulfilled, rejected) => {
                firestore
                  .collection('Contents/NewComers/description/posts/' + entry.year)
                  .doc(String(index))
                  .delete()
                  .then(() => {
                    fulfilled()
                  })
              })
            }))
          }))
        })
        .then(() => {
          return Promise.all(this.mContentsList.map(entry => {
            return Promise.all(entry.content.map((el, index) => {
              if (el.deleteIt !== true) {
                return new Promise((fulfilled, rejected) => {
                  firestore
                    .collection('Contents/NewComers/description/posts/' + entry.year)
                    .doc(String(index))
                    .set(el)
                    .then(() => {
                      console.log('done')
                      fulfilled()
                    })
                })
              }
            }))
          }))
        })
        .then(() => {
          this.updateTrigger.success = true
          this.$emit('refreshData')
          this.initData()
        })
        .catch((err) => {
          console.error(err)
          this.updateTrigger.failed = true
        })
    },
    initData() {
      console.log(this.contents)
      let content = JSON.parse(JSON.stringify(this.contents))
      if (!Array.isArray(content)) {
        content = [content]
      }
      content.map(el => el.editMode = false)
      this.mContentsList.push({
        'year': this.settings.validYear,
        'content': content
      })
      this.mSettings = JSON.parse(JSON.stringify(this.settings))
      console.log(this.mSettings)
    },
    copyData(data) {
      let contents = data['newComersContent']
      let settings = data['newComersSettings']

      if (!Array.isArray(contents)) {
        contents = [contents]
      }
      contents.map(el => el.editMode = false)
      this.mContentsList.push({
        'year': settings.validYear,
        'content': contents
      })
      this.mSettings = settings //ここがどうもうまくいかない
      //2019.03.21　なんだっけこれ？

      this.isLoading = false
    }
  },
  created() {
    this.isLoading = true
  }
}
</script>

<style>
#NewComersDesc {
  background: rgba(255, 255, 255, 0.8);
  overflow: scroll;
}

#NewComersTitle {
  padding: 20px 20px 10px 20px;
  font-size: 2em;
  font-weight: bold;
  height: 14vh;
}

#NewComersDescEvents {
  overflow: scroll;
  height: 75vh;
  padding: 15px 0px;
}

.NewComersEvent {
  border-radius: 20px;
  margin: 25px;
  padding: 30px 10px 10px 10px;
}

.NewComersEventTitle {
  position: absolute;
  background: white;
  top: -15px;
  padding: 8px 10px;
  border-radius: 10px;
}

.NewComersEventContent {
  text-align: right;
  color: gray;
  padding-left: 50px;
}

.NewComersEventIcon {
  position: absolute;
  width: 30px;
  height: 30px;
  bottom: 10px;
}

#NewComersAddYearDialog {
  background: white;
  padding: 20px;
}

.NewComersDescAddContainer {
  padding: 0px 25px 25px 25px;
  width: 100%;
}

.NewComersDescAddBtn {
  border-radius: 10px;
  width: 100%;
  margin: 0
}
</style>
