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
        }
    }
})