import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        showContent: false,
        currentPageSlug: "",
        currentPageIfShow: false,
        globalContents: {
            pageSettings: {}
        },
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
        addToGlobalContents (state, payload) {
            state.globalContents[payload.name] = payload.content
        }
    },
    getters: {
        currentPageContent (state) {
            return state.globalContents.pageSettings.filter(el => el.slug === state.currentPageSlug)
        },
        currentPageIfShow (state) {
            return state.globalContents.pageSettings.filter(el => el.slug === state.currentPageSlug)[0] !== ''
        }
    }
})