import firestore from '@/firestore'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        showContent: false,
        currentPage: "トップ",
        pageContents: (()=>{
            let tmp = []
            firestore.collection("pageContents").orderBy("order").get().then((querySnapshot)=>{
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
        setCurrentPage (state, title){
            if (title === "") {
                console.error('Not a valid title')
                return
            }
            state.currentPage = title
        },
        addLoadTargets (state, target) {
            state.load.targets.push(target)
            state.load.targetsNum++
            state.load.isLoading = true
        },
        resetTargets (state){
            state.load.isLoading = false
            state.load.targetsNum = 0
            console.log("reset targest")
            console.log(state.load.isLoading)
        },
        setResizeVals (state, payload){
            if (payload.mode === "width"){
                state.appSize.appWidth = payload.val
            } else {
                state.appSize.appHeight = payload.val
            }
        }
    },
    getters: {
        currentPageContent (state) {
            return state.pageContents.filter(el => el.title === state.currentPage)
        },
        currentPageIfShow (state) {
            return Boolean(state.pageContents.filter(el => el.title === state.currentPage)[0].slug !== '')
        }
    }
})