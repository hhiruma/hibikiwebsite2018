<template>
  <v-flex v-if="pageShow" id="MC_container">
    <template v-if="$store.state.userAgent === 'pc'">
      <component :is="$route.params.pageSlug"/>
    </template>
    <template v-else>
      <component :is="$route.params.pageSlug + '-sp'"/>
    </template>
  </v-flex>
</template>

<script>
import { mapGetters } from 'vuex'
import TopPage from '@/components/MainContents/TopPage.vue'
import TopPageSp from '@/components/MainContents/TopPageSp.vue'
import AboutUsPage from '@/components/MainContents/AboutUsPage'
import StagesPage from '@/components/MainContents/StagesPage'
import ContactsPage from '@/components/MainContents/ContactsPage.vue'
import NewComersPage from '@/components/MainContents/NewComersPage.vue'

export default {
  name: 'MainContainer',
  computed: mapGetters({
    pageShow: 'currentPageIfShow'
  }),
  components: {
    'top': TopPage,
    'top-sp': TopPageSp,
    'about-us': AboutUsPage,
    'stages': StagesPage,
    'contact': ContactsPage,
    'new-comers': NewComersPage
  }
}
</script>

<style scoped>
#MC_container {
    box-sizing: border-box;
    width: 100%;

    transition: all 0.4s ease;
    z-index: 1;
}
</style>
