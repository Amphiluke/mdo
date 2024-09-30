import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import LoginView from '@/views/LoginView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'appeals',
    component: () => import('@/views/AppealsView.vue'),
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
  const toLogin = to.name === 'login';
  const isAuthorized = store.getters['auth/isAuthorized'];
  if (!toLogin && !isAuthorized) {
    next({name: 'login'});
    return;
  }
  if (toLogin && isAuthorized) {
    store.dispatch('auth/unauthorize');
  }
  next();
});

export default router;
