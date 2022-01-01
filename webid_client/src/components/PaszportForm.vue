<template>
  <v-form
    v-model="valid"
    ref="passportForm"
    lazy-validation
    :readonly="readonly"
  >
    <v-row class="d-flex" justify="center">
      <v-col cols="12" lg="9" xl="7">
        <v-row justify="center" class="mb-3">
          <v-card class="mb-5" justify="center" width="280" elevation="10">
            <auth-img :auth-src="face" width="280" height="360" />
          </v-card>
        </v-row>
        <v-row justify="center" class="mb-10">
          <v-card class="mb-5" justify="center" width="280">
            <auth-img :auth-src="photo" />
          </v-card>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              color="green"
              v-model="passport.names"
              :counter="100"
              :rules="rules.namesRules"
              label="Imiona"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              color="green"
              v-model="passport.surname"
              :counter="100"
              :rules="rules.surnameRules"
              label="Nazwisko"
              required
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              color="green"
              v-model="passport.birthDate"
              :rules="rules.birthDateRules"
              label="Data urodzenia"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              color="green"
              v-model="passport.sex"
              v-mask="'A'"
              :counter="1"
              :rules="rules.sexRules"
              label="Płeć"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              color="green"
              v-model="passport.pesel"
              v-mask="'###########'"
              :counter="11"
              :rules="rules.peselRules"
              label="Pesel"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="8" md="4">
            <v-text-field
              color="green"
              v-model="passport.id"
              v-mask="'AA #######'"
              :counter="100"
              :rules="rules.idRules"
              label="Numer paszportu"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4" md="2">
            <v-text-field
              color="green"
              v-model="passport.type"
              :counter="10"
              :rules="rules.typeRules"
              label="Typ"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="10">
            <v-text-field
              color="green"
              v-model="passport.nationality"
              :counter="100"
              :rules="rules.nationalityRules"
              label="Obywatelstwo"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              color="green"
              v-model="passport.code"
              :counter="10"
              :rules="rules.codeRules"
              label="Kod"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              color="green"
              v-model="passport.birthPlace"
              :counter="100"
              :rules="rules.birthPlaceRules"
              label="Miejsce urodzenia"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              color="green"
              v-model="passport.issuingAuthority"
              :counter="100"
              :rules="rules.issuingAuthorityRules"
              label="Organ wydający"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              color="green"
              v-model="passport.issueDate"
              v-mask="'##.##.####'"
              :counter="10"
              :rules="rules.issueDateRules"
              label="Data Wydania"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              color="green"
              v-model="passport.expiryDate"
              v-mask="'##.##.####'"
              :counter="10"
              :rules="rules.expiryDateRules"
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
          <v-col cols="12" lg="auto">
            <v-btn
              width="100%"
              color="green lighten-2"
              class="white--text"
              @click="savePassport"
              :loading="saveLoading"
              outlined
            >
              Zapisz dokument
              <v-icon class="ml-2 my-auto" size="18">mdi-pencil-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AuthImg from "./AuthImg";

export default {
  name: "PaszportForm",
  components: { AuthImg },
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
      passport: {
        names: "",
        surname: "",
        birthDate: "",
        sex: "",
        id: "",
        type: "",
        code: "",
        pesel: "",
        nationality: "",
        birthPlace: "",
        issueDate: "",
        issuingAuthority: "",
        expiryDate: "",
      },
      face: "",
      photo: "",
      rules: {
        namesRules: [],
        surnameRules: [],
        birthDateRules: [],
        sexRules: [],
        idRules: [],
        typeRules: [],
        codeRules: [],
        peselRules: [],
        nationalityRules: [],
        birthPlaceRules: [],
        issueDateRules: [],
        issuingAuthorityRules: [],
        expiryDateRules: [],
      },
      generalRules: {
        required: (v) => !!v || "Pole wymagane",
        isDate: (v) =>
          /^(((0)[0-9])|((1)[0-2]))(\.)([0-2][0-9]|(3)[0-1])(\.)\d{4}$/.test(
            v
          ) || "Wprowadź datę w formacie mm.dd.rrrr",
        onlyLetters: (v) =>
          /^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ ]+$/.test(v) ||
          "Wprowadzono niedozwolone znaki",
        isInFuture: (v) =>
          new Date(v) < new Date() || "Data wydania nie może być z przyszłości",
      },
    };
  },
  computed: {
    ...mapGetters(["getCurrentPassport", "getPassportRules"]),
  },
  watch: {
    getCurrentPassport: {
      handler() {
        this.id = this.getCurrentPassport.id;
        this.passport = Object.assign({}, this.getCurrentPassport.passport);
        this.face = this.getCurrentPassport.faceURL;
        this.photo = this.getCurrentPassport.photoURL;
      },
      deep: true,
    },
    readonly(newVal, oldVal) {
      if (oldVal === false && newVal === true) {
        this.passport = Object.assign({}, this.getCurrentPassport.passport);
      }
    },
  },
  methods: {
    ...mapActions(["updatePassport", "fetchPassport",]), //...mapActions(["updateDowod", "fetchDowod", "fetchDowodRules"]),
    async savePassport() {
       if (this.$refs.passportForm.validate()) {
        try {
          this.saveLoading = true;
          console.log("przed wysłaniem", this.id);
          await this.updatePassport({ passport: this.passport, id: this.id });
          this.$toast.success("Udało się zapisać dokument");
          if (this.$route.name === "documentView") {
            await this.fetchPassport(this.id);
          } else {
            this.$router.push({
              name: "documentView",
              params: { docID: this.id, docType:"paszport" },
            });
          }
        } catch (error) {
          const errorText = [error.response.data.message];
          if (error.response.status === 406) {
            errorText.push(...error.response.data.errors);
          }
          console.log(errorText)
          this.$toast.error(`${errorText.join("\n")}`);
        } finally {
          this.saveLoading = false;
        }
      }
    },
  },
};
</script>

<style></style>
