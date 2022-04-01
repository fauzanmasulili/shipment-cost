<template>
  <v-row class="pa-5">
    <v-col xs="12" sm="12" md="6" lg="6">
      <v-card class="pa-5">
        <div class="font-weight-bold mb-5">Shipment Cost</div>
        <div data-theme="light" id="rajaongkir-widget"></div>
        <v-row>
          <v-col cols="12" xs="12" sm="12" md="6" lg="6">
            <v-autocomplete
              @input="handleCityChange"
              persistent-hint
              v-model="selected_city"
              :loading="loading_city"
              :items="get_city"
              item-text="city_name"
              item-value="city_id"
              hint="Kabupaten Kota"
              outlined
              dense
              label="Asal"
              :search-input.sync="searchCity"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="6" lg="6">
            <v-autocomplete
              persistent-hint
              hint="Kecamatan"
              @input="handleChangeOriginDistrict"
              v-model="selected_district"
              :items="get_subdistrict"
              item-text="subdistrict_name"
              item-value="subdistrict_id"
              outlined
              dense
              label="Asal"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" xs="1" sm="12" md="6" lg="6">
            <v-autocomplete
              persistent-hint
              @input="handleDestinationCityChange"
              v-model="selected_destination_city"
              :items="get_city"
              item-text="city_name"
              item-value="city_id"
              hint="Kabupaten Kota"
              outlined
              dense
              label="Tujuan"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" xs="1" sm="12" md="6" lg="6">
            <v-autocomplete
              persistent-hint
              @input="handleDestinationSubdistrictChange"
              v-model="selected_destination_subdistrict"
              :items="get_subdistrict_destination"
              item-text="subdistrict_name"
              item-value="subdistrict_id"
              hint="Kecamatan"
              outlined
              dense
              label="Tujuan"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <table style="width: 100%">
          <tbody>
            <tr>
              <th class="text-left">Produk</th>
              <th class="text-left">Order</th>
              <th class="text-left px-2">Grams</th>
              <th class="text-left px-2">Harga</th>
            </tr>
            <tr v-for="(product, index) in products" :key="index">
              <td class="py-2">
                {{ product.name }}
              </td>
              <td class="py-2">
                <v-text-field
                  v-model.number="product.order"
                  class="mt-2"
                  @input="handleOrderChange(product.id)"
                  outlined
                  dense
                  hide-details
                ></v-text-field>
              </td>
              <td class="px-2">
                {{ product.new_weight ? product.new_weight : 0 }}
              </td>
              <td class="px-2">
                {{ product.new_price ? product.new_price : 0 | toCurrency }}
              </td>
            </tr>
          </tbody>
        </table>
        <v-row>
          <v-col xs="6" sm="6" md="6" lg="6">
            <v-text-field
              v-model.number="package_weight"
              class="mt-2"
              outlined
              dense
              hide-details
              label="Package"
              suffix="gram"
            ></v-text-field>
          </v-col>
          <v-col xs="6" sm="6" md="6" lg="6">
            <v-select
              v-model="selected_courier"
              :items="courier"
              item-text="courier"
              item-value="courier"
              class="mt-2"
              label="Kurir"
              outlined
              multiple
              dense
              hide-details
            ></v-select>
          </v-col>
        </v-row>
        <v-btn @click="handleCheckShipment" class="mt-5 primary" width="100%"
          >Cek Ongkir</v-btn
        >
      </v-card>
    </v-col>
    <v-col v-show="show_cost" xs="12" sm="12" md="6" lg="6">
      <v-card height="100%" class="pa-5">
        <v-row v-for="item in cost" :key="item.id">
          <v-col xs="12" sm="12" md="12" lg="12">
            <b> {{ item.name }}, {{ total_product | toCurrency }} </b>
            <div class="mt-5" v-for="data in item.costs" :key="data.id">
              <v-row>
                <v-col xs="6" sm="6" md="3" lg="3">
                  <div>{{ data.service }}</div>
                  <small>{{ data.description }}</small>
                </v-col>
                <v-col xs="3" sm="3" md="3" lg="3">
                  <div v-for="list in data.cost" :key="list.id">
                    <div><b>ETD</b></div>
                    <small>{{ list.etd }} hari</small>
                  </div>
                </v-col>
                <v-col xs="2" sm="2" md="3" lg="3">
                  <div v-for="list in data.cost" :key="list.id">
                    <div><b>Total</b></div>
                    <small>{{ list.value | toCurrency }}</small>
                    <br />
                    <small>Total barang + ongkir:</small>
                    <br />
                    <small>{{
                      (list.value + total_product) | toCurrency
                    }}</small>
                  </div>
                </v-col>
                <v-col xs="1" sm="1" md="3" lg="3">
                  <div>
                    <div><b>Berat</b></div>
                    <small>{{ total_weight }} gram</small>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {
  GET_CITY,
  GET_SUBDISTRICT,
  GET_SUBDISTRICT_DESTINATION
} from "../store/get_location.module";

