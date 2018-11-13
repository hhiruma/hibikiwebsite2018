<template>
</template>

<script>
import firebase from 'firebase'
import firestore from '@/firebase_firestore'
import { mapMutations } from 'vuex'

export default {
    name: 'LoginPage',
    data() {
      return {
        masterUserAddress: ''
      }
    },
    methods: {
      async getMasterUser () {
          let tmp = await firestore.doc('Settings/Users').get()
          return tmp.data().MasterUserAddress
      },
    },
    watch: {
      masterUserAddress(val) {
        if (val === ''){
          return
        }
        let provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(result =>{
          if(val === this.masterUserAddress){
            this.$store.commit('toggleMasterMode')
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    async created() {
      this.masterUserAddress = await this.getMasterUser()
    }
}
</script>

<style scoped>
</style>