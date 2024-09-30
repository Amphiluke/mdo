import {authorize, unauthorize} from '@/api/auth.js';

export default {
  namespaced: true,

  state: () => ({
    userId: null,
    failMessage: '',
  }),

  getters: {
    isAuthorized({userId}) {
      return userId !== null;
    },
  },

  mutations: {
    setUser(state, userId) {
      state.userId = userId;
    },

    setFailMessage(state, message) {
      state.failMessage = message;
    },
  },

  actions: {
    async authorize({commit}, {username, password}) {
      try {
        commit('setFailMessage', '');
        const {employee_id: userId} = await authorize(username, password);
        commit('setUser', userId);
      } catch (e) {
        commit('setFailMessage', 'Неправильные данные');
        return Promise.reject();
      }
    },

    unauthorize({commit}) {
      unauthorize();
      commit('setUser', null);
    },
  },
};
