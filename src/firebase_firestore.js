import firebase from '@/firebase'
import 'firebase/firestore'

var firestore = firebase.firestore()
const setting = {timestampsInSnapshots: true}
firestore.settings(setting)

export default firestore