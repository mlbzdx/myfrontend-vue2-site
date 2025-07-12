<template>
  <div class="carousel-item">
    <img
      v-show="showMask"
      :src="placeholderSrc"
      alt=""
      class="placeholderImg"
    />
    <img
      @load="handleLoaded"
      :src="originalImgSrc"
      :alt="description.title"
      class="originalImg"
      :style="originalImgStyle"
    />

    <div class="text-area">
      <h2 class="desc-title">{{ displayedTitle }}</h2>
      <p class="desc-content">
        {{ displayedContent }} <span v-show="isTyping">|</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    originalImgSrc: {
      type: String,
      default:
        "https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?fit=crop&crop=entropy&w=3456&h=2304",
    },
    placeholderSrc: {
      type: String,
      default:
        "https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?w=100",
    },
    description: {
      type: Object,
      default: () => ({
        title: "就决定是你了",
        content: "去吧，皮卡丘！使用十万伏特",
      }),
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    duration: {
      type: Number,
      default: 2000,
    },
  },
  data() {
    return {
      // 图片蒙版懒加载相关
      originalImgLoaded: false,
      showMask: !this.isActive,
      showOriginalImg: this.isActive,

      // 打字动画相关
      typingSpeed: 4,
      displayedTitle: "",
      displayedContent: "",
      isTyping: true,
      currentAction: "typing", // 'typing' 或 'deleting'
      typingInterval: null,
    };
  },
  computed: {
    originalImgStyle() {
      return {
        opacity: this.originalImgLoaded && this.showOriginalImg ? 1 : 0,
        transition: `${this.duration}ms ease`,
      };
    },
    // 计算每个字符的间隔时间（毫秒）
    charInterval() {
      return 1000 / this.typingSpeed;
    },
  },
  watch: {
    isActive(newVal) {
      if (newVal) {
        // 当前页变为活动页时
        if (this.originalImgLoaded) {
          this.showOriginalImg = true;
          setTimeout(() => {
            this.showMask = false;
            this.startTyping();
          }, this.duration);
        }
      } else {
        // 当前页变为非活动页时
        this.showOriginalImg = false;
        this.showMask = true;
        // 如果需要立即隐藏而不等待过渡，可以移除setTimeout
      }
    },
  },
  methods: {
    handleLoaded() {
      this.originalImgLoaded = true;
    },
    startTyping(loop = false) {
      this.typingSpeed = 4;
      this.clearInterval();
      this.currentAction = "typing";
      this.typeText(loop);
    },
    startDeleting(loop = true) {
      this.typingSpeed = 10;
      this.clearInterval();
      this.currentAction = "deleting";
      this.typeText(loop);
    },
    typeText(loop = false) {
      let titleIndex = 0;
      let contentIndex = 0;

      this.typingInterval = setInterval(() => {
        if (this.currentAction === "typing") {
          // 正向打字逻辑（保持不变）
          if (titleIndex < this.description.title.length) {
            this.displayedTitle = this.description.title.substring(
              0,
              titleIndex + 1
            );
            titleIndex++;
          } else if (contentIndex < this.description.content.length) {
            this.displayedContent = this.description.content.substring(
              0,
              contentIndex + 1
            );
            contentIndex++;
          } else {
            this.isTyping = false;
            this.clearInterval();
            if (loop) {
              setTimeout(() => this.startDeleting(), 1000);
            }
          }
        } else {
          // 修正后的反向删除逻辑
          if (this.displayedContent.length > 0) {
            this.displayedContent = this.displayedContent.substring(
              0,
              this.displayedContent.length - 1
            );
          } else if (this.displayedTitle.length > 0) {
            this.displayedTitle = this.displayedTitle.substring(
              0,
              this.displayedTitle.length - 1
            );
          } else {
            // 完全删除后重新开始打字
            if (loop) {
              setTimeout(() => {
                this.startTyping(true);
              }, 1000);
            } else {
              this.clearInterval();
            }
          }
        }
      }, this.charInterval);
    },
    clearInterval() {
      if (this.typingInterval) {
        clearInterval(this.typingInterval);
        this.typingInterval = null;
      }
    },
  },
  created() {
    this.showMask = !this.isActive;
  },
  mounted() {
    this.startTyping(true);
  },
  beforeUnmount() {
    this.clearInterval();
  },
};
</script>

<style lang="less" scoped>
.carousel-item {
  width: 100%;
  height: 100%;
  position: relative;
  // overflow: hidden;
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
  .text-area {
    position: absolute;
    left: 30px;
    top: 30%;
    letter-spacing: 3px;
    color: #fff;
    text-shadow: 1px 0 0 rgba(0, 0, 0, 0.5), -1px 0 0 rgba(0, 0, 0, 0.5),
      0 1px 0 rgba(0, 0, 0, 0.5), 0 -1px 0 rgba(0, 0, 0, 0.5);
    white-space: nowrap;
  }

  .desc-title {
    font-size: 24px;
    margin-bottom: 15px;
    min-height: 28px; /* 防止文字高度变化导致布局抖动 */
  }

  .desc-content {
    font-size: 16px;
    line-height: 1.5;
    min-height: 20px; /* 防止文字高度变化导致布局抖动 */
  }

  .desc-content span {
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
