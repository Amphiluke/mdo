import {authorize, unauthorize} from '@/api/auth.js';
import {getCached, setCached} from '@/utils/local-cache.js';

export default {
  namespaced: true,

  state: () => ({
    userId: getCached('userId'),
    apiKey: getCached('apiKey'),
    failMessage: '',
  }),

  getters: {
    isAuthorized({userId, apiKey}) {
      return userId !== null && apiKey !== null;
    },
  },

  mutations: {
    resetAuth(state, {userId, apiKey} = {}) {
      state.userId = userId ?? null;
      state.apiKey = apiKey ?? null;
      setCached('userId', state.userId);
      setCached('apiKey', state.apiKey);
    },

    setFailMessage(state, message) {
      state.failMessage = message;
    },
  },

  actions: {
    async authorize({commit}, {username, password}) {
      try {
        commit('setFailMessage', '');
        const {userId, apiKey} = await authorize(username, password);
        commit('resetAuth', {userId, apiKey});
      } catch (e) {
        commit('setFailMessage', 'Неправильные данные');
        return Promise.reject();
      }
    },

    unauthorize({commit}) {
      unauthorize();
      commit('resetAuth');
    },
  },
};
