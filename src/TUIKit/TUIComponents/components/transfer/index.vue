<template>
  <div class="transfer" :class="[isH5 ? 'transfer-h5' : '']">
    <header class="transfer-h5-header" v-if="isH5">
      <i class="icon icon-back" @click="cancel"></i>
      <span class="title">{{ title }}</span>
    </header>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watchEffect, toRefs, computed } from 'vue';

export default defineComponent({
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    selectedList: {
      type: Array,
      default: () => [],
    },
    isSearch: {
      type: Boolean,
      default: () => true,
    },
    isRadio: {
      type: Boolean,
      default: () => false,
    },
    isCustomItem: {
      type: Boolean,
      default: () => false,
    },
    title: {
      type: String,
      default: () => '',
    },
    type: {
      type: String,
      default: () => '',
    },
    isH5: {
      type: Boolean,
      default: () => false,
    },
    resultShow: {
      type: Boolean,
      default: () => true,
    },
  },
  setup(props: any, ctx: any) {
    const data = reactive({
      type: '',
      list: [],
      selectedList: [],
      isSearch: true,
      isCustomItem: false,
      title: '',
    });

    watchEffect(() => {
      if (props.isCustomItem) {
        for (let index = 0; index < props.list.length; index++) {
          if (props.list[index].conversationID.indexOf('@TIM#SYSTEM') > -1) {
            // eslint-disable-next-line vue/no-mutating-props
            props.list.splice(index, 1);
          }
          data.list = props.list;
        }
      } else {
        data.list = props.list;
      }
      data.selectedList = props.selectedList;
      data.isSearch = props.isSearch;
      data.isCustomItem = props.isCustomItem;
      data.title = props.title;
      data.type = props.type;
    });

    // 可选项
    const optional = computed(() => data.list.filter((item: any) => !item.isDisabled));

    const handleInput = (e: any) => {
      ctx.emit('search', e.target.value);
    };
    const selected = (item: any) => {
      if (item.isDisabled) {
        return;
      }
      let list: any = data.selectedList;
      const index: number = list.indexOf(item);
      if (index > -1) {
        return data.selectedList.splice(index, 1);
      }
      if (props.isRadio) {
        list = [];
      }
      list.push(item);
      data.selectedList = list;
    };

    const selectedAll = () => {
      if (data.selectedList.length === optional.value.length) {
        data.selectedList = [];
      } else {
        data.selectedList = [...optional.value];
      }
    };
    const submit = () => {
      ctx.emit('submit', data.selectedList);
    };

    const cancel = () => {
      ctx.emit('cancel');
    };

    return {
      ...toRefs(data),
      optional,
      handleInput,
      selected,
      selectedAll,
      submit,
      cancel,
    };
  },
});
</script>

<style lang="scss" scoped src="./style/transfer.scss"></style>
