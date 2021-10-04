<template>
  <v-app>
    <v-app-bar
      v-if="$route.name !== 'document-view'"
      app
      flat
      absolute
      color="white"
    >
      <v-tabs centered>
        <v-tab nuxt exact to="/">home</v-tab>
        <v-tab nuxt to="/document">Invoice Generator</v-tab>
      </v-tabs>
    </v-app-bar>

    <v-main style="background-color: #f4f5fa">
      <Nuxt />
    </v-main>
  </v-app>
</template>
