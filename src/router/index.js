import Vue from 'vue'
import Router from 'vue-router'
import MainContainer from '@/components/MainContainer'
import LoginPage from '@/components/LoginPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage
    },
    {
      path: '/:pageSlug',
      name: 'MainContainer',
      component: MainContainer
    }
  ]
})
