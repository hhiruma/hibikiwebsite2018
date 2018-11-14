<template>
  <div id="MB_container">
    <menu-bar-element v-for="page in pageList" :pageData="page" :key="page.slug"/>
  </div>
</template>

<script>
import firestore from '@/firebase_firestore'
import { mapState } from 'vuex'
import MenuBarElement from '@/components/MenuBarElement'

export default {
  name: 'MenuBar',
  computed: mapState({
    pageList: state => state.globalContents.pageSettings
  }),
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
