<template>
  <v-row justify="center">
    <v-col cols="12" lg="8">
      <v-tabs v-model="selTab" color="green" centered>
        <v-tab v-for="(tab, i) in tabs" :key="i">
          {{ tab }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="selTab">
        <v-tab-item v-for="(tab, i) in tabs" :key="i">
          <v-card
            outlined
            class="rounded-lg ma-3 pa-0 pt-0 green"
            elevation="3"
          >
            <v-card-title class="py-1">
              Reguły walidacji: {{ tabs[i] }}
            </v-card-title>
            <v-card-text class="ml-2 pl-6 pb-1 white rounded-lg dowod-img">
              <paszport-validation-rules color="green" v-show="i" />
              <dowod-validation-rules color="green" v-show="!i" />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-col>
  </v-row>
</template>

<script>
import DowodValidationRules from "../components/DowodValidationRules.vue";
import PaszportValidationRules from "../components/PaszportValidationRules.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  components: { DowodValidationRules, PaszportValidationRules },
  data() {
    return {
      tabs: ["Dowód osobisty", "Paszport"],
      selTab: null,
    };
  },
  computed: {
    ...mapGetters([]),
  },
  async mounted() {
    try {
      await this.fetchDowodRules()
    } catch (error) {
      console.log(error)
      this.$toast.error("Nie udało się pobrać reguł walidacji dowodu")
    }
    try {
      await this.fetchPaszportRules()
    } catch (error) {
      console.log(error)
      this.$toast.error("Nie udało się pobrać reguł walidacji paszportu")
    }

  },
  methods: {
    ...mapActions(["fetchDowodRules","fetchPaszportRules"]),
  },
};
</script>

<style>
.dowod-img {
  box-shadow: -3px -5px 13px -5px rgba(66, 68, 90, 1);
  background-color: rgba(61, 90, 254, 0);
}
</style>
