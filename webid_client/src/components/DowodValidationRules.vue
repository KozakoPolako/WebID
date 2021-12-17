<template>
  <v-form class="pt-1">
    <v-checkbox
      v-model="dowodValidationRules.isNotExpired"
      label="Tylko dowody które nie utraciły ważności"
      :color="color"
    ></v-checkbox>
    <v-checkbox
      v-model="dowodValidationRules.isIssueDateCorrect"
      label="Czy data wydania jest prawidłowa (czy dokument został wydany w dzień roboczy)"
      :color="color"
    ></v-checkbox>
    <v-checkbox
      v-model="dowodValidationRules.isPeselControl"
      label="Czy numer Pesel jest prawidłowy? (cyfry kontrolne)"
      :color="color"
    ></v-checkbox>
    <v-checkbox
      v-model="dowodValidationRules.isIDControl"
      label="Czy numer/seria dowodu jest prawidłowa? (cyfry kontrolne)"
      :color="color"
    ></v-checkbox>
    <v-checkbox
      v-model="dowodValidationRules.isMRZContol"
      label="Czy sekcja MRZ jest prawidłowa? (cyfry kontrolne)"
      :color="color"
    ></v-checkbox>
    <v-checkbox
      v-model="dowodValidationRules.isAdultsOnly"
      label="Tylko osoby pełnoletnie"
      :color="color"
    ></v-checkbox>
    <v-checkbox
      v-model="dowodValidationRules.isData_MRZValid"
      label="Poprawność danych z sekcja MRZ"
      :color="color"
    ></v-checkbox>

    <v-row class="pa-4" justify="end">
      <v-col cols="12" lg="auto">
        <v-btn
          outlined
          color="green lighten-2"
          width="100%"
          :loading="dowodSaveLoading"
          @click="saveDowodRules"
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
  name: "DowodValidationRules",
  props: {
    color: {
      type: String,
      default: "primary",
    },
  },
  data() {
    return {
      dowodSaveLoading: false,
      dowodValidationRules: {
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
    ...mapGetters(["getDowodRules"]),
  },
  watch: {
    getDowodRules: {
      handler(val) {
        if (!val && !("isNotExpired" in val)) return;
        console.log("test: ", this.dowodValidationRules)
        this.dowodValidationRules = Object.assign({}, val);
        console.log("test: ", this.dowodValidationRules)
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions(["updateDowodRules"]),

    async saveDowodRules() {
      try {
        this.dowodSaveLoading = true 
        await this.updateDowodRules(this.dowodValidationRules);
        this.$toast.success("Zapisano ustawienia");
      } catch (error) {
        console.log(error);
        this.$toast.error("Nie udało się zapisać ustawień");
      } finally {
        this.dowodSaveLoading = false
      }
    },
  },
};
</script>

<style></style>
