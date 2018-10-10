<template>
  <div id="MC_container" :class="{MC_container_show: showContent, MC_container_hidden: !showContent}"></div>
</template>

<script>
import store from '@/store'

export default {
  name: 'Base',
  data () {
    return {
      showContent: store.state.showContent
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#MC_container {
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;

    height: 80%;
    box-sizing: border-box;
    border-radius: 15px;

    transition: all 0.4s ease;
}

.MC_container_show {
    top: 15%;
    left: 10%;
    width: 80%;
    opacity: 1.0;
}

.MC_container_hidden {
    top: 15%;
    left: 100%;
    width: 0%;
    opacity: 0;
}
</style>
