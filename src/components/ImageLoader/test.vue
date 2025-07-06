<template>
    <div class="test-container">
        <ImageLoader
            originalSrc="https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?fit=crop&crop=entropy&w=3456&h=2304"
            placeholderSrc="https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?w=100"
            @handleImageLoader="handleLoaded" />
    </div>
</template>

<script>
import ImageLoader from "./index";
export default {
    components: {
        ImageLoader
    },
    methods: {
        handleLoaded() {
            console.log("ImageLoader组件load事件触发，图片加载完成");
        },
    },
};
</script>

<style scoped>
.test-container {
    width: 500px;
    height: 400px;
    border: 2px solid;
    margin: 0 auto;
}
</style>
