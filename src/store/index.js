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

if (store.getters['auth/isAuthorized']) {
  store.dispatch('appeals/loadPremises');
} else {
  const unwatchAuth = store.watch((_state, getters) => getters['auth/isAuthorized'], (isAuthorized) => {
    if (isAuthorized) {
      store.dispatch('appeals/loadPremises');
      unwatchAuth();
    }
  });
}
