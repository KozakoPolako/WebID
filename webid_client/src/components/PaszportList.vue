<template>
  <v-container class="pa-6">
    <v-btn
      plain
      size="50"
      color="green"
      class="my-3 px-2 text-h6"
      @click="redirectToAddPassport"
    >
      Dodaj nowy Paszport
      <v-icon size="30">mdi-plus</v-icon>
    </v-btn>
    <v-row>
      <v-col
        v-for="passport in items"
        :key="passport.id"
        cols="12"
        lg="3"
        sm="6"
      >
        <v-card class="pa-0 rounded-lg green">
          <v-card-title class="py-1">Paszport:</v-card-title>
          <v-card-text
            class="white rounded-lg pa-2 ml-2 dowod-img"
            @click="redirectToPassport(passport.id)"
          >
            <auth-img
              :auth-src="passport.photoURL"
              class="rounded-lg"
            ></auth-img>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AuthImg from "./AuthImg";
export default {
  name: "PaszportList",
  components: { AuthImg },
  data() {
    return {
      items: [],
    };
  },
  computed: {
    ...mapGetters(["getAllPassports"]),
  },
  watch: {
    getAllPassports: {
      handler() {
        this.items = this.getAllPassports;
      },
      deep: true,
    },
  },
  async mounted() {
    await this.fetchPassports();
  },
  methods: {
    ...mapActions(["fetchPassports"]),
    redirectToPassport(docID) {
      this.$router.push({
        name: "documentView",
        params: { docID: docID, docType: "paszport" },
      });
    },
    redirectToAddPassport() {
      this.$router.push({
        name: "addDocument",
        params: { mode: "paszport" },
      });
    },
  },
};
</script>

<style scoped>
.dowod-img {
  box-shadow: -3px -5px 13px -5px rgba(66, 68, 90, 1);
  background-color: rgba(61, 90, 254, 0);
}
.dowod-img:hover {
  cursor: pointer;
  background-color: rgba(128, 255, 236, 0.85) !important;
  transform: scale(1.03, 1.03);
  transition: all 0.5s;
  overflow: visible;
}
</style>
