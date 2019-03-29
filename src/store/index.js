import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        showContent: false,
        currentPageSlug: "",
        nextPageSlug: "",
        currentPageIfShow: false,
        transitionState: "wait",
        editMode: false,
        globalContents: {},  //expects 'pageSettings', 'masterUserId'
        appSize: {
            appWidth: -1,
            appHeight: -1
        },
        newComersPublicity: false,
        userAgent: ''
    },
    mutations: {
        setUserAgent (state, userAgent) {
          state.userAgent = userAgent
        },
        setNewComersPublicity (state, publicity) {
          state.newComesPublicity = publicity
        },
        setEditMode (state, isEditMode) {
          state.editMode = isEditMode
          console.log(state.editMode)
        },
        setResizeVals (state, payload){
            if (payload.mode === "width"){
                state.appSize.appWidth = payload.val
            } else {
                state.appSize.appHeight = payload.val
            }
        },
        setTransitionState(state, str){
            state.transitionState = str
        },
        startTransition(state, slug) {
            state.nextPageSlug = slug
            state.transitionState = "in"
        },
        changePage (state) {
            state.currentPageSlug = state.nextPageSlug
            state.nextPageSlug = ""

            const nextPage = state.globalContents.pageSettings.filter((el) => el.slug === state.currentPageSlug)[0]
            router.push({
                path: nextPage.slug ? nextPage.slug : '/',
                params: {
                    pageSlug: nextPage.slug,
                    pageShow: Boolean(nextPage.slug)
                }
            })
        },
        goToTop (state) {
            state.currentPageSlug = 'top'
            router.push({
                path: '/top',
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
