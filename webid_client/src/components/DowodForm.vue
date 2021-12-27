<template>
  <v-form v-model="valid" ref="dowodForm" lazy-validation :readonly="readonly">
    <v-row class="d-flex" justify="center">
      <v-col cols="12" lg="9" xl="7">
        <v-row justify="center" class="mb-3">
          <v-card class="mb-5" justify="center" width="280" elevation="10">
            <auth-img :auth-src="face" width="280" height="360" />
          </v-card>
        </v-row>
        <v-row justify="center" class="mb-10">
          <v-col cols="12" md="6">
            <v-card max-width="650" class="mx-auto">
              <auth-img :auth-src="front" max-width="650" />
            </v-card>
          </v-col>
          <v-col cols="12" md="6" align-self="center">
            <v-card max-width="650" class="mx-auto">
              <auth-img :auth-src="back" />
            </v-card>
          </v-col>
        </v-row>

        <v-card-title class="pl-0">Przód:</v-card-title>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              color="green"
              v-model="dowod.names"
              :counter="100"
              :rules="rules.namesRules"
              label="Imiona"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              color="green"
              v-model="dowod.surname"
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
              v-model="dowod.parentsNames"
              :counter="100"
              :rules="rules.parentsNamesRules"
              label="Imiona rodziców"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              color="green"
              v-model="dowod.familyName"
              :counter="100"
              :rules="rules.familyNameRules"
              label="Nazwisko rodowe"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              color="green"
              v-model="dowod.birthDate"
              :rules="rules.birthDateRules"
              label="Data urodzenia"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              color="green"
              v-model="dowod.sex"
              v-mask="'A'"
              :counter="1"
              :rules="rules.sexRules"
              label="Płeć"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-card-title class="pl-0">Tył:</v-card-title>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              color="green"
              v-model="dowod.pesel"
              v-mask="'###########'"
              :counter="11"
              :rules="rules.peselRules"
              label="Pesel"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              color="green"
              v-model="dowod.id"
              v-mask="'AAA ######'"
              :counter="100"
              :rules="rules.idRules"
              label="Seria, numer dowodu"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              color="green"
              v-model="dowod.nationality"
              :counter="100"
              :rules="rules.nationalityRules"
              label="Obywatelstwo"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              color="green"
              v-model="dowod.birthPlace"
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
              v-model="dowod.issuingAuthority"
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
              v-model="dowod.issueDate"
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
              v-model="dowod.expiryDate"
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
              @click="saveDowod"
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
import AuthImg from "./AuthImg"

