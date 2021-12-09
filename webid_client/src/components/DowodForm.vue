<template>
  <v-form v-model="valid" ref="dowodForm" lazy-validation :readonly="readonly">
    <v-row class="d-flex" justify="center">
      <v-col cols="12" lg="9" xl="7">
        <v-row justify="center" class="mb-3">
          <v-card class="mb-5" justify="center" width="280" elevation="10">
            <v-img :src="face" width="280" height="360" />
          </v-card>
        </v-row>
        <v-row justify="center" class="mb-10">
          <v-col cols="12" md="6">
            <v-card max-width="650" class="mx-auto">
              <v-img :src="front" max-width="650" />
            </v-card>
          </v-col>
          <v-col cols="12" md="6" align-self="center">
            <v-card max-width="650" class="mx-auto">
              <v-img :src="back" />
            </v-card>
          </v-col>
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
              v-model="dowod.birthDate"
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
              v-model="dowod.birthPlace"
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
    <v-row justify="center" class="my-8 mt-11">
      <v-col v-if="!readonly" cols="12" lg="9" xl="7">
        <v-row no-gutters>
          <v-spacer />
          <v-btn
            width="250"
            color="green lighten-2"
            class="white--text"
            @click="saveDowod"
            :loading="saveLoading"
            >Zapisz dokument
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      saveLoading: false,
      valid: false,
      id: "",
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
      front: "",
      back: "",
      nameRules: [(v) => !!v || "Pole wymagane"],
    };
  },
  computed: {
    ...mapGetters(["getCurrentDowod"]),
  },
  watch: {
    getCurrentDowod: {
      handler() {
        this.id = this.getCurrentDowod.id;
        this.dowod = Object.assign({}, this.getCurrentDowod.dowod);
        this.face = this.getCurrentDowod.faceURL;
        this.front = this.getCurrentDowod.frontURL;
        this.back = this.getCurrentDowod.backURL;
      },
    },
    readonly(newVal, oldVal) {
      if (oldVal === false && newVal === true) {
        this.dowod = Object.assign({}, this.getCurrentDowod.dowod);
      }
    },
  },
  methods: {
    ...mapActions([
      "updateDowod",
      "fetchDowod"
    ]),
    async saveDowod() {
      if (this.$refs.dowodForm.validate()) {
        try {
          this.saveLoading = true;
          console.log("przed wysłaniem", this.id);
          await this.updateDowod({ dowod: this.dowod, id: this.id });
          this.$toast.success("Udało się zapisać dokument");
          if (this.$route.name === "documentView") {
            await this.fetchDowod(this.id)
          } else {
            this.$router.push({
              name: "documentView",
              params: { docID: this.id },
            });
          }
        } catch (error) {
          console.log(error);
          this.$toast.error(`Error: ${error.data.message}`);
        } finally {
          this.saveLoading = false;
        }
      }
    },
  },
};
</script>

<style></style>
