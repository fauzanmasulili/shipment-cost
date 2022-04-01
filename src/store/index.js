import Vue from "vue";
import Vuex from "vuex";
import location from "./get_location.module";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    location
  }
});
