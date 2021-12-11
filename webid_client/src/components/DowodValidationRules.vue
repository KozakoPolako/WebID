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
        <v-btn outlined color="green lighten-2" width="100%">
          Zapisz
          <v-icon class="ml-2 my-auto" size="18"> mdi-pencil-outline </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
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
};
</script>

<style></style>
