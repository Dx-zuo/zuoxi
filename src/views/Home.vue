<template>
  <div :class="['home-h5']">
    <main class="home-h5-main">
      <div class="message" v-show="!currentConversationID">
        <main class="home-h5-content" v-show="currentModel === 'message'">
          <header class="home-h5-main-header">
            <TUISearch />
          </header>
          <div class="home-h5-main-content">
            <TUIConversation @current="handleCurrentConversation" :displayOnlineStatus="displayOnlineStatus" />
          </div>
        </main>
      </div>
      <TUIChat v-show="currentConversationID" />
    </main>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  ref,
} from 'vue';
import { TUICore } from '../TUIKit';
import Header from '../components/Header.vue';
import { useStore } from 'vuex';

export default defineComponent({
  components: {
    Header,
  },
  setup(props, context) {
    const dialogState = ref(false);
    const store = useStore && useStore();
    const isMsgNeedReadReceipt = computed(() => JSON.parse(store.state.isMsgNeedReadReceipt));
    const displayOnlineStatus = computed(() => JSON.parse(store.state.displayOnlineStatus));
    const data = reactive({
      currentModel: 'message',
      userInfo: TUICore.instance.getStore().TUIProfile.profile,
      currentConversationID: '',
    });

    TUICore.instance.TUIServer.TUIProfile.getMyProfile().then((res: any) => {
      data.userInfo = res.data;
    });

    const handleCurrentConversation = (value: string) => {
      data.currentModel = 'message';
      data.currentConversationID = value;
    };

    return {
      ...toRefs(data),
      handleCurrentConversation,
      isMsgNeedReadReceipt,
      displayOnlineStatus,
      dialogState,
    };
  },
});
</script>
<style lang="scss" scoped>
@import "../styles/home.scss";
</style>
