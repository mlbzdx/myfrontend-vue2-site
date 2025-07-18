<template>
  <div class="test-container">
    <Carousel :imgsInfo="imgsInfoArray" :interval="3000" />
  </div>
</template>

<script>
import Carousel from "./index";
import img1 from "@/assets/carouselImg/0.webp";
import img2 from "@/assets/carouselImg/1.webp";
import img3 from "@/assets/carouselImg/2.webp";
import img4 from "@/assets/carouselImg/3.webp";
export default {
  components: { Carousel },
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
};
</script>

<style lang="less" scoped>
.test-container {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 50vw;
  height: 50vh;
}
</style>
