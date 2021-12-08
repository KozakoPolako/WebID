<template>
  <v-container class="pa-0">
    <v-tabs v-model="selTab" color="green" centered>
      <v-tab v-for="(tab, i) in tabs" :key="i">
        {{ tab }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="selTab">
      <v-tab-item v-for="(tab, i) in tabs" :key="i">
        <paszport-list v-if="i"></paszport-list>
        <dowod-list v-else></dowod-list>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import DowodList from "../components/DowodList.vue";
import PaszportList from "../components/PaszportList.vue";

export default {
  name: "DocumentsView",
  components: { DowodList, PaszportList },
  data() {
    return {
      tabs: ["Dowód osobisty", "Paszport"],
      selTab:null,
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style></style>
