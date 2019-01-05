<template>
  <background/>
</template>

<script>

import Background from '@/components/Background'

export default {
  name: 'TopPage',
  async created() {
    this.$store.commit('setTransitionState', 'out')
  },
  components: {
    'background': Background,
  }
}
</script>

<style scoped>
</style>
