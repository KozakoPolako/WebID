/* eslint-disable */
import axios from "axios";
import FormData from "form-data";

const resURI = "http://localhost:3000/api";

const state = {
  dowod: {},
  passport: {},

  allDowods: [],
  allPassports: [],
};

const getters = {
  getCurrentDowod: (state) => state.dowod,
  getAllDowods: (state) => state.allDowods,
  getCurrentPassport: (state) => state.passport,
  getAllPassports: (state) => state.allPassports,
};

const actions = {
  
  ////////////////////////////////////////////////////////////////////////////////////////
  //  Dowod
  ////////////////////////////////////////////////////////////////////////////////////////

  async uploadDowodToRecognize({ commit }, dowod) {
    let data = new FormData();
    console.log(dowod);
    data.append("dowodImage", dowod[0], dowod[0].name);
    data.append("dowodImage", dowod[1], dowod[1].name);

    const response = await axios.post(`${resURI}/dokuments/pl/dowod`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("responce :", response);
    commit("SET_DOWOD", response);
  },
  async updateDowod({ commit }, data) {
    const payload = {
      names: data.dowod.names,
      surname: data.dowod.surname,
      parentsNames: data.dowod.parentsNames,
      birthDate: data.dowod.birthDate,
      familyName: data.dowod.familyName,
      sex: data.dowod.sex,
      id: data.dowod.id,
      pesel: data.dowod.pesel,
      nationality: data.dowod.nationality,
      birthPlace: data.dowod.birthPlace,
      issueDate: data.dowod.issueDate,
      issuingAuthority: data.dowod.issuingAuthority,
      expiryDate: data.dowod.expiryDate,
      MRZ: data.dowod.MRZ,
    };
    const response = await axios.put(
      `${resURI}/dokuments/pl/dowod/${data.id}`,
      payload
    );
  },
  async fetchDowods({ commit }) {
    const response = await axios.get(`${resURI}/dokuments/pl/dowod`);
    commit("SET_DOWODS", response.data);
  },
  async fetchDowod({ commit }, id) {
    const response = await axios.get(`${resURI}/dokuments/pl/dowod/${id}`);
    commit("SET_DOWOD", response);
  },
  async deleteDowod({ commit }, id) {
    const response = await axios.delete(`${resURI}/dokuments/pl/dowod/${id}`);
  },

  ////////////////////////////////////////////////////////////////////////////////////////
  //  Paszport
  ////////////////////////////////////////////////////////////////////////////////////////

  async uploadPassportToRecognize({ commit }, passport) {
    let data = new FormData();
    console.log(passport);
    data.append("paszportImage", passport[0], passport[0].name);

    const response = await axios.post(`${resURI}/dokuments/pl/paszport`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("responce :", response);
    commit("SET_PASSPORT", response);
  },
  async updatePassport({ commit }, data) {
    const payload = {
      names: data.passport.names,
      surname: data.passport.surname,
      birthDate: data.passport.birthDate,
      sex: data.passport.sex,
      id: data.passport.id,
      type: data.passport.type,
      code: data.passport.code,
      pesel: data.passport.pesel,
      nationality: data.passport.nationality,
      birthPlace: data.passport.birthPlace,
      issueDate: data.passport.issueDate,
      issuingAuthority: data.passport.issuingAuthority,
      expiryDate: data.passport.expiryDate,
      MRZ: data.passport.MRZ,
    };
    const response = await axios.put(
      `${resURI}/dokuments/pl/paszport/${data.id}`,
      payload
    );
  },
  async fetchPassports({ commit }) {
    const response = await axios.get(`${resURI}/dokuments/pl/paszport`);
    commit("SET_PASSPORTS", response.data);
  },
  async fetchPassport({ commit }, id) {
    const response = await axios.get(`${resURI}/dokuments/pl/paszport/${id}`);
    commit("SET_PASSPORT", response);
  },
  async deletePassport({ commit }, id) {
    const response = await axios.delete(`${resURI}/dokuments/pl/paszport/${id}`);
  },
};
const mutations = {
  SET_DOWOD: (state, payload) => {
    state.dowod = payload.data;
  },
  SET_DOWODS: (state, payload) => {
    state.allDowods = "_embeded" in payload ? payload._embeded : [];
  },
  SET_PASSPORT: (state, payload) => {
    state.passport = payload.data;
  },
  SET_PASSPORTS: (state, payload) => {
    console.log(payload)
    state.allPassports = "_embeded" in payload ? payload._embeded : [];
    console.log(state.allPassports)
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
