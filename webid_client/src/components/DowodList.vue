<template>
  <v-container class="pa-6">
    <v-btn
      plain
      size="50"
      color="green"
      class="my-3 px-2 text-h6"
      @click="redirectToAddDowod"
    >
      Dodaj nowy dowód
      <v-icon size="30">mdi-plus</v-icon>
    </v-btn>
    <v-row>
      <v-col v-for="dowod in items" :key="dowod.id" cols="12" lg="3" sm="6">
        <v-card class="pa-0 rounded-lg green">
          <v-card-title class="py-1">Dowód: {{ dowod.fullName}} <br >Termin ważności: {{ new Date(dowod.expairyDate).toLocaleDateString()}} <br > Numer dokumentu: {{dowod.docID}}</v-card-title>
          <v-card-text
            class="white rounded-lg pa-2 ml-2 dowod-img"
            @click="redirectToDowod(dowod.id)"
          >
            <auth-img :auth-src="dowod.frontURL" class="rounded-lg"></auth-img>
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
  name: "DowodList",
  components: { AuthImg },
  data() {
    return {
      items: [],
    };
  },
  computed: {
    ...mapGetters(["getAllDowods"]),
  },
  watch: {
    getAllDowods: {
      handler() {
        this.items = this.getAllDowods;
      },
      deep: true,
    },
  },
  async mounted() {
    // const temp = {
    //   id: '61aa2f29a51ee64ba97b1c30',
    //   frontURL: 'http://localhost:3000/dokuments/pl/dowod/zdjecie/front/61aa2f29a51ee64ba97b1c30'
    // }
    // for(let i = 0; i < 23; i++) {
    //   this.items.push(temp)
    // }
    await this.fetchDowods();
  },
  methods: {
    ...mapActions(["fetchDowods"]),
    redirectToDowod(docID) {
      this.$router.push({
        name: "documentView",
        params: { docID: docID, docType: "dowod" },
      });
    },
    redirectToAddDowod() {
      this.$router.push({ name: "addDocument" });
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
