<template>
  <v-btn flat v-if="pageData.slug === currentPageSlug">
    {{ pageData.title }}
  </v-btn>
  <v-btn flat v-else @click="changePage(pageData.slug)">
    {{ pageData.title }}
  </v-btn>
</template>

<script>
export default {
  name: 'MenuBarElement',
  props: ['pageData'],
  computed: {
    currentPageSlug() {
      return this.$store.state.currentPageSlug
    }
  },
  methods: {
    changePage(slug) {
      this.$store.commit('startTransition', slug)
    }
  }
}
</script>

<style scoped>
.MB_element {
  position: relative;
  color: white;
  flex-grow: 1;
  height: 1.5em;
  text-align: center;
  cursor: pointer;
  margin: 5px 10px;
}

/* Underline From Left */
.hvr-underline-from-left {
  display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px transparent;
  position: relative;
  overflow: hidden;
}
.hvr-underline-from-left:before {
  content: "";
  position: absolute;
  z-index: -1;
  left: 0;
  right: 100%;
  bottom: 0;
  background: white;
  height: 2px;
  -webkit-transition-property: right;
  transition-property: right;
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -webkit-transition-timing-function: ease-out;
  transition-timing-function: ease-out;
/* added */
  right: 0;
/*  */
}

/* Underline From Center */
.hvr-underline-from-center {
  display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px transparent;
  position: relative;
  overflow: hidden;
}
.hvr-underline-from-center:before {
  content: "";
  position: absolute;
  z-index: -1;
  left: 50%;
  right: 50%;
  bottom: 0;
  background: white;
  height: 2px;
  -webkit-transition-property: left, right;
  transition-property: left, right;
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -webkit-transition-timing-function: ease-out;
  transition-timing-function: ease-out;
}
.hvr-underline-from-center:hover:before, .hvr-underline-from-center:focus:before, .hvr-underline-from-center:active:before {
  left: 0;
  right: 0;
}
</style>
