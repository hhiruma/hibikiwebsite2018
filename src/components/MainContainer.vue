<template>
  <div id="MC_container" :class="{MC_container_show: pageShow, MC_container_hidden: !pageShow}">
    <component :is="$route.params.pageSlug"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AboutUsPage from '@/components/MainContents/AboutUsPage'
import StagesPage from '@/components/MainContents/StagesPage'
import ContactsPage from '@/components/MainContents/ContactsPage.vue'

export default {
  name: 'MainContainer',
  computed: mapGetters({
    pageShow: 'currentPageIfShow'
  }),
  components: {
    'about-us': AboutUsPage,
    'stages': StagesPage,
    'contact': ContactsPage
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#MC_container {
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;

    height: 80%;
    box-sizing: border-box;
    border-radius: 15px;

    transition: all 0.4s ease;
}

.MC_container_show {
    top: 15%;
    left: 3%;
    width: 94%;
    opacity: 1.0;
}

.MC_container_hidden {
    top: 15%;
    left: 100%;
    width: 0%;
    opacity: 0;
}
</style>
