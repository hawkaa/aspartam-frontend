import Vue from 'vue';
import VueMaterial from 'vue-material';

import 'vue-material/dist/vue-material.min.css';
import 'leaflet/dist/leaflet.css';

import App from './App.vue';
import createStore from './store';

Vue.use(VueMaterial);

const store = createStore();

/* load initial data */
store.dispatch('getPolygons');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});
