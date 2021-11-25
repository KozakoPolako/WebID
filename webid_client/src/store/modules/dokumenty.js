/* eslint-disable */
import axios from "axios";
import FormData from "form-data";

const resURI = "http://localhost:3000";

const state = {
  dowod: {},
};

const getters = {
  getRecognisedDowod: (state) => state.dowod,
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
    commit("RECOGNISE_DOWOD", response);
  },
};
const mutations = {
  RECOGNISE_DOWOD: (state, peyload) => {
    state.dowod = peyload.data;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
