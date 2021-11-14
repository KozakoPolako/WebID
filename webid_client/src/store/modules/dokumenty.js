/* eslint-disable */
import axios from "axios"
import FormData from 'form-data'

const resURI = 'http://localhost:3000'

const actions = {
    async uploadDowodToRecognize({commit}, dowod) {
        let data = new FormData();
        console.log(dowod);
        data.append('dowodImage', dowod[0], dowod[0].name);
        data.append('dowodImage', dowod[1], dowod[1].name);

        const response  = await axios.post(`${resURI}/dokuments/pl/dowod`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });
        commit("uploadDowod",response);
    }
}
const mutations = {
    uploadDowod: (response) => {
        return response;
    }
}

export default {
    actions,
    mutations
}