import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import {
  MdLayout,
  MdContent, 
  MdButton,
  MdField, 
  MdIcon, 
  MdSnackbar, 
  MdTable, 
  MdEmptyState,
  MdMenu,
  MdList,
  MdRipple,
  MdProgress,
  MdDialog,
  MdAutocomplete
} from 'vue-material/dist/components';
import './styles/main.scss';

Vue.config.productionTip = false;

[MdLayout, MdContent, MdButton, MdField, MdIcon, MdSnackbar, MdTable, MdEmptyState, MdMenu, MdList, MdRipple,
  MdProgress, MdDialog, MdAutocomplete]
  .forEach((component) => Vue.use(component));

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#mdo-app');
