<template>
    <div class="custom" width= 100%;>

    <div class="title">{{ data.title }}</div>
    <div class="desc">{{ data.describe }}</div>
    <div class="img">
      <div v-for="(item, index) in data?.original_data" :key="index" class="item">
        <img v-if="item.insert?.image" :src="item.insert?.image" alt="" />
        <video
          class="videos"
          v-if="item.insert?.video"
          playsinline="false"
          :poster="item.insert?.video"
          webkit-playsinline="false"
          controls
        >
          <source :src="item.insert?.video" type="video/mp4" />
          <source :src="item.insert?.video" type="video/ogg" />
        </video>
      </div>
    </div>
  </div>
  <button class="btn">
    <slot/> <!-- 插槽 -->
  </button>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";

const CustomDetail = defineComponent({
  props: {
    data: {},
  },
  setup(props: any, ctx: any) {
    const router = useRouter();
    const state = reactive({
      data: props.data,
    });

    console.log("🔥🔥🔥🚀 ~ file: CustomDetail.vue:27 ~ data:", state.data);
    onMounted(() => {
      const videos: any = document.getElementsByClassName("videos");
      for (let i = 0; i < videos.length; i++) {
        videos[i].autoplay = false;
      }
    });
    const goback = () => {
      router.go(-1);
    };
    return {
      ...toRefs(state),
      goback,
    };
  },
});
export default CustomDetail;
</script>
<style lang="scss" scoped>
.custom {
  width: 100%;
  height: 100vh;
  background-color: #fff;
  box-sizing: border-box;
  padding: 50px 20px;

  .back {
    position: fixed;
    top: 0px;
    left: 0px;
    box-sizing: border-box;
    padding: 10px 20px 10px;
    width: 100%;
    background-color: #fff;
  }

  .title {
    font-size: 22px;
    margin-bottom: 8px;
  }

  .desc {
    font-size: 14px;
    color: rgb(84, 84, 84);
    margin-bottom: 10px;
  }

  .img {
    .item {
      img,
      video {
        width: 100%;
        height: 100%;
        margin-bottom: 10px;
      }

      video {
        height: 230px;
        background: #000;
      }
    }
  }
}
</style>

