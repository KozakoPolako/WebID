<template>
  <v-form>
    <v-row class="d-flex ">
      <v-col cols="12" md="8">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="name"
              :counter="100"
              :rules="nameRules"
              label="Imię"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="surname"
              :counter="100"
              :rules="nameRules"
              label="Nazwisko"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="pesel"
              :counter="100"
              :rules="nameRules"
              label="Pesel"
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="2">
        <v-card outlined height="100%">
          <v-icon
            size="110"
          >
             mdi-account
          </v-icon>
        </v-card>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-form>
</template>

<script>
export default {

}
</script>

<style>

</style>
