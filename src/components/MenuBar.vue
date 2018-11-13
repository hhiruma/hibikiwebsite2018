<template>
  <div id="MB_container">
    <menu-bar-element v-for="page in pageList" :pageData="page" :key="page.slug"/>
    <div style="position: absolute; top: 10px; right: 10px; color: white"
       v-if="$store.getters.isMasterUser(currentUser)">編集モード</div>
  </div>
</template>

<script>
import firestore from '@/firebase_firestore'
import firebase from 'firebase'
import MenuBarElement from '@/components/MenuBarElement'

export default {
  name: 'MenuBar',
  data () {
    return {
      currentPage: this.$store.state.currentPage,
      pageList: this.$store.state.pageSettings,
      currentUser: firebase.auth().currentUser
    }
  },
  components: {
    'menu-bar-element': MenuBarElement
  }
}
</script>

<style scoped>
#MB_container {
    position: absolute;
    height: 55px;
    width: 100%;
    padding: 9px 20px;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.6);
}
</style>
