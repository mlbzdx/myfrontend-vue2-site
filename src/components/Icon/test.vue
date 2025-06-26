<template>
    <div class="test-container">
        <div>图标组件</div>
        <Icon type="qq"></Icon>
    </div>
</template>

<script>
import Icon from "./index.vue"
export default {
    components: {
        Icon
    }
}
</script>

<style scoped>
.test-container {
    text-align: center;
}
</style>