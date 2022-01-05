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
          <v-col cols="12" md="8" align-self="center">
            <v-card max-width="650" class="mx-auto">
              <auth-img :auth-src="photo" />
            </v-card>
          </v-col>
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
              type="date"
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
              v-mask="'XX #######'"
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
              type="date"
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
              type="date"
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
      rulesList: {
        namesRules: {},
        surnameRules: {},
        birthDateRules: {
          isAdults: (v) =>
            this.yearBetween(new Date(v)) >= 18 || "Musisz mieć 18 lat",
        },
        sexRules: {
          sexCheck: (v) => /[FM]/.test(v) || "F - Kobieta M - Mężczyzna",
        },
        idRules: {
          controlCheck: (v) => this.isValidNumerPaszportu(v) || "Nieprawidłowy numer Paszportu"
        },
        typeRules: {},
        codeRules: {},
        peselRules: {
          lengthCheck: (v) =>
            /^[0-9]{11}$/.test(v) || "Numer Pesel musi zawierać 11 cyfr",
          dateCheck: (v) =>
            (parseInt(v.substring(4, 6)) <= 31 &&
              parseInt(v.substring(2, 4)) <= 12) ||
            "Nieprawidłowy numer Pesel", // sprawdzenie czy liczby zawiewierające rok urodzenia są poprawna datą
          controlCheck: (v) => {
            const digits = ("" + v).split("");
            let checksum =
              (1 * parseInt(digits[0]) +
                3 * parseInt(digits[1]) +
                7 * parseInt(digits[2]) +
                9 * parseInt(digits[3]) +
                1 * parseInt(digits[4]) +
                3 * parseInt(digits[5]) +
                7 * parseInt(digits[6]) +
                9 * parseInt(digits[7]) +
                1 * parseInt(digits[8]) +
                3 * parseInt(digits[9])) %
              10;
            if (checksum == 0) {
              checksum = 10;
            }
            checksum = 10 - checksum;
            return (
              parseInt(digits[10]) === checksum || "Nieprawidłowy numer Pesel"
            ); // sprawdzenie sumy kontrolnej
          },
        },
        nationalityRules: {},
        birthPlaceRules: {},
        issueDateRules: {
          isInBuissnesDay: (v) =>
            new Date(v).getDay() % 6 !== 0 ||
            "Dokument nie mógł zostać wydany w sobotę ani w niedzielę",
          isBeforeExpiry: (v) =>
            !this.passport.expiryDate ||
            new Date(v) < new Date(this.passport.expiryDate) ||
            "Data wydania nie może być późniejsza niż termin ważności",
        },
        issuingAuthorityRules: {},
        expiryDateRules: {
          expiryCheck: (v) => {
            return (
              new Date(v).setHours(0, 0, 0, 0) >=
                new Date().setHours(0, 0, 0, 0) ||
              "Data ważności dokumentu wygasła"
            );
          },
        },
      },
      generalRules: {
        required: (v) => !!v || "Pole wymagane",
        isDate: (v) =>
          // eslint-disable-next-line
          /^\d{4}(\-)(((0)[0-9])|((1)[0-2]))(\-)([0-2][0-9]|(3)[0-1])$/.test(
            v
          ) || "Wprowadź datę w formacie dd.mm.rrrr",
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
  async mounted() {
    try {
      console.log("TODO");
    } catch (e) {
      console.log(e);
    } finally {
      this.setRules();
    }
  },
  updated() {
    console.log(this.passport.birthDate);
  },
  methods: {
    ...mapActions(["updatePassport", "fetchPassport"]), //...mapActions(["updateDowod", "fetchDowod", "fetchDowodRules"]),
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
              params: { docID: this.id, docType: "paszport" },
            });
          }
        } catch (error) {
          const errorText = [error.response.data.message];
          if (error.response.status === 406) {
            errorText.push(...error.response.data.errors);
          }
          console.log(errorText);
          this.$toast.error(`${errorText.join("\n")}`);
        } finally {
          this.saveLoading = false;
        }
      }
    },
    yearBetween(oldDate) {
      const today = new Date();

      const yToday = today.getFullYear();
      const mToday = today.getMonth();
      const dToday = today.getDate();

      const yOld = oldDate.getFullYear();
      const mOld = oldDate.getMonth();
      const dOld = oldDate.getDate();

      let years = yToday - yOld;
      if (mOld > mToday) years--;
      else {
        if (mOld == mToday) {
          if (dOld > dToday) years--;
        }
      }
      return years;
    },
    getValueFromLetter(letter) {
      const values = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ];
      for (let i = 0; i < values.length; i++) {
        if (letter === values[i]) {
          return i;
        }
      }
      if (letter === "<") return 0
      return -1;
    },
    isValidNumerPaszportu(v) {
      const numerDigits = v.toUpperCase().replace(/ /g, "");
      let sum =
        (7 * this.getValueFromLetter(numerDigits[0]) +
          3 * this.getValueFromLetter(numerDigits[1]) +
          // 1 * this.getValueFromLetter(numerDigits[2]) +
          1 * this.getValueFromLetter(numerDigits[3]) +
          7 * this.getValueFromLetter(numerDigits[4]) +
          3 * this.getValueFromLetter(numerDigits[5]) +
          1 * this.getValueFromLetter(numerDigits[6]) +
          7 * this.getValueFromLetter(numerDigits[7]) +
          3 * this.getValueFromLetter(numerDigits[8])) %
        10;
      return sum === this.getValueFromLetter(numerDigits[2]);
    },
    setRules() {
      this.rules = {
        namesRules: [this.generalRules.required, this.generalRules.onlyLetters],
        surnameRules: [
          this.generalRules.required,
          this.generalRules.onlyLetters,
        ],
        birthDateRules: [
          this.generalRules.required,
          this.generalRules.isDate,
          this.generalRules.isInFuture,
          this.rulesList.birthDateRules.isAdults,
        ],
        sexRules: [
          this.generalRules.required,
          this.rulesList.sexRules.sexCheck,
        ],
        idRules: [this.generalRules.required, this.rulesList.idRules.controlCheck],
        typeRules: [this.generalRules.required],
        codeRules: [this.generalRules.required],
        peselRules: [
          this.generalRules.required,
          this.rulesList.peselRules.lengthCheck,
          this.rulesList.peselRules.dateCheck,
          this.rulesList.peselRules.controlCheck,
        ],
        nationalityRules: [
          this.generalRules.required,
          this.generalRules.onlyLetters,
        ],
        birthPlaceRules: [
          this.generalRules.required,
          this.generalRules.onlyLetters,
        ],
        issueDateRules: [
          this.generalRules.required,
          this.generalRules.isDate,
          this.rulesList.issueDateRules.isBeforeExpiry,
          this.rulesList.issueDateRules.isInBuissnesDay,
          this.generalRules.isInFuture,
        ],
        issuingAuthorityRules: [this.generalRules.required],
        expiryDateRules: [
          this.generalRules.required,
          this.generalRules.isDate,
          this.rulesList.expiryDateRules.expiryCheck,
        ],
      };
    },
  },
};
</script>

<style></style>
