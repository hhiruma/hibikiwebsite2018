<template>
    <v-layout id="ContactsContainer" column v-if="pageLoaded">
        <v-flex xs12>
            <h1 style="color: white"> お問い合わせフォーム </h1>
        </v-flex>
        <br>
        <v-flex xs12 id="ContactForm">
            <div id="ContactsDescription">
                {{ contactDescription }}
            </div>
            <br><hr><br>
            <v-form>
                <v-text-field v-model="form.name" label="お名前" :rules="[v => !!v || '必須']" required></v-text-field>
                <v-text-field v-model="form.address" label="ご連絡先《メールアドレス）" :rules="[v => !!v || '必須',  v => /.+@.+/.test(v) || '形式が間違っています']" required></v-text-field>
                <v-textarea v-model="form.main" label="ご用件" required :rules="[v => !!v || '必須']" box></v-textarea>
                <v-text-field v-model="form.date" label="舞台日程"></v-text-field>
                <v-text-field v-model="form.place" label="舞台の場所（名称 または 住所)"></v-text-field>
                <v-text-field v-model="form.size" label="舞台の広さ (縦 x 横)"></v-text-field>
                <v-text-field v-model="form.time" label="演奏予定時間"></v-text-field>
                <v-text-field v-model="form.due" label="ご回答期限目安"></v-text-field>
                <v-btn :disabled="form.valid" @click="submit">
                    送信
                </v-btn>
            </v-form>
        </v-flex>
    </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'

import firestore from '@/firebase_firestore'
// import sendMail from '@/functions'

export default {
  name: 'ContactsPage',
  data() {
      return {
          contactDescription: "",
          pageLoaded: false,
          form: {
              name: "",
              address: "",
              main: "",
              date: "",
              place: "",
              size: "",
              time: "",
              due: "",
          }
      }
  },
  methods: {
      submit() {
          console.log(this.form)
      }
  },
  watch: {
      contactDescription(val) {
          if (val) {
              this.pageLoaded = true
          }
      }
  },
  created() {
      firestore.doc('Contents/Contact').get().then(doc => {
          this.contactDescription = doc.data().ContactDescription
      })
      //sendMail()
      this.$store.commit('setTransitionState', 'out')
  }
}
</script>

<style scoped>
#ContactsContainer {
    width: 100%;
    height: 100%;
    overflow: scroll;
}

#ContactForm {
    width: 70%;
    background-color: rgba(200, 200, 200, 0.8);
    padding: 20px 20px 30px 20px;
    box-sizing: border-box;
    border-radius: 20px;
}
</style>
