<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="9" xl="7">
        <v-row dense justify="end" align="center">
          <v-col cols="auto">
            <h2>Dowod: {{ titleText }}</h2>
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <v-btn color="error" @click="removeDowod">Usuń</v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              v-show="!editMode"
              color="green lighten-2"
              @click="editMode = true"
              >Edytuj</v-btn
            >
            <v-btn
              v-show="editMode"
              color="green lighten-2"
              @click="editMode = false"
              >Anuluj</v-btn
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <div style="height: 150px"></div>
    <dowod-form :readonly.sync="readonly" />
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import DowodForm from "../components/DowodForm.vue";

export default {
  name: "EditDowod",
  components: { DowodForm },
  data() {
    return {
      titleText: "",
      editMode: false,
    };
  },
  computed: {
    ...mapGetters(["getCurrentDowod"]),
    readonly() {
      return !this.editMode;
    },
  },
  async mounted() {
    try {
      await this.fetchDowod(this.$route.params.docID);
      this.titleText = `${this.getCurrentDowod.dowod.names} ${this.getCurrentDowod.dowod.surname}`;
    } catch (error) {
      this.$toast.error("Nie udało się pobrać dokumentu");
    }
  },
  methods: {
    ...mapActions(["fetchDowod", "deleteDowod"]),
    test() {
      this.$toast.success("test");
    },
    async removeDowod() {
      try {
        await this.deleteDowod(this.$route.params.docID);
        this.$toast.success("Usunięto dokument");
        this.$router.push({ name: "documentsView" });
      } catch (error) {
        this.$toast.error("Nie udało się usunąć dokumentu");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.docEdit {
  background-color: lightgrey;
}
</style>
