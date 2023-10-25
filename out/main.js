"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secretKey = exports.SDKAppID = void 0;
const vue_1 = require("vue");
const App_vue_1 = require("./App.vue");
const router_1 = require("./router");
const store_1 = require("./store");
const element_plus_1 = require("element-plus");
require("element-plus/dist/index.css");
const gitart_vue_dialog_1 = require("gitart-vue-dialog");
require("gitart-vue-dialog/dist/style.css");
const locales_1 = require("./locales");
const TUIKit_1 = require("./TUIKit");
const call_uikit_vue_1 = require("@tencentcloud/call-uikit-vue");
const TUIPlugin_1 = require("./TUIKit/TUIPlugin");
const SDKAppID = 1400828953; // prod
exports.SDKAppID = SDKAppID;
// const SDKAppID = 1600006930; // test
const secretKey = '6247de28b0f5381b30fea3ce735fa541df56e56225407804bad884515b29b0b3'; // Your secretKey
exports.secretKey = secretKey;
const TUIKit = TUIKit_1.TUICore.init({
    SDKAppID,
});
TUIKit.config.i18n.provideMessage(locales_1.default);
TUIKit.use(TUIKit_1.TUIComponents);
TUIKit.use(call_uikit_vue_1.TUICallKit);
TUIKit.use(TUIPlugin_1.TUINotification);
const app = (0, vue_1.createApp)(App_vue_1.default);
app.component('GDialog', gitart_vue_dialog_1.GDialog);
app.use(store_1.default)
    .use(router_1.default)
    .use(TUIKit)
    .use(element_plus_1.default)
    .mount('#app');
