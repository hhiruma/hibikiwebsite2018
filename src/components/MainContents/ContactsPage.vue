<template>
    <div id="ContactsContainer">
        <template v-if="pageLoaded">
            <h1 id="ContactFormTitle"> お問い合わせフォーム </h1>
            <div id="ContactForm">
                <div id="ContactsDescription">
                    {{ contactDescription }}
                </div>
                <hr>
                <table>
                    <tr>
                        <td class="ContactInputHeader">お名前<span style="font-size: 0.7em; color: red">(必須)</span></td>
                        <td><input placeholder="ex) 魁 響太郎"></td>
                    </tr>
                    <tr>
                        <td class="ContactInputHeader">ご連絡先(メールアドバイス)<span style="font-size: 0.7em; color: red">(必須)</span></td>
                        <td><input placeholder="ex) hibiki@example.com"></td>
                    </tr>
                    <tr>
                        <td class="ContactInputHeader">ご用件<span style="font-size: 0.7em; color: red">(必須)</span></td>
                        <td><textarea placeholder="舞台出演、見学等お気軽にご連絡ください" rows="6"/></td>
                    </tr>
                    <tr>
                        <td class="ContactInputHeader">舞台日程</td>
                        <td><input type="date"></td>
                    </tr>
                    <tr>
                        <td class="ContactInputHeader">舞台の場所 (名称 または 住所)</td>
                        <td><input placeholder="名称 または 住所を入力してください"></td>
                    </tr>
                    <tr>
                        <td class="ContactInputHeader">舞台の広さ (縦 x 横)</td>
                        <td><input placeholder="ex) 縦 ○m x 横 ○m"></td>
                    </tr>
                    <tr>
                        <td class="ContactInputHeader">演奏予定時間</td>
                        <td><input placeholder="ex) ○分程度"></td>
                    </tr>
                    <tr>
                        <td class="ContactInputHeader">ご回答期限目安</td>
                        <td><input placeholder="ex) ○月☓日まで"></td>
                    </tr>
                </table>
                <div id="ContactFormSender">送信</div>
            </div>
        </template>
    </div>
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
          pageLoaded: false
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
      sendMail()
  }
}
</script>

<style scoped>
#ContactsContainer {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: scroll;
}

#ContactFormTitle {
    position: absolute;
    left: 5%;
    color: white;
}

#ContactForm {
    position: absolute;
    width: 70%;
    background-color: rgba(200, 200, 200, 0.8);
    top: 100px;
    padding: 20px 20px 30px 20px;
    box-sizing: border-box;
    left: 3%;
    margin-bottom: 50px;
}

#ContactForm table{
    width: 100%;
}
#ContactForm tr {
    width: 100%;
}

#ContactForm .ContactInputHeader{
    width: 40%;
}

#ContactForm td {
    width: 80px;
    height: 40px;
    font-size: 0.9em;
}

#ContactForm input, #ContactForm textarea{
    width: 100%;
}

#ContactFormSender {
    padding: 10px 30px;
    background-color: white;
    color: black;
    border-radius: 5px;
    width: 50px;
    position: relative;
    text-align: center;
    margin: 10px 0;
    cursor: pointer;
}

</style>