import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        showContent: false,
        currentPageSlug: "",
        currentPageIfShow: false,
        globalContents: {},  //expects 'pageSettings', 'masterUserId'
        appSize: {
            appWidth: -1,
            appHeight: -1
        }
    },
    mutations: {
        setResizeVals (state, payload){
            if (payload.mode === "width"){
                state.appSize.appWidth = payload.val
            } else {
                state.appSize.appHeight = payload.val
            }
        },
        changePage (state, slug) {
            state.currentPageSlug = slug

            const nextPage = state.globalContents.pageSettings.filter((el) => el.slug === slug)[0]
            router.push({
                path: nextPage.slug ? nextPage.slug : '/',
                params: {
                    pageSlug: nextPage.slug,
                    pageShow: Boolean(nextPage.slug)
                }
            })
        },
        goToTop (state) {
            state.currentPageSlug = ''
            router.push({
                path: '/',
                params: {
                    pageSlug: '',
                    pageShow: false
                }
            })
        },
        goToLogin (state) {
            state.currentPageSlug = 'login'
            router.push({
                path: '/login',
                params: {
                    pageSlug: 'login',
                    pageShow: false
                }
            })
        },
        addToGlobalContents (state, payload) {
            Vue.set(state.globalContents, payload.name, payload.content)
        },
        setCurrentUserId (state) {
            state.globalContents.currentUserId = firebase.auth().currentUser.uid
        }
    },
    getters: {
        currentPageIfShow (state) {
            if (state.globalContents.pageSettings){
                const nextPage = state.globalContents.pageSettings.filter(el => el.slug === state.currentPageSlug)
                if (nextPage.length) {
                  return nextPage[0].slug !== '/'
                }
            } else {
                return false
            }
        },
        isMasterUser: (state) => {
            return state.globalContents.masterUserId === state.globalContents.currentUserId
        }
    }
})
