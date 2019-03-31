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
import TopPage from '@/components/MainContents/TopPage'
import TopPageSp from '@/components/MainContents/TopPageSp'
import AboutUsPage from '@/components/MainContents/AboutUsPage'
import AboutUsPageSp from '@/components/MainContents/AboutUsPageSp'
import StagesPage from '@/components/MainContents/StagesPage'
import StagesPageSp from '@/components/MainContents/StagesPageSp'
import ContactsPage from '@/components/MainContents/ContactsPage'
import ContactsPageSp from '@/components/MainContents/ContactsPageSp'
import NewComersPage from '@/components/MainContents/NewComersPage'
import NewComersPageSp from '@/components/MainContents/NewComersPageSp'

export default {
  name: 'MainContainer',
  computed: mapGetters({
    pageShow: 'currentPageIfShow'
  }),
  components: {
    'top': TopPage,
    'top-sp': TopPageSp,
    'about-us': AboutUsPage,
    'about-us-sp': AboutUsPageSp,
    'stages': StagesPage,
    'stages-sp': StagesPageSp,
    'contact': ContactsPage,
    'contact-sp': ContactsPageSp,
    'new-comers': NewComersPage,
    'new-comers-sp': NewComersPageSp
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
