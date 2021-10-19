/* eslint-disable */
import axios from "axios"
import FormData from 'form-data'

const resURI = 'http://localhost:3000'

const actions = {
    async uploadDowodToRecognize({commit}, image) {
        let data = new FormData();
        data.append('dokumentImage',image, image.name);

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