<template>
    <div class="test-container">
        <div>头像组件</div>
        <Avatar :src="AvatarPNG" :size="100"></Avatar>
    </div>
</template>

<script>
import Avatar from "./index.vue";
import AvatarPNG from "@/assets/avatar.png";
export default {
    data() {
        return {
            AvatarPNG
        }
    },
    components: {
        Avatar
    }
}
</script>

<style scoped>
.test-container {
    text-align: center;
}
</style>