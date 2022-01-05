<template>
  <v-form class="pt-1">
    <v-checkbox
      v-model="paszportValidationRules.isNotExpired"
      label="Tylko Paszporty, które nie utraciły ważności"
      :color="color"
    ></v-checkbox>
    <v-checkbox
      v-model="paszportValidationRules.isIssueDateCorrect"
      label="Czy data wydania jest prawidłowa (czy dokument został wydany w dzień roboczy)"
      :color="color"
    ></v-checkbox>
    <v-checkbox
      v-model="paszportValidationRules.isPeselControl"
      label="Czy numer Pesel jest prawidłowy? (cyfry kontrolne)"
      :color="color"
    ></v-checkbox>
    <v-checkbox
      v-model="paszportValidationRules.isIDControl"
      label="Czy numer/seria Paszportu są prawidłowa? (cyfry kontrolne)"
      :color="color"
    ></v-checkbox>
    <v-checkbox
      v-model="paszportValidationRules.isMRZContol"
      label="Czy sekcja MRZ jest prawidłowa? (cyfry kontrolne)"
      :color="color"
    ></v-checkbox>
    <v-checkbox
      v-model="paszportValidationRules.isAdultsOnly"
      label="Tylko osoby pełnoletnie"
      :color="color"
    ></v-checkbox>
    <v-checkbox
      v-model="paszportValidationRules.isData_MRZValid"
      label="Poprawność danych z sekcja MRZ"
      :color="color"
    ></v-checkbox>

    <v-row class="pa-4" justify="end">
      <v-col cols="12" lg="auto">
        <v-btn
          outlined
          color="green lighten-2"
          width="100%"
          :loading="saveLoading"
          @click="savePaszportRules"
        >
          Zapisz
          <v-icon class="ml-2 my-auto" size="18"> mdi-pencil-outline </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "PaszportValidationRules",
  props: {
    color: {
      type: String,
      default: "primary",
    },
  },
  data() {
    return {
      saveLoading: false,
      paszportValidationRules: {
        isNotExpired: false,
        isIssueDateCorrect: false,
        isPeselControl: false,
        isIDControl: false,
        isMRZContol: false,
        isAdultsOnly: false,
        isData_MRZValid: false,
      },
    };
  },
  computed: {
    ...mapGetters(["getPaszportRules"]),
  },
  watch: {
    getPaszportRules: {
      handler(val) {
        console.log("testyetet", val)
        if (!val && !("isNotExpired" in val)) return;
        console.log("test: ", this.paszportValidationRules)
        this.paszportValidationRules = Object.assign({}, val);
        console.log("test: ", this.paszportValidationRules);
      },
      deep: true,
    },
  },
  mounted() {
    this.paszportValidationRules = Object.assign({}, this.getPaszportRules);
    console.log("rules",this.paszportValidationRules) 
  },
  methods: {
    ...mapActions(["updatePaszportRules"]),

    async savePaszportRules() {
      try {
        this.saveLoading = true 
        await this.updatePaszportRules(this.paszportValidationRules);
        this.$toast.success("Zapisano ustawienia");
      } catch (error) {
        console.log(error);
        this.$toast.error("Nie udało się zapisać ustawień");
      } finally {
        this.saveLoading = false
      }
    },
  },
};
</script>

<style></style>