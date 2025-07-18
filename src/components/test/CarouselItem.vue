<template>
  <div class="carousel-item">
    <!-- 占位图（模糊效果） -->
    <img
      :src="imgInfo.placeholder"
      class="placeholderImg"
      v-if="showPlaceholderImg"
    />

    <!-- 原图（带加载过渡效果） -->
    <img
      :src="imgInfo.src"
      class="originalImg"
      @load="handleMask"
      :style="originalImgStyle"
    />

    <!-- 打字机效果文本区域 -->
    <div class="text-info">
      <p class="desc-title">
        {{ displayedTitle }}<span v-show="showTitleCursor">|</span>
        <!-- 标题光标 -->
      </p>
      <p class="desc-content">
        {{ displayedContent }}<span v-show="showContentCursor">|</span>
        <!-- 内容光标 -->
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imgInfo: { type: Object, required: true },
    isActive: { type: Boolean, required: true },
    isHover: { type: Boolean, required: true },
  },
  data() {
    return {
      // 图片蒙版控制
      showOriginalImg: !this.isActive, // 是否显示原图
      showPlaceholderImg: this.isActive, // 是否显示占位图
      duration: 2000, // 图片切换动画时长(ms)

      // 打字效果状态
      displayedTitle: "", // 当前显示的标题文本
      displayedContent: "", // 当前显示的内容文本
      showTitleCursor: false, // 标题光标可见性
      showContentCursor: false, // 内容光标可见性

      // 计时器控制
      typingTimer: null, // 打字效果计时器
      currentPhase: "idle", // 当前阶段：idle/typingTitle/typingContent/deleting
      currentIndex: 0, // 当前打字/删除的字符索引
      isPaused: false, // 是否暂停状态
    };
  },
  computed: {
    // 原图样式（透明度过渡效果）
    originalImgStyle() {
      return {
        opacity: this.showOriginalImg ? 1 : 0,
        transition: `opacity ${this.duration}ms ease-in-out`,
      };
    },
  },
  watch: {
    isActive(newVal) {
      this.handleMask();
    },
    isHover(newVal) {
      if (newVal) {
        this.pauseTyping();
      } else {
        this.resumeTyping();
      }
    },
  },
  methods: {
    // 处理图片蒙版切换逻辑
    handleMask() {
      if (this.isActive) {
        // 激活状态：显示原图 → 隐藏占位图 → 开始打字
        this.showOriginalImg = true;
        setTimeout(() => {
          this.showPlaceholderImg = false;
          this.startTyping();
        }, this.duration);
      } else {
        // 非激活状态：隐藏原图 → 显示占位图 → 停止打字
        this.showOriginalImg = false;
        this.showPlaceholderImg = true;
        this.stopTyping();
      }
    },

    // 初始化打字效果
    startTyping(options = {}) {
      this.stopTyping(); // 先停止现有效果

      // 合并配置参数
      const config = {
        typingSpeed: 150, // 打字速度(ms/字符)
        deleteSpeed: 75, // 删除速度(ms/字符)
        restartDelay: 1200, // 循环间隔(ms)
        loop: true, // 是否循环
        ...options,
      };

      // 初始化状态
      this.currentPhase = "typingTitle"; // 从标题开始
      this.currentIndex = 0;
      this.config = config;
      this.typeNextCharacter(); // 开始第一个字符
    },

    // 处理每个字符的显示/删除
    typeNextCharacter() {
      if (this.isPaused) return;

      // 根据当前阶段选择速度
      const speed = this.currentPhase.includes("typing")
        ? this.config.typingSpeed
        : this.config.deleteSpeed;

      switch (this.currentPhase) {
        // 标题打字阶段
        case "typingTitle":
          if (this.currentIndex < this.imgInfo.desc.title.length) {
            // 逐个显示标题字符
            this.displayedTitle = this.imgInfo.desc.title.substring(
              0,
              this.currentIndex + 1
            );
            this.showTitleCursor = true;
            this.currentIndex++;
            this.typingTimer = setTimeout(
              () => this.typeNextCharacter(),
              speed
            );
          } else {
            // 标题打完，切换到内容打字
            this.showTitleCursor = false;
            this.currentPhase = "typingContent";
            this.currentIndex = 0;
            this.typingTimer = setTimeout(
              () => this.typeNextCharacter(),
              speed
            );
          }
          break;

        // 内容打字阶段
        case "typingContent":
          if (this.currentIndex < this.imgInfo.desc.content.length) {
            // 逐个显示内容字符
            this.displayedContent = this.imgInfo.desc.content.substring(
              0,
              this.currentIndex + 1
            );
            this.showContentCursor = true;
            this.currentIndex++;
            this.typingTimer = setTimeout(
              () => this.typeNextCharacter(),
              speed
            );
          } else if (this.config.loop) {
            // 内容打完，切换到删除阶段
            this.currentPhase = "deleting";
            this.typingTimer = setTimeout(
              () => this.typeNextCharacter(),
              this.config.restartDelay
            );
          }
          break;

        // 删除阶段
        case "deleting":
          if (this.displayedContent.length > 0) {
            // 逐个删除内容字符
            this.displayedContent = this.displayedContent.substring(
              0,
              this.displayedContent.length - 1
            );
            this.typingTimer = setTimeout(
              () => this.typeNextCharacter(),
              speed
            );
          } else if (this.displayedTitle.length > 0) {
            // 内容删完，删除标题
            this.displayedTitle = this.displayedTitle.substring(
              0,
              this.displayedTitle.length - 1
            );
            this.typingTimer = setTimeout(
              () => this.typeNextCharacter(),
              speed
            );
          } else if (this.config.loop) {
            // 全部删完，重新开始循环
            this.currentPhase = "typingTitle";
            this.currentIndex = 0;
            this.typingTimer = setTimeout(
              () => this.typeNextCharacter(),
              this.config.restartDelay
            );
          }
          break;
      }
    },

    // 暂停打字效果
    pauseTyping() {
      if (this.currentPhase === "idle" || this.isPaused) return;

      this.isPaused = true;
      clearTimeout(this.typingTimer); // 清除计时器
      this.showTitleCursor = false; // 隐藏光标
      this.showContentCursor = false;
    },

    // 恢复打字效果
    resumeTyping() {
      if (!this.isPaused) return;

      this.isPaused = false;
      this.typeNextCharacter(); // 从暂停点继续
    },

    // 完全停止打字效果
    stopTyping() {
      clearTimeout(this.typingTimer);
      this.currentPhase = "idle";
      this.displayedTitle = "";
      this.displayedContent = "";
      this.showTitleCursor = false;
      this.showContentCursor = false;
      this.isPaused = false;
    },
  },
  beforeDestroy() {
    this.stopTyping();
  },
};
</script>

<style lang="less" scoped>
/* 样式保持不变 */
.carousel-item {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  .originalImg,
  .placeholderImg {
    width: 110%;
    height: 110%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    object-fit: cover;
  }

  .placeholderImg {
    filter: blur(2vw);
  }

  .text-info {
    position: absolute;
    left: 30px;
    top: 30%;
    letter-spacing: 3px;
    color: #fff;
    text-shadow: 1px 0 0 rgba(0, 0, 0, 0.5), -1px 0 0 rgba(0, 0, 0, 0.5),
      0 1px 0 rgba(0, 0, 0, 0.5), 0 -1px 0 rgba(0, 0, 0, 0.5);
  }

  .desc-title {
    font-size: 24px;
    margin-bottom: 15px;
    min-height: 28px;
  }

  .desc-content {
    font-size: 16px;
    line-height: 1.5;
    min-height: 20px;
  }

  .desc-content span,
  .desc-title span {
    animation: blink 0.7s infinite;
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
}
</style>
