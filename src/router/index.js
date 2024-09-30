import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import LoginView from '@/views/LoginView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'requests',
    component: () => import('@/views/RequestsView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, _from, next) => {
  console.log('isAuthorized', store.getters['auth/isAuthorized']);
  if (to.name !== 'login' && !store.getters['auth/isAuthorized']) {
    next({name: 'login'});
  } else {
    next();
  }
});

export default router;
