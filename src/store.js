import Vue from 'vue';
import Vuex from 'vuex';
import { get, put, reset } from './api';

Vue.use(Vuex);

/* eslint-disable no-param-reassign */
export default function createStore() {
  return new Vuex.Store({
    state: {
      polygons: null,
    },
    mutations: {
      polygons(s, p) {
        s.polygons = p;
      },
    },
    actions: {
      getPolygons({ commit }) {
        get()
          .then(p => commit('polygons', p))
          .catch(() => alert('Could not fetch polygons'));
      },
      setPolygons({ commit }, p) {
        put(p)
          .then(() => commit('polygons', p))
          .catch(() => alert('Could not store polygons'));
      },
      resetPolygons({ dispatch }) {
        reset()
          .then(() => dispatch('getPolygons'));
      },
    },
  });
}
