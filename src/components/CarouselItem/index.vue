<template>
  <div
    class="combined-container"
    @mouseenter="handleMouseEnter"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- 占位图（模糊效果） -->
    <img v-if="!everythingDone" class="placeholder" :src="placeholder" alt="" />

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
        transition: `transform 0.2s ease, opacity ${duration}ms`,
      }"
    />

    <!-- 图片描述文本内容 -->
    <div class="text-container">
      <p ref="typeText" class="typed-text">{{ displayedText }}</p>
    </div>
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
    description: {
      type: String,
      default: "世间有十万字形，亦有十万字体",
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

    // 打字效果相关
    isHovered: false,
    displayedText: "",
    typingInterval: null,
    deletingInterval: null,
    currentIndex: 0,
    isTyping: true,
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
          this.moveX =
            -((e.offsetX / this.containerWidth) * 2 - 1) * this.maxOffset.x;
          this.moveY =
            -((e.offsetY / this.containerHeight) * 2 - 1) * this.maxOffset.y;
          this.animationFrameId = null;
        });
      }
    },
    handleMouseLeave() {
      this.isHovered = false;
      this.clearEffects();
      this.displayedText = ""; // 清空文字
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
      this.$nextTick(() => {
        this.moveX = this.moveY = 0;
      });
    },
    handleMouseEnter() {
      this.isHovered = true;
      this.startTypeEffect();
    },

    // 图片加载逻辑
    handleImageLoad() {
      this.initImageSize(); // 初始化尺寸
      this.originLoaded = true;
      setTimeout(() => {
        this.everythingDone = true;
        this.$emit("load");
      }, this.duration);
    },
    handleImageError() {
      console.error("图片加载失败");
      this.$emit("error");
    },

    // 尺寸初始化
    initImageSize() {
      this.imgWidth = this.$refs.imgDom.clientWidth;
      this.imgHeight = this.$refs.imgDom.clientHeight;
      this.containerWidth = this.$el.clientWidth;
      this.containerHeight = this.$el.clientHeight;
      this.isReady = true;
    },
    //打字相关
    startTypeEffect() {
      this.clearEffects();
      this.typeText();
    },
    // 打字
    typeText() {
      this.typingInterval = setInterval(() => {
        if (this.currentIndex <= this.description.length) {
          this.displayedText = this.description.substring(0, this.currentIndex);
          this.currentIndex++;
        } else {
          clearInterval(this.typingInterval);
          setTimeout(() => {
            this.deleteText();
          }, 2000); // 打字完成后停留2秒
        }
      }, 100); // 每个字符的间隔时间(ms)
    },
    // 删除文本
    deleteText() {
      this.deletingInterval = setInterval(() => {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.displayedText = this.description.substring(0, this.currentIndex);
        } else {
          clearInterval(this.deletingInterval);
          this.currentIndex = 0;
          if (this.isHovered) {
            // 检查是否仍在悬停状态
            setTimeout(() => {
              this.typeText(); // 重新开始打字
            }, 500);
          }
        }
      }, 50); // 删除速度比打字快
    },
    clearEffects() {
      clearInterval(this.typingInterval);
      clearInterval(this.deletingInterval);
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
    this.clearEffects();
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.resizeObserver?.disconnect();
  },
};
</script>

<style scoped lang="less">
.combined-container {
  height: 100%;
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

  .text-container {
    position: absolute;
    top: 50%;
    left: 50px;
    transform: translateY(-50%);
    padding: 10px 20px;
    border-radius: 4px;
    z-index: 10;
    .type-text {
      color: #fff;
      font-size: 1.8rem;
      font-weight: bold;
      text-shadow: 0 0 8px rgba(255, 255, 255, 0.9),
        0 0 12px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.5); /* 三层阴影增强可见性 */
      white-space: nowrap;
      overflow: hidden;
      border-right: 2px solid rgba(255, 255, 255, 0.8); /* 半透明光标 */
      letter-spacing: 1px;
    }
  }
}
</style>
