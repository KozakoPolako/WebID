<template>
  <v-app>
    <navbar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import navbar from "./components/Navigation.vue";

export default {
  name: "App",
  components: {
    navbar,
  },
  data: () => ({
    //
  }),
  // mounted() {
  //   console.log("kl:", this.$keycloak);
  // },
};
</script>
