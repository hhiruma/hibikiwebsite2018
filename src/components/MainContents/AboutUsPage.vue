<template>
  <div id="AboutUsContainer">
    <div v-if="pageLoaded">
      <div id="AboutUsDescContainer">
        <div id="AboutUsDescMenu">
          <div class="AboutUsDescMenuEl" v-for="pageContent in pageContents" :key="pageContent.order" @click="changeMenu(pageContent.order)">
            {{ pageContent.title }}
          </div>
        </div>
        <div id="AboutUsDesc">
          {{ pageContents.filter(el => el.order === selectedMenuOrder)[0].content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firestore from '@/firestore'
import { mapState } from 'vuex'

export default {
  name: 'AboutUsPage',
  data() {
    return {
      pageContents: [],
      pageContentsLen: 0,
      pageLoaded: false,
      selectedMenuOrder: ''
    }
  },
  methods: {
    changeMenu(order) {
      this.selectedMenuOrder = this.pageContents.filter(el => el.order === order)[0].order
    }
  },
  watch: {
    pageContentsLen(val) {
      if (val !== 0) {
        if (val === this.pageContents.length) {
          this.selectedMenuOrder = 0
          this.pageLoaded = true
        }
      }
    }
  },
  created: function() {
    firestore.collection('Contents/AboutUs/Descriptions').orderBy('order').get().then((querySnapshot)=>{
        querySnapshot.forEach((doc)=>{
            this.pageContents.push(doc.data())
        })
    })
    firestore.doc('Contents/AboutUs').get().then(doc => {
      this.pageContentsLen = doc.data().DescriptionsNum
    })
  }
}
</script>

<style scoped>
#AboutUsContainer {
  position: absolute;
  height: 100%;
  width: 100%;
}

#AboutUsDescContainer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

#AboutUsDescMenu {
  position: absolute;
  right: 0;
  top: 5%;
}

.AboutUsDescMenuEl {
  background-color: gray;
  right: 0;
  margin: 10px 0;
  cursor: pointer;
}

.AboutUsDescMenuEl:hover {
  background-color: white;
}

#AboutUsDesc {
  position: absolute;
  right: 20px;
  bottom: 50px;
  width: 50%;
  height: 35%;
  padding: 10px;
  background-color: gray;
  box-sizing: border-box;
}

</style>
