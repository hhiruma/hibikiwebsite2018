<template>
  <div id="app" :style="{ 'background-image': 'url('+img_src+')'}">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      img_src: require('@/img/bg.jpg')
    }
  }
}
</script>

<style>
html, body {
  width: 100%;
  height: 100%;
  margin: 0px;

  min-width: 910px;
  min-height: 500px;
}

#app {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: none;
  background-position: center center;
}
</style>
