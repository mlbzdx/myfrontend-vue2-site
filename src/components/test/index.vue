<template>
  <div
    class="carousel-container"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 轮播主体区 -->
    <div class="carousel-track" :style="trackStyle">
      <CarouselItem
        class="carousel-item"
        v-for="(item, index) in cloneImgsInfo"
        :imgInfo="item"
        :key="index"
        :isActive="currentIndex === index"
        :isHover="isHover"
      ></CarouselItem>
    </div>
    <!-- 指示箭头控件 -->
    <button class="carousel-arrow prev" @click="gotoIndex(currentIndex - 1)">
      <span>&#10094;</span>
    </button>
    <button class="carousel-arrow next" @click="gotoIndex(currentIndex + 1)">
      <span>&#10095;</span>
    </button>
    <!-- 分页控件 -->
    <div class="carousel-pagination">
      <span
        class="carousel-dot"
        :class="realCurrentIndex === index ? 'active' : ''"
        v-for="(item, index) in imgsInfo"
        :key="index"
        @click="gotoIndex(index + 1)"
      ></span>
    </div>
  </div>
</template>

<script>
import CarouselItem from "./CarouselItem.vue";
export default {
  components: {
    CarouselItem,
  },
  props: {
    imgsInfo: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    currentIndex: 1, //当前页码索引
    containerWidth: 0, //当前轮播容器的宽度
    transitionEnable: false, //过渡状态是否激活,默认不激活，
    duration: 500, //过渡动画事件
    isHover: false,
  }),
  computed: {
    cloneImgsInfo() {
      return [
        this.imgsInfo[this.imgsInfo.length - 1],
        ...this.imgsInfo,
        this.imgsInfo[0],
      ];
    },
    trackStyle() {
      return {
        transform: `translateX(${-this.containerWidth * this.currentIndex}px)`,
        transition: this.transitionEnable
          ? `transform ${this.duration}ms  ease-in-out `
          : `none`,
      };
    },
    realCurrentIndex() {
      if (this.currentIndex >= this.cloneImgsInfo.length - 1) {
        return 0;
      } else if (this.currentIndex <= 0) {
        return this.imgsInfo.length - 1;
      }
      return this.currentIndex - 1;
    },
  },
  methods: {
    getContainerWidth() {
      this.containerWidth = this.$el.clientWidth;
    },
    gotoIndex(index) {
      this.currentIndex = index;
      this.checkBoundary();
    },
    checkBoundary() {
      this.transitionEnable = true;
      if (this.currentIndex >= this.cloneImgsInfo.length - 1) {
        // 设置计时是为保证过渡到占位图时仍有动画，而继续过渡时直接无过渡效果跳转到第一页
        setTimeout(() => {
          this.transitionEnable = false;
          this.currentIndex = 1;
        }, this.duration);
      } else if (this.currentIndex <= 0) {
        setTimeout(() => {
          this.transitionEnable = false;
          this.currentIndex = this.cloneImgsInfo.length - 2;
        }, this.duration);
      }
    },
    handleMouseEnter() {
      this.isHover = true;
    },
    handleMouseLeave() {
      this.isHover = false;
    },
  },
  mounted() {
    this.getContainerWidth();
    window.addEventListener("resize", this.getContainerWidth);
  },
  beforeDestroy() {
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
  .carousel-pagination {
    position: absolute;
    left: 50%;
    bottom: 30px;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;

    .carousel-dot {
      width: 10px;
      height: 10px;
      border: 1px solid #fff;
      border-radius: 50%;
      &.active {
        background: #fff;
      }
    }
  }
}
</style>
