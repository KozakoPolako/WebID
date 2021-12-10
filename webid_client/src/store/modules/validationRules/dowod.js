// import axios from "axios";

// const resURI = "http://localhost:3000/api";

// export const rules = {
//   namesRules: [],
//   surnameRules: [],
//   parentsNamesRules: [],
//   birthDateRules: [],
//   familyNameRules: [],
//   sexRules: [],
//   idRules: [],
//   peselRules: [],
//   nationalityRules: [],
//   birthPlaceRules: [],
//   issueDateRules: [],
//   issuingAuthorityRules: [],
//   expiryDateRules: [],
// };
// const dowod = {
//   names: "",
//   surname: "",
//   parentsNames: "",
//   birthDate: "",
//   familyName: "",
//   sex: "",
//   id: "",
//   pesel: "",
//   nationality: "",
//   birthPlace: "",
//   issueDate: "",
//   issuingAuthority: "",
//   expiryDate: "",
// },

const state = {
  rules: {
    namesRules: [],
    surnameRules: [],
    parentsNamesRules: [],
    birthDateRules: [],
    familyNameRules: [],
    sexRules: [],
    idRules: [],
    peselRules: [
      (v) => !!v || "Pole wymagane",
      (v) => /^[0-9]{11}$/.test(v) || "Numer Pesel musi zawierać 11 cyfr",
      (v) => (parseInt(v.substring(4, 6)) <= 31 && parseInt(v.substring(2, 4)) <= 12) || "Nieprawidłowy numer Pesel Data", // sprawdzenie czy liczby zawiewierające rok urodzenia są poprawna datą
      (v) => {
        console.log(this.dowod.names)
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
        return parseInt(digits[10]) === checksum || "Nieprawidłowy numer Pesel"; // sprawdzenie sumy kontrolnej
      },
    ],
    nationalityRules: [],
    birthPlaceRules: [],
    issueDateRules: [],
    issuingAuthorityRules: [],
    expiryDateRules: [],
  },
};

const getters = {
  getDowodRules: (state) => state.rules,
};

const actions = {};
const mutations = {};

export default {
  state,
  actions,
  mutations,
  getters,
};
