import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { GDialog } from 'gitart-vue-dialog';
import 'gitart-vue-dialog/dist/style.css';

import locales from './locales';

import { TUICore, TUIComponents } from './TUIKit';
import { TUICallKit } from '@tencentcloud/call-uikit-vue';
import { TUINotification } from './TUIKit/TUIPlugin';

const SDKAppID = 1400828953; // prod
// const SDKAppID = 1600006930; // test
const secretKey = '6247de28b0f5381b30fea3ce735fa541df56e56225407804bad884515b29b0b3'; // Your secretKey

const TUIKit = TUICore.init({
  SDKAppID,
});

TUIKit.config.i18n.provideMessage(locales);

TUIKit.use(TUIComponents);
TUIKit.use(TUICallKit);
TUIKit.use(TUINotification);

const app = createApp(App);
app.component('GDialog', GDialog);

app.use(store)
  .use(router)
  .use(TUIKit)
  .use(ElementPlus)
  .mount('#app');

export { SDKAppID, secretKey };
