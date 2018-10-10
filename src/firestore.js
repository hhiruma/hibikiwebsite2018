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

export default firestore