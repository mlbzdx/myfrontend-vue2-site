<template>
  <div class="test-container">
    <CarselItem
      v-for="(item, index) in imgsInfoArray"
      :key="index"
      :originalImgSrc="item.src"
      :placeholderSrc="item.placeholder"
      :description="item.desc"
      :is-active="currentIndex === index"
      class="carousel-item"
      :index="index"
    ></CarselItem>
    <button
      @click="handleClick"
      style="position: absolute; bottom: 20px; left: 50%"
    >
      点击
    </button>
  </div>
</template>

<script>
import CarselItem from "./index.vue";
import img1 from "@/assets/carouselImg/0.webp";
import img2 from "@/assets/carouselImg/1.webp";
import img3 from "@/assets/carouselImg/2.webp";
import img4 from "@/assets/carouselImg/3.webp";
export default {
  components: {
    CarselItem,
  },
  data: () => ({
    imgsInfoArray: [
      {
        src: img1,
        placeholder: img1,
        desc: {
          title: "北望",
          content: "男儿何不带吴钩，收取关山五十州",
        },
      },
      {
        src: img2,
        desc: {
          title: "一叶",
          content: "秋叶下的风景，只有可爱的她和你",
        },

        placeholder: img2,
      },
      {
        src: img3,

        desc: {
          title: "黎明",
          content: "世间万象，纷纷扰扰，那曙光又是谁的曙光",
        },
        placeholder: img3,
      },
      {
        src: img4,
        desc: {
          title: "孔明",
          content:
            "平二川，定三足，恍惚草堂梦里，挥斥千古风酋；战群儒，守空城，今摆乱石八阵，笑谈将军死生。",
        },

        placeholder: img4,
      },
    ],
    currentIndex: 0,
    timeId: null,
  }),
  methods: {
    start() {
      this.currentIndex++;
      this.currentIndex = this.currentIndex % this.imgsInfoArray.length;
    },
    handleClick() {
      this.start();
    },
  },
};
</script>

<style lang="less" scoped>
.test-container {
  width: 50vw;
  height: 50vh;
  margin: 50px auto;
  display: flex;
  & ::v-deep .carousel-item {
    flex: 0 0 100%;
  }
}
</style>
