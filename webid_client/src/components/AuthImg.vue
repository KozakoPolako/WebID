<template>
  <v-img :src="imgSrc" v-bind="$attrs" ref="img"></v-img>
</template>

<script>
import axios from "axios";

export default {
  name: "AuthImg",
  props: {
    AuthSrc: String,
  },
  data() {
    return {
      imgSrc: "",
    };
  },
  watch: {
    AuthSrc(val) {
      if (val) {
        this.getImage()
      }
    }
  },
  mounted() {
    if (this.AuthSrc) {
      this.getImage()
    } 
  },
  methods: {
    async getImage() {
      try {
        const response = await axios.get(this.AuthSrc, {
          responseType: "blob",
        });
        
        const url = URL.createObjectURL(response.data);
        this.imgSrc = url
      } catch (e) {
        console.log(e)
      }

      // const blob =
    },
  },
};
</script>

<style></style>
