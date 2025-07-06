<template>
  <div
    class="combined-container"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- 占位图（模糊效果） -->
    <img
      v-if="!everythingDone"
      class="placeholder"
      :src="placeholder"
      alt=""
    />

    <!-- 主图（带悬停位移效果） -->
    <img
      ref="imgDom"
      :src="src"
      alt=""
      @load="handleImageLoad"
      @error="handleImageError"
      :style="{
        ...imgStyle,
        opacity: originOpacity,
        transition: `transform 0.2s ease, opacity ${duration}ms`
      }"
    />
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 500,
    },
  },
  data: () => ({
    // 图片加载状态
    originLoaded: false,
    everythingDone: false,
    
    // 位移效果相关
    imgWidth: 0,
    imgHeight: 0,
    containerWidth: 0,
    containerHeight: 0,
    moveX: 0,
    moveY: 0,
    isReady: false,
    animationFrameId: null,
    resizeObserver: null,
  }),
  computed: {
    // 最大可偏移量
    maxOffset() {
      return {
        x: Math.max(0, (this.imgWidth - this.containerWidth) / 2),
        y: Math.max(0, (this.imgHeight - this.containerHeight) / 2),
      };
    },
    // 动态位移样式
    imgStyle() {
      return {
        transform: `translate(calc(-50% + ${this.moveX}px), calc(-50% + ${this.moveY}px))`,
      };
    },
    // 主图透明度
    originOpacity() {
      return this.originLoaded ? 1 : 0;
    },
  },
  methods: {
    // 鼠标交互逻辑
    handleMouseMove(e) {
      if (!this.isReady) return;
      if (!this.animationFrameId) {
        this.animationFrameId = requestAnimationFrame(() => {
          this.moveX = -((e.offsetX / this.containerWidth) * 2 - 1) * this.maxOffset.x;
          this.moveY = -((e.offsetY / this.containerHeight) * 2 - 1) * this.maxOffset.y;
          this.animationFrameId = null;
        });
      }
    },
    handleMouseLeave() {
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
      this.$nextTick(() => {
        this.moveX = this.moveY = 0;
      });
    },

    // 图片加载逻辑
    handleImageLoad() {
      this.initImageSize(); // 初始化尺寸
      this.originLoaded = true;
      setTimeout(() => {
        this.everythingDone = true;
        this.$emit('load');
      }, this.duration);
    },
    handleImageError() {
      console.error('图片加载失败');
      this.$emit('error');
    },
    
    // 尺寸初始化
    initImageSize() {
      this.imgWidth = this.$refs.imgDom.clientWidth;
      this.imgHeight = this.$refs.imgDom.clientHeight;
      this.containerWidth = this.$el.clientWidth;
      this.containerHeight = this.$el.clientHeight;
      this.isReady = true;
    },
  },
  mounted() {
    // 响应式尺寸监听
    this.resizeObserver = new ResizeObserver(() => {
      if (this.originLoaded) this.initImageSize();
    });
    this.resizeObserver.observe(this.$el);
  },
  beforeDestroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.resizeObserver?.disconnect();
  },
};
</script>

<style scoped lang="less">
.combined-container {
  width: 50vw;
  height: 50vh;
  position: relative;
  overflow: hidden;
  margin: 0 auto;

  img {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 110%;
    height: 120%;
    object-fit: cover;
    transform: translate(-50%, -50%);
  }

  .placeholder {
    filter: blur(2vw);
    z-index: 1; /* 确保占位图在上层 */
  }

  /* 主图层级控制 */
  img:not(.placeholder) {
    z-index: 2;
    transition: transform 0.2s ease, opacity 500ms; /* 分离动画属性 */
  }
}
</style>