import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import {MdButton, MdContent, MdField, MdIcon, MdSnackbar} from 'vue-material/dist/components';
import './styles/main.scss';

Vue.config.productionTip = false;

[MdButton, MdContent, MdField, MdIcon, MdSnackbar]
  .forEach((component) => Vue.use(component));

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#mdo-app');
