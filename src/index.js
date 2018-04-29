import Vue from 'vue';
import Vuex from 'vuex';
import VueMaterial from 'vue-material';
import VueResource from 'vue-resource';


import 'vue-material/dist/vue-material.min.css';
import 'leaflet/dist/leaflet.css';

import App from './App.vue';
import polygons from './polygons.json';

Vue.use(Vuex);
Vue.use(VueMaterial);
Vue.use(VueResource);

const api = Vue.resource('http://localhost:8081/api/');

/* eslint-disable no-new */
const store = new Vuex.Store({
  state: {
    polygons,
  },
  mutations: {
    polygons(s, p) {
      s.polygons = p;
    },
  },
  actions: {
    polygons({ commit }, p) {
      api.get();
      /* TODO: Sync with API */
      commit('polygons', p);
    },
  },
});

new Vue({
  el: '#app',
  store,
  render: h => h(App),
});