export default {
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
      // nameRules: (v) => !!v || "Pole wymagane",
      rules: {
        namesRules: [],
        surnameRules: [],
        parentsNamesRules: [],
        birthDateRules: [],
        familyNameRules: [],
        sexRules: [],
        idRules: [],
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
      rulesList: {
        namesRules: {},
        surnameRules: {},
        parentsNamesRules: {},
        birthDateRules: {
          isAdults: (v) =>
            this.yearBetween(new Date(v)) >= 18 || "Musisz mieć 18 lat",
        },
        familyNameRules: {},
        sexRules: {
          sexCheck: (v) => /[KM]/.test(v) || "K - Kobieta M - Mężczyzna",
        },
        idRules: {
          controlCheck: (v) =>
            this.isValidSeriaDowodu(v) || "Nieprawidłowy numer dowodu",
        },
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
            !this.dowod.expiryDate ||
            new Date(v) < new Date(this.dowod.expiryDate) ||
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
    };
  },
  computed: {
    ...mapGetters(["getCurrentDowod", "getDowodRules"]),
  },
  async mounted() {
    try {
      await this.fetchDowodRules();
    } catch (error) {
      console.log(error);
    } finally {
      this.setRules();
    }
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
    ...mapActions(["updateDowod", "fetchDowod", "fetchDowodRules"]),
    async saveDowod() {
      if (this.$refs.dowodForm.validate()) {
        try {
          this.saveLoading = true;
          console.log("przed wysłaniem", this.id);
          await this.updateDowod({ dowod: this.dowod, id: this.id });
          this.$toast.success("Udało się zapisać dokument");
          if (this.$route.name === "documentView") {
            await this.fetchDowod(this.id);
          } else {
            this.$router.push({
              name: "documentView",
              params: { docID: this.id },
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
      return -1;
    },
    isValidSeriaDowodu(v) {
      const seriaDigits = v.toUpperCase().replace(/ /g, "");
      console.log("seriaTrim :", seriaDigits);
      let sum =
        (7 * this.getValueFromLetter(seriaDigits[0]) +
          3 * this.getValueFromLetter(seriaDigits[1]) +
          1 * this.getValueFromLetter(seriaDigits[2]) +
          7 * this.getValueFromLetter(seriaDigits[4]) +
          3 * this.getValueFromLetter(seriaDigits[5]) +
          1 * this.getValueFromLetter(seriaDigits[6]) +
          7 * this.getValueFromLetter(seriaDigits[7]) +
          3 * this.getValueFromLetter(seriaDigits[8])) %
        10;
      return sum === this.getValueFromLetter(seriaDigits[3]);
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
    setRules() {
      this.rules = this.getDowodRules
        ? {
            namesRules: [
              this.generalRules.required,
              this.generalRules.onlyLetters,
            ],
            surnameRules: [
              this.generalRules.required,
              this.generalRules.onlyLetters,
            ],
            parentsNamesRules: [
              this.generalRules.required,
              this.generalRules.onlyLetters,
            ],
            birthDateRules: this.getDowodRules.isAdultsOnly
              ? [
                  this.generalRules.required,
                  this.generalRules.isInFuture,
                  this.rulesList.birthDateRules.isAdults,
                ]
              : [this.generalRules.required, this.generalRules.isInFuture],
            familyNameRules: [
              this.generalRules.required,
              this.generalRules.onlyLetters,
            ],
            sexRules: [
              this.generalRules.required,
              this.rulesList.sexRules.sexCheck,
            ],
            idRules: this.getDowodRules.isIDControl
              ? [
                  this.generalRules.required,
                  this.rulesList.idRules.controlCheck,
                ]
              : [this.generalRules.required],
            peselRules: this.getDowodRules.isPeselControl
              ? [
                  this.generalRules.required,
                  this.rulesList.peselRules.lengthCheck,
                  this.rulesList.peselRules.dateCheck,
                  this.rulesList.peselRules.controlCheck,
                ]
              : [
                  this.generalRules.required,
                  this.rulesList.peselRules.lengthCheck,
                  this.rulesList.peselRules.dateCheck,
                ],
            nationalityRules: [
              this.generalRules.required,
              this.generalRules.onlyLetters,
            ],
            birthPlaceRules: [
              this.generalRules.required,
              this.generalRules.onlyLetters,
            ],
            issueDateRules: this.getDowodRules.isIssueDateCorrect
              ? [
                  this.generalRules.required,
                  this.generalRules.isDate,
                  this.rulesList.issueDateRules.isBeforeExpiry,
                  this.rulesList.issueDateRules.isInBuissnesDay,
                  this.generalRules.isInFuture,
                ]
              : [this.generalRules.required, this.generalRules.isDate],
            issuingAuthorityRules: [this.generalRules.required],
            expiryDateRules: this.getDowodRules.isNotExpired
              ? [
                  this.generalRules.required,
                  this.generalRules.isDate,
                  this.rulesList.expiryDateRules.expiryCheck,
                ]
              : [this.generalRules.required, this.generalRules.isDate],
          }
        : {
            namesRules: [
              this.generalRules.required,
              this.generalRules.onlyLetters,
            ],
            surnameRules: [
              this.generalRules.required,
              this.generalRules.onlyLetters,
            ],
            parentsNamesRules: [
              this.generalRules.required,
              this.generalRules.onlyLetters,
            ],
            birthDateRules: [
              this.generalRules.required,
              this.generalRules.isInFuture,
              this.rulesList.birthDateRules.isAdults,
            ],
            familyNameRules: [
              this.generalRules.required,
              this.generalRules.onlyLetters,
            ],
            sexRules: [
              this.generalRules.required,
              this.rulesList.sexRules.sexCheck,
            ],
            idRules: [
              this.generalRules.required,
              this.rulesList.idRules.controlCheck,
            ],
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
