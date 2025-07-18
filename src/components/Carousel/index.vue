<template>
  <div
    class="carousel-container"
    @mouseenter="isHovered = true"
    @mouseleave="
      isHovered = false;
      tryAdvanceSlide();
    "
  >
    <!-- 轮播图主体 -->
    <div class="carousel-track" :style="trackStyle">
      <CarouselItem
        v-for="(item, index) in cloneImgsArray"
        :key="index"
        :originalImgSrc="item.src"
        :placeholderSrc="item.placeholder"
        :description="item.desc"
        :is-active="currentIndex === index"
        :is-hovered="isHovered"
        class="carousel-item"
        :index="index"
        @animation-complete="handleAnimationComplete"
      ></CarouselItem>
    </div>
    <!-- 轮播导航箭头 -->
    <button class="carousel-arrow prev" @click="handlePrev">
      <span>&#10094;</span>
    </button>
    <button class="carousel-arrow next" @click="handleNext">
      <span>&#10095;</span>
    </button>
    <!-- 轮播导航控点 -->
    <div class="carousel-dots">
      <span
        :class="currentRealIndex === index ? 'active' : ''"
        v-for="(item, index) in imgsInfo"
        :key="index"
        @click="goToIndex(index)"
      ></span>
    </div>
  </div>
</template>

<script>
import CarouselItem from "@/components/CarouselItem/index.vue";
export default {
  components: {
    CarouselItem,
  },
  props: {
    imgsInfo: {
      type: Array,
      required: true,
    },
    interval: {
      type: Number,
      default: 3000,
    },
  },
  data: () => ({
    isHovered: false,
    isCarouselItemAnimationComplete: false,
    containerWidth: 0,
    currentIndex: 1,
    timer: null,
    transitionEnabled: false,
  }),
  computed: {
    cloneImgsArray() {
      return [
        ...this.imgsInfo.slice(-1),
        ...this.imgsInfo,
        ...this.imgsInfo.slice(0, 1),
      ];
    },
    trackStyle() {
      return {
        transform: `translateX(-${this.currentIndex * this.containerWidth}px)`,
        transition: this.transitionEnabled ? `transform 0.5s ease` : `none`,
      };
    },
    currentRealIndex() {
      if (this.currentIndex <= 0) {
        // currentIndex<=0时,显示的是原数组的最后一张图片
        return this.imgsInfo.length - 1;
      } else if (this.currentIndex >= this.cloneImgsArray.length - 1) {
        // currentIndex 大于等于克隆数组最后一项索引值时，显示的是原数组的第一张图片
        return 0;
      }
      return this.currentIndex - 1;
    },
  },
  methods: {
    getContainerWidth() {
      this.containerWidth = this.$el.clientWidth;
    },
    handleAnimationComplete() {
      this.isCarouselItemAnimationComplete = true;
      this.tryAdvanceSlide();
    },
    tryAdvanceSlide() {
      if (!this.isHovered && this.isCarouselItemAnimationComplete) {
        // 执行轮播逻辑
        this.next();
        this.isCarouselItemAnimationComplete = false; // 重置状态
      }
    },
    handlePrev() {
      this.prev();
      this.resetChildAnimation(); // 新增
    },
    handleNext() {
      this.next();
      this.resetChildAnimation(); // 新增
    },
    resetChildAnimation() {
      if (this.$refs.carouselItem) {
        this.$refs.carouselItem.resetTyping();
      }
    },
    next() {
      this.transitionEnabled = true;
      this.currentIndex++;
      this.checkBoundary();
    },
    prev() {
      this.transitionEnabled = true;
      this.currentIndex--;
      this.checkBoundary();
    },
    goToIndex(index) {
      // index为原数组的索引值，克隆数组的索引值与其的关系是原数组索引值+1 = 克隆数组的索引值
      this.currentIndex = index + 1;
    },
    checkBoundary() {
      if (this.currentIndex <= 0) {
        setTimeout(() => {
          // 在点击上一页时，当前索引为克隆数组的0项，即克隆的原数组的最后一张图片
          // 设置无过渡跳转到克隆数组索引的倒数第二项，即原数组的最后一张图片，实现轮播图逆向的无缝切换，视觉上不会留下空白边界
          this.transitionEnabled = false;
          this.currentIndex = this.cloneImgsArray.length - 2;
        }, 500);
      }
      if (this.currentIndex >= this.cloneImgsArray.length - 1) {
        setTimeout(() => {
          //现在动画过渡到了克隆数组索引的最后一项，即克隆的原数组第一张图片
          //设置无过渡跳转到克隆数组索引1，即原数组第一张图片，实现视觉上的无缝切换，视觉上不会留下空白边界
          this.transitionEnabled = false;
          this.currentIndex = 1;
        }, 500);
      }
    },
  },
  mounted() {
    this.getContainerWidth();
    window.addEventListener("resize", this.getContainerWidth);
  },
  destroyed() {
    window.removeEventListener("resize", this.getContainerWidth);
  },
};
</script>

<style lang="less" scoped>
.carousel-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  // 轮播图主体
  .carousel-track {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    // overflow: hidden;
    flex-wrap: nowrap; /* 禁止换行 */
    & ::v-deep .carousel-item {
      flex: 0 0 100%;
    }
  }

  // 轮播导航箭头
  .carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.4);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #ccc;
    border: none;
    cursor: pointer;
    &.prev {
      left: 40px;
      animation: left-arrow-float 3s infinite;
    }
    &.next {
      right: 40px;
      animation: right-arrow-float 3s infinite;
    }
    // 鼠标移入悬停样式
    &:hover {
      background: rgba(0, 0, 0, 1);
      color: #fff;
    }

    @keyframes left-arrow-float {
      0%,
      100% {
        left: 40px;
        opacity: 0;
      }
      50% {
        left: 20px;
        opacity: 1;
      }
    }
    @keyframes right-arrow-float {
      0%,
      100% {
        right: 40px;
        opacity: 0;
      }
      50% {
        right: 20px;
        opacity: 1;
      }
    }
  }
  // 鼠标移入容器悬停暂停箭头动画
  &:hover .carousel-arrow {
    animation-play-state: paused;
  }

  // 轮播导航控点
  .carousel-dots {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    span {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: transparent;
      border: 1px #fff solid;
      box-shadow: 1px 0 0 rgba(0, 0, 0, 0.5), -1px 0 0 rgba(0, 0, 0, 0.5),
        0 1px 0 rgba(0, 0, 0, 0.5), 0 -1px 0 rgba(0, 0, 0, 0.5);
      &.active {
        background: #fff;
      }
    }
  }
}
</style>
