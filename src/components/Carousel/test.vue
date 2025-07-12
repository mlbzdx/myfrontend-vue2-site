<template>
  <div class="test-container">
    <Carousel :imgsInfo="carouselItems" :interval="3000" />
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
  data() {
    return {
      carouselItems: [
        {
          src: img1,
          des: "男儿何不带吴钩，收取关山五十州",
          placeholder: img1,
        },
        {
          src: img2,
          des: "秋叶下的风景，只有可爱的她和你",
          placeholder: img2,
        },
        {
          src: img3,
          des: "世间万象，纷纷扰扰，那曙光又是谁的曙光",
          placeholder: img3,
        },
        {
          src: img4,
          des: "平二川，定三足，恍惚草堂梦里，挥斥千古风酋；战群儒，守空城，今摆乱石八阵，笑谈将军死生。",
          placeholder: img4,
        },
      ],
      // 使用Picsum Photos提供的免费图片
      // carouselItems: [
      //   {
      //     src: "https://picsum.photos/id/1018/1200/600", // 高清图
      //     placeholder: "https://picsum.photos/id/1018/50/25", // 低分辨率模糊占位图
      //   },
      //   {
      //     src: "https://picsum.photos/id/1015/1200/600",
      //     placeholder: "https://picsum.photos/id/1015/50/25",
      //   },
      //   {
      //     src: "https://picsum.photos/id/1019/1200/600",
      //     placeholder: "https://picsum.photos/id/1019/50/25",
      //   },
      // ],
    };
  },
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
