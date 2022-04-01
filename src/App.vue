<template>
  <v-app>
    <v-main>
      <v-app-bar elevation="4"> Kedas Beauty Cek Ongkir </v-app-bar>
      <ShipmentCost />
    </v-main>
  </v-app>
</template>

<script>
import ShipmentCost from "./components/ShipmentCost";

export default {
  name: "App",

  components: {
    ShipmentCost
  },

  data: () => ({
    //
  })
};
</script>