export default {
  name: "ShipmentCost",

  data: () => ({
    selected_courier: null,
    products: [
      {
        id: 0,
        name: "",
        price: 0,
        weight: 0,
        order: 0,
        new_price: 0,
        new_weight: 0
      }
    ],
    show_cost: false,
    searchCity: null,
    loading_city: false,
    selected_city: null,
    selected_destination_city: null,
    selected_destination_subdistrict: null,
    items: [],
    package_weight: 0,
    origin_type: null,
    destination_type: null,
    selected_district: null,
    courier: [
      "jne",
      "pos",
      "tiki",
      "rpx",
      "pandu",
      "wahana",
      "sicepat",
      "jnt",
      "pahala",
      "sap",
      "jet",
      "indah",
      "dse",
      "slis",
      "first",
      "ncs",
      "star",
      "ninja",
      "lion",
      "idl",
      "rex",
      "ide",
      "sentral",
      "anteraja"
    ],
    cost: [],
    total_weight: 0,
    kurir: "",
    total_product: 0
  }),

  filters: {
    toCurrency: function (value) {
      if (typeof value !== "number") {
        return value;
      }
      var formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
      });
      return formatter.format(value);
    }
  },

  watch: {
    searchCity(val) {
      val && val !== this.selected_city && this.querySelections(val);
    }
  },

  computed: {
    get_city: function () {
      return this.$store.getters.get_city;
    },

    get_subdistrict: function () {
      return this.$store.getters.get_subdistrict;
    },

    get_subdistrict_destination: function () {
      return this.$store.getters.get_subdistrict_destination;
    }
  },

  mounted() {
    fetch(process.env.VUE_APP_API_URL)
      .then((response) => response.json())
      .then((result) => {
        this.products = result;
      })
      .catch((err) => {
        console.log(err);
      });

    this.initialize();
  },

  methods: {
    initialize() {
      this.$store.dispatch(GET_CITY);
    },

    handleOrderChange(value) {
      const item = this.products.find((item) => item.id === value);
      item.new_weight = item.weight * item.order;
      item.new_price = item.order * item.price;
    },

    querySelections(v) {
      console.log(v);
      this.loading_city = true;
      // Simulated ajax query
      setTimeout(() => {
        this.items = this.get_city.filter((e) => e.city_name === v);
        this.loading_city = false;
      }, 500);
    },

    handleCityChange() {
      this.origin_type = "city";

      this.$store.dispatch(GET_SUBDISTRICT, this.selected_city);
    },

    handleChangeOriginDistrict() {
      this.origin_type = "subdistrict";
    },

    handleDestinationCityChange() {
      this.destination_type = "city";

      this.$store.dispatch(
        GET_SUBDISTRICT_DESTINATION,
        this.selected_destination_city
      );
    },

    handleDestinationSubdistrictChange() {
      this.destination_type = "subdistrict";
    },

    handleCheckShipment() {
      let total_weight = this.products
        .map((item) => item.new_weight)
        .reduce((a, b) => a + b);

      this.total_product = this.products
        .map((item) => item.new_price)
        .reduce((a, b) => a + b);

      this.total_weight = this.package_weight + total_weight;

      this.kurir = this.selected_courier.join(":");

      console.log(this.kurir);

      const data = {
        origin:
          this.selected_district !== null
            ? this.selected_district
            : this.selected_city,
        originType: this.origin_type,
        destination:
          this.selected_destination_subdistrict !== null
            ? this.selected_destination_subdistrict
            : this.selected_destination_city,
        destinationType: this.destination_type,
        weight: this.total_weight,
        courier: this.kurir
      };
      console.log(data);

      fetch(process.env.VUE_APP_RAJA_ONGKIR_URL + `ongkir/dimensi=no`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          this.cost = result.rajaongkir.results;
          this.show_cost = true;
          console.log(this.products);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
table {
  border-collapse: collapse;
}

tr {
  border-bottom: 1px solid #eaeaea;
}
</style>
