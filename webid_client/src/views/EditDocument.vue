<template>
  <v-container>
    <dowod-form />
  </v-container>
</template>

<script>

import { mapActions } from "vuex";
import DowodForm from "../components/DowodForm.vue";

export default {
  name:'EditDowod',
  components: { DowodForm },
  async mounted() {
    try {
      await this.fetchDowod(this.$route.params.docID)
    } catch (error) {
      this.$toast.error("Nie udało się pobrać dokumentu")
    }
  },
  methods: {
    ...mapActions([
      'fetchDowod'
    ]),
    test() {
      this.$toast.success("test")
    }
  }
}
</script>

<style>

</style>