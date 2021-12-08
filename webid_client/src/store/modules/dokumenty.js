/* eslint-disable */
import axios from "axios";
import FormData from "form-data";

const resURI = "http://localhost:3000";

const state = {
  dowod: {},
  allDowods: [],
};

const getters = {
  getCurrentDowod: (state) => state.dowod,
  getAllDowods: (state) => state.allDowods,
};

const actions = {
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
};
const mutations = {
  SET_DOWOD: (state, payload) => {
    state.dowod = payload.data;
  },
  SET_DOWODS: (state, payload) => {
    state.allDowods = "_embeded" in payload ? payload._embeded : [];
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
