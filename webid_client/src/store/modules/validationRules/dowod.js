import axios from "axios";

const resURI = "http://localhost:3000/api";

const state = {
  rules: {},
};

const getters = {
  getDowodRules: (state) => state.rules,
};

const actions = {
  async fetchDowodRules({ commit }) {
    const response = await axios.get(`${resURI}/ustawienia/walidacja/dowod`);
    commit("SET_DOWOD_RULES", response.data);
  },
  // eslint-disable-next-line no-unused-vars
  async updateDowodRules({ commit }, newRules ) {
    const payload = {
      isNotExpired: newRules.isNotExpired,
      isIssueDateCorrect: newRules.isIssueDateCorrect,
      isPeselControl: newRules.isPeselControl,
      isIDControl: newRules.isIDControl,
      isMRZContol: newRules.isMRZContol,
      isAdultsOnly: newRules.isAdultsOnly,
      isData_MRZValid: newRules.isData_MRZValid,
    };
    console.log("payload", payload , newRules);
    await axios.put(`${resURI}/ustawienia/walidacja/dowod`, payload);
  },
};
const mutations = {
  SET_DOWOD_RULES: (state, payload) => {
    state.rules = "rules" in payload ? {
      isNotExpired: payload.rules.isNotExpired ? true : false,
      isIssueDateCorrect: payload.rules.isIssueDateCorrect ? true : false,
      isPeselControl: payload.rules.isPeselControl ? true : false,
      isIDControl: payload.rules.isIDControl ? true : false,
      isMRZContol: payload.rules.isMRZContol ? true : false,
      isAdultsOnly: payload.rules.isAdultsOnly ? true : false,
      isData_MRZValid: payload.rules.isData_MRZValid ? true : false,
    } : null;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
