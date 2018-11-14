<template>
  <div id="AboutUsContainer">
    <div v-if="!loader.isLoading">
      <div id="AboutUsDescContainer">
        <div id="AboutUsDescMenu">
          <div class="AboutUsDescMenuEl" v-for="pageContent in output.pageContents" :key="pageContent.order" @click="changeMenu(pageContent.order)">
            {{ pageContent.title }}
          </div>
        </div>
        <div id="AboutUsDesc">
          {{ output.pageContents.filter(el => el.order === selectedMenuOrder)[0].content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firestore from '@/firebase_firestore'
import { contentsLoader } from '@/utils'

export default {
  name: 'AboutUsPage',
  data() {
    return {
      selectedMenuOrder: 0,
      loader: {
        isLoading: true,
        targetParams: [],
      },
      output: {} //expect 'pageContents'
    }
  },
  methods: {
    changeMenu(order) {
      this.selectedMenuOrder = this.output.pageContents.filter(el => el.order === order)[0].order
    }
  },
  async created() {
    contentsLoader.addLoadTarget(this.loader, {
      name: 'pageContents',
      type: 'firestore',
      whichPath: 'collection',
      path: 'Contents/AboutUs/Descriptions',
      options: {
        order: {
          field: 'order',
          direction: 'asc'
        }
      }
    })

    this.output = await contentsLoader.startLoading(this.loader)
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
