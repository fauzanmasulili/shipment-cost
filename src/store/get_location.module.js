//action type
export const GET_CITY = "getCity";
export const GET_SUBDISTRICT = "getSubdistrict";
export const GET_SUBDISTRICT_DESTINATION = "getSubdistrictDestination";
export const GET_LOCATION = "getLocation";

//mutation type
export const SET_CITY = "setCity";
export const SET_LOCATION = "setLocation";
export const SET_SUBDISTRICT = "setSubdistrict";
export const SET_SUBDISTRICT_DESTINATION = "setSubdistrictDestination";

const state = {
  city: [],
  location: [],
  subdistrict: [],
  subdistrict_destinatnion: []
};

const getters = {
  get_city(state) {
    return state.city;
  },

  get_subdistrict(state) {
    return state.subdistrict;
  },

  get_subdistrict_destination(state) {
    return state.subdistrict_destinatnion;
  }
};

const actions = {
  [GET_CITY](context) {
    fetch(process.env.VUE_APP_RAJA_ONGKIR_URL + `city`)
      .then((response) => response.json())
      .then((result) => {
        context.commit(SET_CITY, result.rajaongkir.results);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  [GET_SUBDISTRICT](context, payload) {
    fetch(process.env.VUE_APP_RAJA_ONGKIR_URL + `subdistrict/${payload}}`)
      .then((response) => response.json())
      .then((result) => {
        context.commit(SET_SUBDISTRICT, result.rajaongkir.results);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  [GET_SUBDISTRICT_DESTINATION](context, payload) {
    fetch(process.env.VUE_APP_RAJA_ONGKIR_URL + `subdistrict/${payload}}`)
      .then((response) => response.json())
      .then((result) => {
        context.commit(SET_SUBDISTRICT_DESTINATION, result.rajaongkir.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const mutations = {
  [SET_CITY](state, payload) {
    state.city = payload;
  },

  [SET_SUBDISTRICT](state, payload) {
    state.subdistrict = payload;
  },

  [SET_SUBDISTRICT_DESTINATION](state, payload) {
    state.subdistrict_destinatnion = payload;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
