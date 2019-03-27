<template>
  <!-- Menu -->
  <v-flex xs2 id="StagesMenuContainer">
    <v-navigation-drawer permanent aboslute dense style="background: rgba(255, 255, 255, 0.8)">
      <v-layout row>
        <v-subheader>MENU</v-subheader>
        <v-spacer/>
        <v-btn flat icon @click="$emit('slideOut')">
          <v-icon>close</v-icon>
        </v-btn>
      </v-layout>
      <v-divider/>
      <v-list-tile @click="moveToPage(constVal.TOP)" class="StagesMenuEl">
        <v-list-tile-avatar>
          <v-icon small>home</v-icon>
        </v-list-tile-avatar>
        トップ
      </v-list-tile>

      <v-divider/>

      <v-list-tile v-if="$store.state.editMode"
        @click="moveToPage(constVal.EDITOR)" class="StagesMenuEl">
        <v-list-tile-avatar>
          <v-icon small>edit</v-icon>
        </v-list-tile-avatar>
        編集
      </v-list-tile>

      <v-divider/>

      <v-list-tile v-if="$store.state.editMode"
        @click="moveToPage(constVal.NEWPOST)" class="StagesMenuEl">
        <v-list-tile-avatar>
          <v-icon small>add_to_queue</v-icon>
        </v-list-tile-avatar>
        新規投稿
      </v-list-tile>

      <v-divider/>

      <v-list-tile class="StagesMenuEl"
        v-for="yearGroup in yearGroups" :key="yearGroup"
        @click="moveToPage(constVal.MENU, Number(yearGroup))">
        <v-list-tile-avatar>
          <v-icon v-if="yearGroup === selectedYear">
            arrow_right
          </v-icon>
        </v-list-tile-avatar>
        {{ yearGroup }}年度
      </v-list-tile>
    </v-navigation-drawer>
  </v-flex>
</template>

<script>
export default {
  'name': 'StagesMenuContainer',
  'props': ['yearGroups', 'constVal', 'selectedYear'],
  methods: {
    moveToPage(pos, param=null) {
      this.$emit('moveToPage', pos, param)
    }
  }
}
</script>

<style scoped>
.StagesMenuEl {
  font-size: 0.8em;
}
.StagesMenuEl:hover {
  background-color: rgba(0, 0, 0, 0.1)
}

</style>
