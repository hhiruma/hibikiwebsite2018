<template>
  <v-toolbar dense id="MB_container">
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <v-toolbar-items>
      <menu-bar-element v-for="page in pageList" :pageData="page" :key="page.slug"/>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <v-toolbar-items v-if="isMasterUser">
      <v-switch
        :label="editModeLabel(editMode)"
        v-model="editMode"
        ></v-switch>
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
  methods: {
    editModeLabel(val) {
      if (val){
        return '編集モードON '
      } else {
        return '編集モードOFF'
      }
    }
  },
  computed: {
    editMode: {
      get () {
        return this.$store.state.editMode
      },
      set (val) {
        this.$store.commit('setEditMode', val)
      }
    },
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
}
</style>
