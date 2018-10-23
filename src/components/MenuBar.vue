<template>
  <div id="MB_container">
    <menu-bar-element v-for="title in pageTitleList" :title="title" :key="title"/>
  </div>
</template>

<script>
import firestore from '@/firestore'
import MenuBarElement from '@/components/MenuBarElement'

export default {
  name: 'MenuBar',
  data () {
    return {
      currentPage: this.$store.state.currentPage,
      pageTitleList: this.$store.state.pageSettings.map((el)=> {return el.title}),
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
