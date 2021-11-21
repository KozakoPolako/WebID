<template>
  <v-form>
    <v-row class="d-flex" justify="center">
      <v-col cols="12" lg="9" xl="7">
        <v-row justify="center" class="mb-10">
          <v-card class="mb-5" justify="center" width="280" elevation="10">
            <v-img :src="face" width="280" height="360"> </v-img>
          </v-card>
        </v-row>

        <v-card-title class="pl-0">Przód:</v-card-title>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="dowod.names"
              :counter="100"
              :rules="nameRules"
              label="Imiona"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="dowod.surname"
              :counter="100"
              :rules="nameRules"
              label="Nazwisko"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="dowod.parentsNames"
              :counter="100"
              :rules="nameRules"
              label="Imiona rodziców"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="dowod.surname"
              :counter="100"
              :rules="nameRules"
              label="Nazwisko rodowe"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="dowod.birthdate"
              :rules="nameRules"
              label="Data urodzenia"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="dowod.sex"
              :counter="1"
              :rules="nameRules"
              label="Płeć"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-card-title class="pl-0">Tył:</v-card-title>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="dowod.pesel"
              :counter="100"
              :rules="nameRules"
              label="Pesel"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="dowod.id"
              :counter="100"
              :rules="nameRules"
              label="Seria,numer dowodu"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="dowod.nationality"
              :counter="100"
              :rules="nameRules"
              label="Obywatelstwo"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="dowod.birthplace"
              :counter="100"
              :rules="nameRules"
              label="Miejsce urodzenia"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="dowod.issuingAuthority"
              :counter="100"
              :rules="nameRules"
              label="Organ wydający"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="dowod.issueDate"
              :counter="100"
              :rules="nameRules"
              label="Data Wydania"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="dowod.expiryDate"
              :counter="100"
              :rules="nameRules"
              label="Termin Ważności"
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      dowod: {
        names: "",
        surname: "",
        parentsNames: "",
        birthDate: "",
        familyName: "",
        sex: "",
        id: "",
        pesel: "",
        nationality: "",
        birthPlace: "",
        issueDate: "",
        issuingAuthority: "",
        expiryDate: "",
      },
      face: "",
    };
  },
  computed: {
    ...mapGetters(["getRecognisedDowod"]),
  },
  watch: {
    getRecognisedDowod: {
      handler() {
        console.log("jestem");
        this.dowod = this.getRecognisedDowod.dowod;
        this.face = this.getRecognisedDowod.faceURL;
      },
    },
  },
  updated() {
    console.log(this.getRecognisedDowod);
    console.log("dowod", this.dowod);
  },
};
</script>

<style></style>
