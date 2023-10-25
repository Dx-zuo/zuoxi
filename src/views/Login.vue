<template>
  <div :class="['login-h5']" data-env="H5">
    <div v-loading.fullscreen.lock="fullscreenLoading"></div>
  </div>
</template>

<script lang="ts">
import { getCurrentInstance, ref, defineComponent, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { getServiceInfo } from "../api/index";
import { genTestUserSig, EXPIRETIME } from "../TUIKit/debug/index";
// import { SDKAppID, secretKey } from '../main';

export default defineComponent({
  setup() {
    const instance = getCurrentInstance();
    const router = useRouter();

    const TUIKit: any = instance?.appContext.config.globalProperties.$TUIKit;
    const fullscreenLoading = ref(true);

    const store = useStore();
    onBeforeMount(async () => {
      if (TUIKit.isSDKReady) {
        await TUIKit.logout();
      }
    });

    const login = (id: any) => {
      getServiceInfo({ id }).then(({ data }: any) => {
        // IM登录
        // const fakeId = '111'; // 62069299
        // const options = genTestUserSig({ SDKAppID, secretKey, userID: fakeId });
        const userInfo = {
          // userID: fakeId,
          // userSig: options.userSig,
          // xxx
          userID: data.data.guest_id,
          userSig: data.data.guest_Sig,
          kefuId: data.data.user_id,
        };
        TUIKit.login(userInfo)
          .then(() => {
            fullscreenLoading.value = false;
            const options = {
              ...userInfo,
              expire: new Date().getTime() + EXPIRETIME * 1000,
            };
            store.commit("setUserInfo", options);
            router.push({ name: "Home" });
          })
          .catch((error: any) => {
            ElMessage({
              message: error,
              grouping: true,
              type: "error",
            });
          });
      });
    };

    if (window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (!id) return;
      login(id);
    }

    return {
      fullscreenLoading,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/login.scss";
</style>
