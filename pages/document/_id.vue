<template>
  <v-app>
    <v-main style="background-color: #f4f5fa">
      <InvoiceGenerator />
    </v-main>
  </v-app>
</template>

<script>
import InvoiceGenerator from '~/components/InvoiceGenerator.vue'

export default {
  components: {
    InvoiceGenerator,
  }
}
</script>
