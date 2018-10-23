import firestore from '@/firestore'
import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        showContent: false,
        currentPageSlug: "",
        pageSettings: (()=>{
            let tmp = []
            firestore.collection("Settings/Pages/MainContentPages").orderBy("order").get().then((querySnapshot)=>{
                querySnapshot.forEach((doc)=>{
                    tmp.push(doc.data())
                })
            })
            return tmp
        })(),
        load: {
            isLoading: true,
            targets: [],
            targetsNum: 0
        },
        appSize: {
            appWidth: -1,
            appHeight: -1
        }
    },
    mutations: {
        addLoadTargets (state, target) {
            state.load.targets.push(target)
            state.load.targetsNum++
            state.load.isLoading = true
        },
        resetTargets (state){
            state.load.isLoading = false
            state.load.targetsNum = 0
        },
        setResizeVals (state, payload){
            if (payload.mode === "width"){
                state.appSize.appWidth = payload.val
            } else {
                state.appSize.appHeight = payload.val
            }
        },
        changePage (state, slug) {
            state.currentPageSlug = slug

            const nextPage = state.pageSettings.filter((el) => el.slug === slug)[0]
            router.push({
                path: nextPage.slug ? nextPage.slug : '/',
                params: {
                    pageTitle: nextPage.title,
                    pageShow: Boolean(nextPage.slug)
                }
            })
        },
        goToTop (state) {
            state.currentPageSlug = ''
            router.push({
                path: '/',
                params: {
                    pageTitle: 'トップ',
                    pageShow: false
                }
            })
        }
    },
    getters: {
        currentPageContent (state) {
            return state.pageSettings.filter(el => el.slug === state.currentPageSlug)
        },
        currentPageIfShow (state) {
            return state.pageSettings.filter(el => el.slug === state.currentPageSlug)[0] !== ''
        }
    }
})