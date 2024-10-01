import Vue from 'vue';
import Vuex from 'vuex';
import authStore from './modules/auth.js';
import appealsStore from './modules/appeals.js';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth: authStore,
    appeals: appealsStore,
  },
});

export default store;
