<template>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'LoginPage',
  created() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider).then(result =>{
    }).catch(err => {
      console.log(err)
    })
  }
}
</script>

<style scoped>
</style>