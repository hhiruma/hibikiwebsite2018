<template>
  <v-flex id="MC_container" :class="{MC_container_show: pageShow, MC_container_hidden: !pageShow}">
    <component :is="$route.params.pageSlug"/>
  </v-flex>
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

<style scoped>
#MC_container {
    background-color: rgba(0, 0, 0, 0.5);

    box-sizing: border-box;
    padding: 30px;
    border-radius: 15px;
    min-height: 500px;
    width: 94%;
    margin-left: 3%;
    margin-right: 3%;
    margin-top: 30px;
    margin-bottom: 40px;

    transition: all 0.4s ease;
    z-index: 1;
}

.MC_container_show {
    opacity: 1.0;
}

.MC_container_hidden {
    opacity: 0;
}
</style>
