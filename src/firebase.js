import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyBVBbbhxfonXfBRM30vooQaVVEZad3B-Gg",
  authDomain: "hibikiwebsite2018.firebaseapp.com",
  databaseURL: "https://hibikiwebsite2018.firebaseio.com",
  storageBucket: "gs://hibikiwebsite2018.appspot.com",
  projectId: "hibikiwebsite2018",
  storageBucket: "hibikiwebsite2018.appspot.com",
  messagingSenderId: "900546300051",
}
firebase.initializeApp(config)

export default firebase