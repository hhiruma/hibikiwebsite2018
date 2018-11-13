import firestore from '@/firebase_firestore'
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
        masterUserAddress: (async () => {
            return (await firestore.doc('Settings/Users').get()).data().MasterUserAddress
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
                    pageSlug: nextPage.slug,
                    pageShow: Boolean(nextPage.slug)
                }
            })
        },
        toggleMasterMode (state) {
            state.isMasterUser = true
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
        }
    },
    getters: {
        currentPageContent (state) {
            return state.pageSettings.filter(el => el.slug === state.currentPageSlug)
        },
        currentPageIfShow (state) {
            return state.pageSettings.filter(el => el.slug === state.currentPageSlug)[0] !== ''
        },
        isMasterUser: (state) => (currentUser) => {
            return state.masterUserAddress === currentUser
        }
    }
})