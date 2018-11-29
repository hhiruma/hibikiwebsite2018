<template>
  <v-toolbar dark dense id="MB_container">
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <v-toolbar-items>
      <menu-bar-element v-for="page in pageList" :pageData="page" :key="page.slug"/>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <v-toolbar-items v-if="isMasterUser">
      <v-toolbar-title>編集モード</v-toolbar-title>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import firebase from 'firebase'
import firestore from '@/firebase_firestore'
import { mapState, mapGetters } from 'vuex'
import MenuBarElement from '@/components/MenuBarElement'

export default {
  name: 'MenuBar',
  computed: {
    ...mapGetters([
      'isMasterUser'
    ]),
    ...mapState({
      pageList: state => state.globalContents.pageSettings
    })
  },
  components: {
    'menu-bar-element': MenuBarElement
  }
}
</script>

<style scoped>
#MB_container {
    background-color: rgba(0, 0, 0, 0.6);
}
</style>
