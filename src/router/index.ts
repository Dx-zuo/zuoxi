import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { TUICore } from '../TUIKit';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: { name: 'Login' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    meta: {
      keepAlive: true,
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
  },
  {
    path: '/custom',
    name: 'Custom',
    component: () => import(/* webpackChunkName: "about" */ '../views/CustomDetail.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !(TUICore as any).isLogin) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
