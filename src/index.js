import Vue from 'vue';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'leaflet/dist/leaflet.css';
import App from './App.vue';

Vue.use(VueMaterial);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
});
