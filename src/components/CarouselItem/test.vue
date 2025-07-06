<template>
  <div class="test-container">
    <CarselItem
      src="https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?fit=crop&crop=entropy&w=3456&h=2304"
      placeholder="https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?w=100"
      @load="onLoaded"
      @error="onError"
    ></CarselItem>
  </div>
</template>

<script>
import CarselItem from "./index.vue";
import imgUrl from "@/assets/carouselImg/0.webp";
export default {
  components: {
    CarselItem,
  },
  data: () => ({
    imgUrl,
  }),
  methods: {
    onLoaded() {
      console.log("图片加载成功");
    },
    onError() {
      console.log("报错了");
    },
  },
};
</script>

<style></style>
