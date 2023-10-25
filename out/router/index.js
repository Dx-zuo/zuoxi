"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_router_1 = require("vue-router");
const TUIKit_1 = require("../TUIKit");
const routes = [
    {
        path: '/',
        redirect: { name: 'Login' },
    },
    {
        path: '/login',
        name: 'Login',
        component: () => Promise.resolve().then(() => require(/* webpackChunkName: "about" */ '../views/Login.vue')),
    },
    {
        path: '/home',
        name: 'Home',
        meta: {
            keepAlive: true,
        },
        component: () => Promise.resolve().then(() => require(/* webpackChunkName: "about" */ '../views/Home.vue')),
    },
    {
        path: '/custom',
        name: 'Custom',
        component: () => Promise.resolve().then(() => require(/* webpackChunkName: "about" */ '../views/CustomDetail.vue')),
    },
];
const router = (0, vue_router_1.createRouter)({
    history: (0, vue_router_1.createWebHashHistory)(process.env.BASE_URL),
    routes,
});
router.beforeEach((to, from, next) => {
    if (to.name !== 'Login' && !TUIKit_1.TUICore.isLogin) {
        next({ name: 'Login' });
    }
    else {
        next();
    }
});
exports.default = router;
