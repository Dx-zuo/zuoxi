<template>
  <div class="TUI-search" :class="[env.isH5 ? 'TUI-search-H5' : '']" ref="dialog"></div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, computed } from "vue";
import constant from "../constant";
import { handleErrorPrompts } from "../utils";
import { useStore } from "vuex";

const TUISearch = defineComponent({
  name: "TUISearch",
  setup(props) {
    const store = useStore && useStore();
    const userInfo: any = computed(() => store.state.userInfo);
    const TUIServer: any = TUISearch?.TUIServer;
    const { t } = TUIServer.TUICore.config.i18n.useI18n();
    const data = reactive({
      selectedList: [],
      allUserList: [],
      searchUserList: [],
      showTitle: "",
      createConversationType: "",
      env: TUIServer.TUICore.TUIEnv,
      optionalShow: !TUIServer.TUICore.TUIEnv.isH5,
      needSearch: !TUIServer.TUICore.isOfficial,
    });

    TUIServer.bind(data);

    const submit = (userList: any) => {
      if (data.createConversationType === constant.typeC2C) {
        const { userID } = userList[0];
        handleCurrentConversation(userID, "C2C");
      }
      data.searchUserList = [...data.allUserList];
    };

    const handleCurrentConversation = (id: string, type: string) => {
      const name = `${type}${id}`;
      TUIServer.getConversationProfile(name).then((imResponse: any) => {
        TUIServer.TUICore.TUIServer.TUIConversation.handleCurrentConversation(
          imResponse.data.conversation
        );
      });
    };

    const showOpen = (type: string) => {
      data.searchUserList = [...data.allUserList];
      switch (type) {
        case "isC2C":
          data.createConversationType = constant.typeC2C;
          data.showTitle = t("TUISearch.发起单聊");
          return data.showTitle;
      }
    };

    const toggleOptionalShow = () => {
      if (data.env.isH5) {
        data.optionalShow = !data.optionalShow;
      }
    };

    const handleSearch = async (val: any) => {
      try {
        const imResponse: any = await TUIServer.getUserProfile([val]);
        if (!imResponse.data.length) {
          handleErrorPrompts(t("TUISearch.该用户不存在"), data.env);
          data.searchUserList = [...data.allUserList];
          return;
        }
        const { userID } = imResponse.data[0];
        handleCurrentConversation(userID, "C2C");
      } catch (error) {
        handleErrorPrompts(t("TUISearch.该用户不存在"), data.env);
        data.searchUserList = [...data.allUserList];
        return;
      }
    };
    onMounted(() => {
      handleSearch(userInfo.value.kefuId);
    });
    return {
      ...toRefs(data),
      handleSearch,
      submit,
      showOpen,
      toggleOptionalShow,
    };
  },
});
export default TUISearch;
</script>

<style lang="scss" scoped src="./style/index.scss"></style>
