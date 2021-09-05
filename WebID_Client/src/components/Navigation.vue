<template>
  <nav class="overflow-hidden">
      <v-app-bar
      app
      scroll-target=""
      flat
      color="green lighten-2"
      outlined
      dense
      >
        <v-spacer />
        <v-btn
          outlined
        >
          click me</v-btn>
        <div  class="px-1"></div>
        <v-btn
          outlined
        >
          click me</v-btn>
        <v-spacer />
      </v-app-bar>
      <v-sheet
      if="scrolling-techniques-7"
      class="overflow-y-auto"
      ></v-sheet>
  </nav>
</template>

<script>
export default {

}
</script>

<style>

</style>
