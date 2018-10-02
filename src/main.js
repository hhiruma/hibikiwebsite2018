// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

import firebase from 'firebase'
import 'firebase/firestore'

var config = {
  apiKey: "AIzaSyBVBbbhxfonXfBRM30vooQaVVEZad3B-Gg",
  authDomain: "hibikiwebsite2018.firebaseapp.com",
  databaseURL: "https://hibikiwebsite2018.firebaseio.com",
  projectId: "hibikiwebsite2018",
  storageBucket: "hibikiwebsite2018.appspot.com",
  messagingSenderId: "900546300051",
}
firebase.initializeApp(config)

var firestore = firebase.firestore()
const setting = {timestampsInSnapshots: true}
firestore.settings(setting)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
