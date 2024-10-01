import {getAppeals, getPremises} from '@/api/appeals.js';

export default {
  namespaced: true,

  state: () => ({
    appeals: [],
    premises: [],
    page: 1,
    pageSize: 10,
    pageCount: 0,
    search: '',
    premiseId: '',
    failMessage: '',
    status: 'idle',
  }),

  mutations: {
    resetSearch(state, search) {
      state.search = search;
    },

    resetPremiseId(state, premiseId) {
      state.premiseId = premiseId;
    },

    resetPagination(state, {page = 1, pageSize = 10} = {}) {
      state.page = page;
      state.pageSize = pageSize;
    },

    resetAppeals(state, {appeals, pageCount}) {
      state.appeals = appeals;
      state.pageCount = pageCount;
    },

    resetPremises(state, premises) {
      state.premises = premises;
    },

    setFailMessage(state, message) {
      state.failMessage = message;
    },

    setStatus(state, status) {
      state.status = status;
    },
  },

  actions: {
    async fetch({state, commit}, {page, pageSize, search, premiseId} = {}) {
      try {
        commit('setStatus', 'pending');
        commit('setFailMessage', '');
        if (page !== undefined || pageSize !== undefined) {
          commit('resetPagination', {page, pageSize});
        }
        if (search !== undefined) {
          commit('resetSearch', search);
        }
        if (premiseId !== undefined) {
          commit('resetPremiseId', premiseId);
        }
        const {appeals, pageCount} = await getAppeals({
          search: state.search || undefined,
          premiseId: state.premiseId || undefined,
          page: state.page,
          pageSize: state.pageSize,
        });
        commit('resetAppeals', {appeals, pageCount});
      } catch (e) {
        commit('setFailMessage', 'Произошла непредвиденная ошибка');
        commit('resetAppeals', {appeals: [], pageCount: 0});
      } finally {
        commit('setStatus', 'idle');
      }
    },

    async loadPremises({commit}) {
      try {
        commit('resetPremises', await getPremises());
      } catch (e) {
        commit('resetPremises', []);
        console.error('Failed to load premises');
      }
    },
  },
};
