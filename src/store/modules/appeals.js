import {getAppeals} from '@/api/appeals.js';
import {getPremises} from '@/api/geo.js';

const STUB_APPEAL_ID = Symbol('Stub id for a new appeal');

export default {
  namespaced: true,

  state: () => ({
    appeals: [],
    activeAppealId: null,
    premises: [],
    page: 1,
    pageSize: 10,
    count: 0,
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

    resetAppeals(state, {appeals, count}) {
      state.appeals = appeals;
      state.count = count;
    },

    resetPremises(state, premises) {
      state.premises = premises;
    },

    setActiveAppeal(state, id = STUB_APPEAL_ID) {
      state.activeAppealId = id;
    },

    setFailMessage(state, message) {
      state.failMessage = message;
    },

    setStatus(state, status) {
      state.status = status;
    },
  },

  getters: {
    activeAppeal(state) {
      return state.appeals.find(({id}) => id === state.activeAppealId);
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
        const {appeals, count} = await getAppeals({
          search: state.search || undefined,
          premiseId: state.premiseId || undefined,
          page: state.page,
          pageSize: state.pageSize,
        });
        commit('resetAppeals', {appeals, count});
      } catch (e) {
        commit('setFailMessage', 'Произошла непредвиденная ошибка');
        commit('resetAppeals', {appeals: [], count: 0});
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
