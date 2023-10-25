<template>
  <GDialog v-model="dialogState" max-width="400" scrollable>
    <div class="dialog" min-width="400">
      <div class="content" min-width="400">
        <ButtonX color="red" :data="isCustom" >我是插槽的值</ButtonX>
      </div>
      <div class="actions">
        <button
          class="btn btn--outline-gray"
          @click="dialogState = false"
        >
          关闭
        </button>
      </div>
    </div>
  </GDialog>

  <div class="custom">
    <div @click="dialogState = true" class="customBox">
      <div class="img">
        <img :src="firstImage" alt="" style="object-fit: cover; border-radius: 6px" />
      </div>
      <div class="desc">
        <div class="tit">{{ isCustom.title }}</div>
        <div class="tip">{{ isCustom.describe }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, watchEffect, reactive, toRefs } from "vue";
import { JSONToObject } from "../utils/utils";
import { useRouter } from "vue-router";
import CustomDetail from '../../../../../views/CustomDetail.vue';
import ButtonX from './ButtonX.vue'

const getImages = (data: any) => {
  const { original_data } = data;
  for (let index = 0; index < original_data.length; index++) {
    const item = original_data[index];
    if (item.insert.image) {
      return item.insert.image;
    }
  }
  return "https://sangebang.oss-accelerate.aliyuncs.com/iOS/9431/202302192053434.jpeg";
};
export default defineComponent({
  props: {
    data: {
      type: Object,
      dialogState: false,
      default: () => ({}),
    },
  },
  components: {
    CustomDetail,
    ButtonX,
  },
  setup(props: any, ctx: any) {
    const dialogState = ref(false)
    const router = useRouter();
    const data = reactive({
      data: {} as any,
      isCustom: {} as any,
      firstImage: "",
    });
    watchEffect(() => {
      data.data = props.data;
      const {
        message: { payload },
      } = props.data;
      data.isCustom = payload.data || " ";
      data.isCustom = JSONToObject(payload.data);
      data.firstImage = getImages(JSONToObject(payload.data));
    });
    const goDetail = () => {
      router.push({ name: "Custom", query: { data: JSON.stringify(data.isCustom) } });
    };
    return {
      ...toRefs(data),
      goDetail,
      dialogState
    };
  },
});
</script>
<style lang="scss" scoped>
@import url("../../../styles/common.scss");
@import url("../../../styles/icon.scss");

.custom {
  font-size: 14px;

  h1 {
    font-size: 14px;
    color: #000000;
  }

  h1,
  a,
  p {
    font-size: 14px;
  }

  .customBox {
    display: flex;

    .img {
      width: 67px;
      height: 67px;
      margin-right: 10px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .desc {
      flex: 1;

      .tit {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .tip {
        font-size: 12px;
        color: gray;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
  }

  .evaluate {
    ul {
      display: flex;
      padding-top: 10px;
    }
  }

  .order {
    display: flex;

    main {
      padding-left: 5px;

      p {
        font-family: PingFangSC-Regular;
        width: 145px;
        line-height: 17px;
        font-size: 14px;
        color: #999999;
        letter-spacing: 0;
        margin-bottom: 6px;
        word-break: break-word;
      }

      span {
        font-family: PingFangSC-Regular;
        line-height: 25px;
        color: #ff7201;
      }
    }

    img {
      width: 67px;
      height: 67px;
    }
  }

  .call {
    display: flex;
    flex-direction: row;
    align-items: center;

    &-C2C {
      cursor: pointer;
    }

    &-GROUP {
      cursor: default;
    }
  }
}
.dialog {
  color: #000;
  display: flex;
  flex-direction: column;
}

.content {
  padding: 10px 5px;
  overflow: auto;
}

.actions {
  padding: 3px;
  border-top: 1px solid rgb(179, 179, 179);
}
</style>
