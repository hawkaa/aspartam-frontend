import Vue from 'vue';
import Vuex from 'vuex';
import { get, put, reset } from './api';

Vue.use(Vuex);

/* eslint-disable no-param-reassign */
export default function createStore() {
  return new Vuex.Store({
    state: {
      polygons: null,
      error: null,
      loading: false,
    },
    mutations: {
      polygons(s, p) {
        s.polygons = p;
      },
      error(s, e) {
        s.error = e;
      },
    },
    actions: {
      getPolygons({ commit }) {
        commit('loading', true);
        get()
          .then(p => commit('polygons', p))
          .catch(() => commit('error', 'Could not fetch polygons'))
          .finally(commit('loading', false));
      },
      setPolygons({ commit }, p) {
        put(p)
          .then(() => commit('polygons', p))
          .catch(() => commit('error', 'Could not save polygons'))
          .finally(commit('loading', false));
      },
      resetPolygons({ commit, dispatch }) {
        commit('loading', true);
        reset()
          .then(() => dispatch('getPolygons'))
          .catch(() => commit('error', 'Could not reset polygons'))
          .finally(commit('loading', false));
      },
    },
  });
}
